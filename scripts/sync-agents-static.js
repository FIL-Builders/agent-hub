const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const AGENTS_DIR = path.join(ROOT, "agents");
const DISTRIBUTIONS_DIR = path.join(ROOT, "distributions");
const STATIC_AGENTS_DIR = path.join(ROOT, "website/static/agents");
const STATIC_DISTRIBUTIONS_DIR = path.join(ROOT, "website/static/distributions");
const GENERATED_DIR = path.join(ROOT, "website/src/generated");
const INDEX_FILE = path.join(GENERATED_DIR, "agent-index.json");
const DISTRIBUTION_INDEX_FILE = path.join(GENERATED_DIR, "distribution-index.json");

function countIndent(line) {
  return (line.match(/^\s*/)?.[0] || "").length;
}

function stripQuotes(value) {
  let next = (value || "").trim();
  if ((next.startsWith('"') && next.endsWith('"')) || (next.startsWith("'") && next.endsWith("'"))) {
    next = next.slice(1, -1);
  }
  return next;
}

function splitFrontmatter(specText = "") {
  if (!specText.startsWith("---\n")) {
    return { frontmatter: "", body: specText };
  }

  const closing = specText.indexOf("\n---\n", 4);
  if (closing === -1) {
    return { frontmatter: "", body: specText };
  }

  return {
    frontmatter: specText.slice(4, closing),
    body: specText.slice(closing + 5),
  };
}

function extractMetaLines(specText = "") {
  const { frontmatter } = splitFrontmatter(specText);
  const source = frontmatter || specText;
  const lines = source.split("\n");
  const idx = lines.findIndex((line) => /^\s*meta:\s*$/.test(line));
  if (idx === -1) {
    return [];
  }

  const metaIndent = countIndent(lines[idx]);
  const metaLines = [];
  for (let i = idx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "") {
      metaLines.push(line);
      continue;
    }
    const indent = countIndent(line);
    if (indent <= metaIndent) {
      break;
    }
    metaLines.push(line);
  }
  return metaLines;
}

function readScalar(metaLines, key) {
  const re = new RegExp(`^\\s*${key}\\s*:\\s*(.*)$`);
  for (const line of metaLines) {
    const match = line.match(re);
    if (match) {
      return stripQuotes(match[1] || "");
    }
  }
  return "";
}

function readBlockScalar(metaLines, key) {
  for (let i = 0; i < metaLines.length; i += 1) {
    const line = metaLines[i];
    const match = line.match(new RegExp(`^\\s*${key}\\s*:\\s*(.*)$`));
    if (!match) {
      continue;
    }

    const suffix = (match[1] || "").trim();
    const baseIndent = countIndent(line);
    if (suffix && suffix !== "|" && suffix !== ">") {
      return stripQuotes(suffix);
    }

    const block = [];
    for (let j = i + 1; j < metaLines.length; j += 1) {
      const nextLine = metaLines[j];
      const indent = countIndent(nextLine);
      if (nextLine.trim() && indent <= baseIndent) {
        break;
      }
      if (!nextLine.trim()) {
        block.push("");
        continue;
      }
      block.push(nextLine.slice(baseIndent + 2));
    }

    return (suffix === "|" ? block.join("\n") : block.join(" ")).trim();
  }

  return "";
}

function parseMeta(specText) {
  const metaLines = extractMetaLines(specText);
  if (metaLines.length) {
    return {
      specName: readScalar(metaLines, "spec_name") || readScalar(metaLines, "library_name"),
      language: readScalar(metaLines, "language").toLowerCase(),
      purpose: readBlockScalar(metaLines, "purpose"),
    };
  }

  return parseStructuredMarkdownMeta(specText);
}

function parseStructuredMarkdownMeta(specText) {
  const lines = specText.split("\n");
  const title = lines[0]?.match(/^#\s+(.+)$/)?.[1]?.trim() || "";

  const snapshotLines = getH2SectionLines(lines, "Snapshot");
  const purposeLines = getH2SectionLines(lines, "Purpose");

  const snapshotMap = new Map();
  for (const line of snapshotLines) {
    const match = line.match(/^-\s+([^:]+):\s+(.+)$/);
    if (match) {
      snapshotMap.set(match[1].trim(), match[2].trim());
    }
  }

  return {
    specName: snapshotMap.get("Spec name") || title,
    language: (snapshotMap.get("Primary language") || "").toLowerCase(),
    purpose: purposeLines.join(" ").replace(/\s+/g, " ").trim(),
  };
}

function getH2SectionLines(lines, sectionTitle) {
  const start = lines.findIndex((line) => line.trim() === `## ${sectionTitle}`);
  if (start === -1) {
    return [];
  }

  const sectionLines = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      break;
    }
    sectionLines.push(lines[i]);
  }

  while (sectionLines.length && !sectionLines[0].trim()) {
    sectionLines.shift();
  }
  while (sectionLines.length && !sectionLines[sectionLines.length - 1].trim()) {
    sectionLines.pop();
  }

  return sectionLines;
}

function copyRecursive(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(src, dest);
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }
}

function buildIndex() {
  const specs = [];
  for (const project of fs.readdirSync(AGENTS_DIR)) {
    const projectDir = path.join(AGENTS_DIR, project);
    if (!fs.statSync(projectDir).isDirectory()) {
      continue;
    }

    for (const file of fs.readdirSync(projectDir)) {
      if (!/^\d+\.\d+\.\d+\.md$/i.test(file)) {
        continue;
      }

      const specText = fs.readFileSync(path.join(projectDir, file), "utf8");
      specs.push({
        project,
        file,
        ...parseMeta(specText),
      });
    }
  }

  return specs.sort((a, b) => {
    if (a.project !== b.project) {
      return a.project.localeCompare(b.project);
    }
    return a.file.localeCompare(b.file);
  });
}

function buildDistributionIndex() {
  const distributions = [];

  if (!fs.existsSync(DISTRIBUTIONS_DIR)) {
    return distributions;
  }

  const claudeRoot = path.join(DISTRIBUTIONS_DIR, "claude");
  if (!fs.existsSync(claudeRoot)) {
    return distributions;
  }

  for (const project of fs.readdirSync(claudeRoot)) {
    const projectDir = path.join(claudeRoot, project);
    if (!fs.statSync(projectDir).isDirectory()) {
      continue;
    }

    for (const version of fs.readdirSync(projectDir)) {
      const versionDir = path.join(projectDir, version);
      const manifestPath = path.join(versionDir, "manifest.json");
      if (!fs.statSync(versionDir).isDirectory() || !fs.existsSync(manifestPath)) {
        continue;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      distributions.push({
        project,
        version,
        distribution: manifest.distribution || "claude",
        entrypoint: manifest.entrypoint || "SKILL.md",
        displayName: manifest.display_name || project,
        description: manifest.description || "",
        files: Array.isArray(manifest.files) ? manifest.files : [],
      });
    }
  }

  return distributions.sort((a, b) => {
    if (a.project !== b.project) {
      return a.project.localeCompare(b.project);
    }
    return a.version.localeCompare(b.version);
  });
}

fs.rmSync(STATIC_AGENTS_DIR, { recursive: true, force: true });
fs.rmSync(STATIC_DISTRIBUTIONS_DIR, { recursive: true, force: true });
copyRecursive(AGENTS_DIR, STATIC_AGENTS_DIR);
if (fs.existsSync(DISTRIBUTIONS_DIR)) {
  copyRecursive(DISTRIBUTIONS_DIR, STATIC_DISTRIBUTIONS_DIR);
}
fs.mkdirSync(GENERATED_DIR, { recursive: true });
fs.writeFileSync(INDEX_FILE, JSON.stringify(buildIndex(), null, 2) + "\n");
fs.writeFileSync(DISTRIBUTION_INDEX_FILE, JSON.stringify(buildDistributionIndex(), null, 2) + "\n");

console.log(`✅ Agent specs synced to ${STATIC_AGENTS_DIR}`);
console.log(`✅ Distributions synced to ${STATIC_DISTRIBUTIONS_DIR}`);
console.log(`✅ Agent index written to ${INDEX_FILE}`);
console.log(`✅ Distribution index written to ${DISTRIBUTION_INDEX_FILE}`);
