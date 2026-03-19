#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const AGENTS_DIR = path.join(ROOT, "agents");
const OUTPUT_ROOT = path.join(ROOT, "distributions", "claude");
const PILOT_TOOLS = [
  "agent-hub",
  "react",
  "typescript",
  "nextjs",
  "playwright",
  "supabase-js",
  "scaffold-eth-2"
];

const SKILL_OVERRIDES = {
  "agent-hub": {
    description:
      "Use for Agent Hub MCP retrieval, pack discovery, version selection, onboarding, and pack-authoring workflow tasks. Helps with runtime context delivery, version pinning, and contribution decisions.",
    intro:
      "Use this skill when the task is about Agent Hub itself: fetching packs, choosing versions, onboarding an agent, or creating and revising Agent Hub packs.",
    useCases: [
      "Agent Hub MCP setup and verification",
      "pack discovery, version selection, and fetch decisions",
      "prompt-based onboarding and persistent routing guidance",
      "Agent Hub pack authoring and review workflow"
    ]
  },
  react: {
    description:
      "Use for React component, hooks, rendering, and performance tasks. Helps with API usage, debugging, and implementation decisions.",
    intro:
      "Use this skill when the task depends on React-specific component, hooks, rendering, or performance behavior and generic JavaScript advice is not enough.",
    useCases: [
      "component architecture and composition",
      "hooks usage, lifecycle, and state management",
      "rendering performance and responsiveness issues",
      "framework-specific migration and debugging"
    ]
  },
  typescript: {
    description:
      "Use for TypeScript typing, configuration, generics, and API-design tasks. Helps with compiler behavior, type modeling, and debugging decisions.",
    intro:
      "Use this skill when the task depends on TypeScript-specific typing or compiler behavior rather than generic JavaScript guidance.",
    useCases: [
      "type modeling and API design",
      "tsconfig and compiler configuration",
      "generics, inference, and narrowing",
      "type-level debugging and refactoring"
    ]
  },
  nextjs: {
    description:
      "Use for Next.js App Router, data fetching, rendering, and deployment tasks. Helps with framework APIs, routing, caching, and production debugging.",
    intro:
      "Use this skill when the task depends on Next.js framework behavior, especially App Router rendering, routing, caching, or deployment conventions.",
    useCases: [
      "App Router routing and layout structure",
      "server and client component boundaries",
      "data fetching, caching, and revalidation",
      "framework-specific debugging and deployment"
    ]
  },
  playwright: {
    description:
      "Use for Playwright testing, locator, tracing, and CI tasks. Helps with authoring stable tests, debugging failures, and runner configuration.",
    intro:
      "Use this skill when the task is about Playwright test authoring, locator strategy, tracing, fixtures, or CI execution.",
    useCases: [
      "stable locator and assertion design",
      "fixtures, projects, and test runner setup",
      "trace-based failure debugging",
      "CI and report configuration"
    ]
  },
  "supabase-js": {
    description:
      "Use for Supabase client setup, auth, database, storage, realtime, and Edge Function tasks. Helps with API usage, runtime boundaries, and debugging.",
    intro:
      "Use this skill when the task depends on Supabase client behavior across auth, database, storage, realtime, or Edge Function surfaces.",
    useCases: [
      "client initialization and runtime setup",
      "auth, session, and permission boundaries",
      "database, storage, and realtime operations",
      "Edge Function invocation and debugging"
    ]
  },
  "scaffold-eth-2": {
    description:
      "Use for Scaffold-ETH 2 app setup, contract/frontend workflow, deployment, and debugging tasks. Helps with the local dev loop, generated bindings, and app structure decisions.",
    intro:
      "Use this skill when the task depends on Scaffold-ETH 2 project structure, the contract and frontend workflow, or the built-in developer surfaces.",
    useCases: [
      "local three-terminal development workflow",
      "deploy to frontend metadata and bindings flow",
      "contract and frontend integration decisions",
      "Scaffold-ETH-specific debugging and environment setup"
    ]
  }
};

const args = process.argv.slice(2);
const options = {
  check: false,
  pilot: false,
  all: false
};

const inputArgs = [];
for (const arg of args) {
  if (arg === "--check") {
    options.check = true;
    continue;
  }
  if (arg === "--pilot") {
    options.pilot = true;
    continue;
  }
  if (arg === "--all") {
    options.all = true;
    continue;
  }
  inputArgs.push(arg);
}

const packPaths = resolveInputPackPaths(inputArgs, options);
if (!packPaths.length) {
  console.error(
    "Usage: node scripts/pack-to-claude-skill.js [--pilot] [--check] <pack.md> [more-pack.md...]"
  );
  process.exit(1);
}

let hadErrors = false;
for (const packPath of packPaths) {
  try {
    const bundle = compilePack(packPath);
    if (options.check) {
      const checkErrors = checkBundle(bundle.outputDir, bundle.files);
      if (checkErrors.length) {
        hadErrors = true;
        console.error(`\n${path.relative(ROOT, bundle.outputDir)}`);
        for (const error of checkErrors) {
          console.error(`- ${error}`);
        }
      } else {
        console.log(`${path.relative(ROOT, bundle.outputDir)}: OK`);
      }
    } else {
      writeBundle(bundle.outputDir, bundle.files);
      console.log(`${path.relative(ROOT, bundle.outputDir)}: generated`);
    }
  } catch (error) {
    hadErrors = true;
    console.error(`\n${path.relative(ROOT, packPath)}`);
    console.error(`- ${error.message}`);
  }
}

process.exit(hadErrors ? 1 : 0);

function resolveInputPackPaths(inputArgs, options) {
  if (options.all) {
    return listAllActivePackPaths();
  }
  if (options.pilot) {
    return PILOT_TOOLS.map((toolId) => path.join(AGENTS_DIR, toolId, "0.4.0.md"));
  }
  return inputArgs.map((arg) => path.resolve(process.cwd(), arg));
}

function listAllActivePackPaths() {
  const packPaths = [];
  for (const toolId of fs.readdirSync(AGENTS_DIR).sort((a, b) => a.localeCompare(b))) {
    const toolDir = path.join(AGENTS_DIR, toolId);
    if (!fs.statSync(toolDir).isDirectory()) {
      continue;
    }
    const candidate = path.join(toolDir, "0.4.0.md");
    if (fs.existsSync(candidate)) {
      packPaths.push(candidate);
    }
  }
  return packPaths;
}

function compilePack(packPath) {
  if (!fs.existsSync(packPath)) {
    throw new Error(`pack not found: ${packPath}`);
  }

  const toolId = path.basename(path.dirname(packPath));
  const version = path.basename(packPath, ".md");
  const text = fs.readFileSync(packPath, "utf8");
  const parsed = parsePack(text);
  const snapshot = parseSnapshot(parsed.getRequiredSection("Snapshot").lines);
  const purpose = normalizeParagraph(parsed.getRequiredSection("Purpose").lines.join(" "));
  const guidingPrinciples = collectBullets(parsed.getRequiredSection("Guiding Principles").lines);
  const designNotes = normalizeBlock(parsed.getRequiredSection("Design Notes").lines.join("\n"));
  const apiGroups = parsed.getRequiredSection("API Groups");
  const commonWorkflows = parsed.getOptionalSection("Common Workflows");
  const troubleshooting = parsed.getOptionalSection("Troubleshooting Cheatsheet");
  const faq = parsed.getOptionalSection("FAQ");
  const externalResources = parsed.getOptionalSection("External Resources");

  const displayName = parsed.title;
  const name = normalizeSkillName(toolId);
  const description = buildDescription(toolId, displayName, purpose);
  const references = new Map();

  references.set(
    "references/overview.md",
    buildOverviewMarkdown({
      displayName,
      snapshotLines: parsed.getRequiredSection("Snapshot").lines,
      purposeLines: parsed.getRequiredSection("Purpose").lines,
      guidingLines: parsed.getRequiredSection("Guiding Principles").lines,
      designNotes,
      faq,
      externalResources
    })
  );

  references.set(
    "references/api-groups.md",
    buildSectionFile(`${displayName} API Groups`, apiGroups.lines)
  );

  if (commonWorkflows) {
    references.set(
      "references/workflows.md",
      buildSectionFile(`${displayName} Workflows`, commonWorkflows.lines)
    );
  }

  if (troubleshooting) {
    references.set(
      "references/troubleshooting.md",
      buildSectionFile(`${displayName} Troubleshooting`, troubleshooting.lines)
    );
  }

  const skillFile = buildSkillMarkdown({
    toolId,
    displayName,
    description,
    purpose,
    guidingPrinciples,
    references: [...references.keys()]
  });

  const outputDir = path.join(OUTPUT_ROOT, toolId, version);
  const generatedFrom = path.relative(ROOT, packPath).split(path.sep).join("/");
  const files = new Map();

  files.set("SKILL.md", skillFile);
  for (const [filePath, content] of references) {
    files.set(filePath, content);
  }

  const manifestPaths = [...files.keys(), "manifest.json"].sort((a, b) => a.localeCompare(b));
  const manifest = {
    tool_id: snapshot.specName || toolId,
    version: snapshot.specVersion || version,
    distribution: "claude",
    entrypoint: "SKILL.md",
    generated_from: generatedFrom,
    display_name: displayName,
    description,
    files: manifestPaths
  };
  files.set("manifest.json", JSON.stringify(manifest, null, 2) + "\n");

  return {
    outputDir,
    files
  };
}

function parsePack(text) {
  const lines = text.split(/\r?\n/);
  if (!lines[0] || !/^#\s+/.test(lines[0])) {
    throw new Error("pack is missing a level-1 title");
  }

  const title = lines[0].replace(/^#\s+/, "").trim();
  const sections = [];
  let current = null;

  for (let i = 1; i < lines.length; i += 1) {
    const match = lines[i].match(/^##\s+(.+?)\s*$/);
    if (match) {
      if (current) {
        current.lines = trimEmptyEdges(lines.slice(current.start + 1, i));
        sections.push(current);
      }
      current = { title: match[1], start: i, lines: [] };
    }
  }

  if (current) {
    current.lines = trimEmptyEdges(lines.slice(current.start + 1));
    sections.push(current);
  }

  return {
    title,
    sections,
    getRequiredSection(title) {
      const section = sections.find((entry) => entry.title === title);
      if (!section) {
        throw new Error(`missing required section: ## ${title}`);
      }
      return section;
    },
    getOptionalSection(title) {
      return sections.find((entry) => entry.title === title) || null;
    }
  };
}

function parseSnapshot(lines) {
  const fields = {};
  for (const line of lines) {
    const match = line.match(/^-\s+([^:]+):\s+(.+)$/);
    if (!match) {
      continue;
    }
    fields[toCamelCase(match[1].trim())] = match[2].trim();
  }
  return fields;
}

function buildOverviewMarkdown({
  displayName,
  snapshotLines,
  purposeLines,
  guidingLines,
  designNotes,
  faq,
  externalResources
}) {
  const parts = [`# ${displayName} Overview`, ""];

  pushSection(parts, "Snapshot", snapshotLines);
  pushSection(parts, "Purpose", purposeLines);
  pushSection(parts, "Guiding Principles", guidingLines);

  if (designNotes) {
    pushSection(parts, "Boundary Notes", designNotes.split("\n"));
  }

  if (faq) {
    pushSection(parts, "FAQ", faq.lines);
  }

  if (externalResources) {
    pushSection(parts, "External Resources", externalResources.lines);
  }

  return normalizeMarkdown(parts.join("\n"));
}

function buildSectionFile(title, lines) {
  return normalizeMarkdown([`# ${title}`, "", ...lines].join("\n"));
}

function buildSkillMarkdown({ toolId, displayName, description, purpose, guidingPrinciples, references }) {
  const override = SKILL_OVERRIDES[toolId] || {};
  const intro =
    override.intro ||
    `Use this skill when the task depends on ${displayName}-specific APIs, workflows, or debugging guidance rather than generic library advice.`;
  const useCases =
    override.useCases || [
      `${displayName} setup and implementation work`,
      `${displayName} API usage and configuration decisions`,
      `${displayName}-specific debugging and maintenance`,
      "version-sensitive framework or tool guidance"
    ];
  const skillPurpose = purpose
    .replace(/^This pack teaches an agent to\s*/i, "This skill teaches an agent to ")
    .replace(/^This pack teaches\s*/i, "This skill teaches ");

  const parts = [
    "---",
    `name: ${normalizeSkillName(toolId)}`,
    `description: ${description}`,
    "---",
    "",
    `# ${displayName}`,
    "",
    intro,
    "",
    "## Purpose",
    "",
    skillPurpose,
    "",
    "## When to use this skill",
    "",
    ...useCases.map((entry) => `- ${entry}`),
    "",
    "## Working style",
    "",
    ...guidingPrinciples.slice(0, 3).map((entry) => `- ${entry}`),
    ""
  ];

  if (references.length) {
    parts.push("## Read next", "");
    parts.push("- For overview and boundaries: `references/overview.md`");
    parts.push("- For the core API surface: `references/api-groups.md`");
    if (references.includes("references/workflows.md")) {
      parts.push("- For common workflows: `references/workflows.md`");
    }
    if (references.includes("references/troubleshooting.md")) {
      parts.push("- For debugging and fixes: `references/troubleshooting.md`");
    }
    parts.push("");
  }

  return normalizeMarkdown(parts.join("\n"));
}

function buildDescription(toolId, displayName, purpose) {
  const override = SKILL_OVERRIDES[toolId];
  if (override?.description) {
    return override.description;
  }

  const summary = purpose
    .replace(/^This pack teaches an agent to\s*/i, "")
    .replace(/^use\s+/i, "")
    .replace(/\.$/, "");

  return `Use for ${displayName} tasks. Helps with ${lowercaseFirst(summary)}.`;
}

function normalizeSkillName(toolId) {
  return toolId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function writeBundle(outputDir, files) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  for (const [relativePath, content] of files) {
    const targetPath = path.join(outputDir, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content);
  }
}

function checkBundle(outputDir, files) {
  const errors = [];
  if (!fs.existsSync(outputDir)) {
    return [`generated bundle directory is missing: ${path.relative(ROOT, outputDir)}`];
  }

  const actualFiles = listFiles(outputDir);
  const expectedFiles = [...files.keys()].sort((a, b) => a.localeCompare(b));
  const actualSet = new Set(actualFiles);
  const expectedSet = new Set(expectedFiles);

  for (const file of expectedFiles) {
    if (!actualSet.has(file)) {
      errors.push(`missing committed file: ${file}`);
      continue;
    }
    const current = fs.readFileSync(path.join(outputDir, file), "utf8");
    const expected = files.get(file);
    if (current !== expected) {
      errors.push(`file content drift detected: ${file}`);
    }
  }

  for (const file of actualFiles) {
    if (!expectedSet.has(file)) {
      errors.push(`unexpected committed file present: ${file}`);
    }
  }

  return errors;
}

function listFiles(rootDir) {
  const files = [];
  walk(rootDir, rootDir, files);
  return files.sort((a, b) => a.localeCompare(b));
}

function walk(rootDir, currentDir, files) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      walk(rootDir, fullPath, files);
      continue;
    }
    if (entry.isFile()) {
      files.push(path.relative(rootDir, fullPath).split(path.sep).join("/"));
    }
  }
}

function trimEmptyEdges(lines) {
  let start = 0;
  let end = lines.length;
  while (start < end && !lines[start].trim()) {
    start += 1;
  }
  while (end > start && !lines[end - 1].trim()) {
    end -= 1;
  }
  return lines.slice(start, end);
}

function collectBullets(lines) {
  return lines
    .map((line) => line.trim())
    .filter((line) => /^-\s+/.test(line))
    .map((line) => line.replace(/^-+\s+/, ""));
}

function pushSection(parts, title, lines) {
  if (!lines || !lines.length) {
    return;
  }
  parts.push(`## ${title}`, "", ...lines, "");
}

function normalizeParagraph(text) {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeBlock(text) {
  return trimEmptyEdges(text.split("\n")).join("\n").trim();
}

function normalizeMarkdown(text) {
  return text.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function toCamelCase(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+([a-z0-9])/g, (_, next) => next.toUpperCase())
    .replace(/[^a-z0-9]/g, "");
}

function lowercaseFirst(text) {
  if (!text) {
    return "";
  }
  return text.charAt(0).toLowerCase() + text.slice(1);
}
