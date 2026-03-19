#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (!args.length) {
  console.error(
    "Usage: node scripts/validate-claude-skill-pack.js <bundle-dir> [more-bundle-dirs...]"
  );
  process.exit(1);
}

let hadErrors = false;

for (const arg of args) {
  const bundlePath = path.resolve(process.cwd(), arg);
  const errors = validateBundle(bundlePath);
  if (errors.length) {
    hadErrors = true;
    console.error(`\n${arg}`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
  } else {
    console.log(`${arg}: OK`);
  }
}

process.exit(hadErrors ? 1 : 0);

function validateBundle(bundlePath) {
  const errors = [];

  if (!fs.existsSync(bundlePath)) {
    return [`bundle not found: ${bundlePath}`];
  }

  if (!fs.statSync(bundlePath).isDirectory()) {
    return [`bundle path must be a directory: ${bundlePath}`];
  }

  const skillPath = path.join(bundlePath, "SKILL.md");
  const manifestPath = path.join(bundlePath, "manifest.json");

  if (!fs.existsSync(skillPath)) {
    errors.push("missing required file: SKILL.md");
  }

  if (!fs.existsSync(manifestPath)) {
    errors.push("missing required file: manifest.json");
  }

  let frontmatter = null;
  let manifest = null;

  if (fs.existsSync(skillPath)) {
    const skillText = fs.readFileSync(skillPath, "utf8");
    frontmatter = parseFrontmatter(skillText, errors);
    if (frontmatter) {
      validateFrontmatter(frontmatter, errors);
      validateSkillReferences(bundlePath, skillText, errors);
    }
  }

  if (fs.existsSync(manifestPath)) {
    manifest = parseManifest(manifestPath, errors);
    if (manifest) {
      validateManifest(bundlePath, manifest, frontmatter, errors);
    }
  }

  return errors;
}

function parseFrontmatter(skillText, errors) {
  if (!skillText.startsWith("---\n")) {
    errors.push("SKILL.md must begin with YAML frontmatter");
    return null;
  }

  const closing = skillText.indexOf("\n---\n", 4);
  if (closing === -1) {
    errors.push("SKILL.md frontmatter is missing a closing --- delimiter");
    return null;
  }

  const block = skillText.slice(4, closing);
  const lines = block.split(/\r?\n/);
  const frontmatter = new Map();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const match = rawLine.match(/^([A-Za-z0-9_-]+):\s*(.+?)\s*$/);
    if (!match) {
      errors.push(`invalid frontmatter line: ${rawLine}`);
      continue;
    }

    const key = match[1];
    const value = stripQuotes(match[2]);
    if (frontmatter.has(key)) {
      errors.push(`duplicate frontmatter key: ${key}`);
      continue;
    }
    frontmatter.set(key, value);
  }

  return frontmatter;
}

function validateFrontmatter(frontmatter, errors) {
  const allowed = new Set(["name", "description"]);

  for (const key of frontmatter.keys()) {
    if (!allowed.has(key)) {
      errors.push(`undocumented frontmatter field emitted: ${key}`);
    }
  }

  const name = frontmatter.get("name");
  const description = frontmatter.get("description");

  if (!name) {
    errors.push("frontmatter missing required field: name");
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    errors.push(`frontmatter name must match ^[a-z0-9]+(?:-[a-z0-9]+)*$: ${name}`);
  }

  if (!description) {
    errors.push("frontmatter missing required field: description");
  }
}

function validateSkillReferences(bundlePath, skillText, errors) {
  const seen = new Set();
  const refPatterns = [
    /`((?:references|scripts|assets)\/[^`\n]+)`/g,
    /\[[^\]]+\]\(((?:references|scripts|assets)\/[^)\n]+)\)/g
  ];

  for (const pattern of refPatterns) {
    for (const match of skillText.matchAll(pattern)) {
      const ref = match[1];
      if (seen.has(ref)) {
        continue;
      }
      seen.add(ref);

      if (!isSafeRelativePath(ref)) {
        errors.push(`invalid internal reference path: ${ref}`);
        continue;
      }

      const refPath = path.join(bundlePath, ref);
      if (!fs.existsSync(refPath) || !fs.statSync(refPath).isFile()) {
        errors.push(`referenced file does not exist: ${ref}`);
      }
    }
  }
}

function parseManifest(manifestPath, errors) {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`manifest.json is not valid JSON: ${error.message}`);
    return null;
  }
}

function validateManifest(bundlePath, manifest, frontmatter, errors) {
  const required = [
    "tool_id",
    "version",
    "distribution",
    "entrypoint",
    "generated_from",
    "display_name",
    "description",
    "files"
  ];

  for (const key of required) {
    if (!(key in manifest)) {
      errors.push(`manifest.json missing required field: ${key}`);
    }
  }

  if (typeof manifest.tool_id !== "string" || !manifest.tool_id.trim()) {
    errors.push("manifest.json field tool_id must be a non-empty string");
  }

  if (typeof manifest.version !== "string" || !/^0\.4\.[0-9]+$/.test(manifest.version)) {
    errors.push(`manifest.json field version must match ^0.4.[patch]: ${manifest.version}`);
  }

  if (manifest.distribution !== "claude") {
    errors.push(`manifest.json field distribution must equal \"claude\": ${manifest.distribution}`);
  }

  if (manifest.entrypoint !== "SKILL.md") {
    errors.push(`manifest.json field entrypoint must equal SKILL.md: ${manifest.entrypoint}`);
  }

  if (
    typeof manifest.generated_from !== "string" ||
    !/^agents\/.+\/0\.4\.[0-9]+\.md$/.test(manifest.generated_from)
  ) {
    errors.push(
      `manifest.json field generated_from must match agents/<tool>/0.4.x.md: ${manifest.generated_from}`
    );
  }

  if (typeof manifest.display_name !== "string" || !manifest.display_name.trim()) {
    errors.push("manifest.json field display_name must be a non-empty string");
  }

  if (typeof manifest.description !== "string" || !manifest.description.trim()) {
    errors.push("manifest.json field description must be a non-empty string");
  }

  if (!Array.isArray(manifest.files)) {
    errors.push("manifest.json field files must be an array");
    return;
  }

  const files = manifest.files;
  const duplicates = findDuplicates(files);
  for (const duplicate of duplicates) {
    errors.push(`manifest.json files contains duplicate entry: ${duplicate}`);
  }

  const invalidPaths = files.filter(
    (file) => typeof file !== "string" || !file || !isSafeRelativePath(file)
  );
  for (const invalidPath of invalidPaths) {
    errors.push(`manifest.json files contains invalid path: ${String(invalidPath)}`);
  }

  if (!files.includes("SKILL.md")) {
    errors.push("manifest.json files must include SKILL.md");
  }

  if (!files.includes("manifest.json")) {
    errors.push("manifest.json files must include manifest.json");
  }

  const sortedFiles = [...files].sort((a, b) => a.localeCompare(b));
  if (JSON.stringify(sortedFiles) !== JSON.stringify(files)) {
    errors.push("manifest.json files must be sorted lexicographically");
  }

  const actualFiles = listBundleFiles(bundlePath);
  const actualSet = new Set(actualFiles);
  const manifestSet = new Set(files);

  for (const file of files) {
    if (!actualSet.has(file)) {
      errors.push(`manifest.json files references missing file: ${file}`);
    }
  }

  for (const file of actualFiles) {
    if (!manifestSet.has(file)) {
      errors.push(`manifest.json files is missing bundle file: ${file}`);
    }
  }

  if (
    frontmatter &&
    typeof manifest.description === "string" &&
    frontmatter.get("description") &&
    manifest.description !== frontmatter.get("description")
  ) {
    errors.push("manifest.json description must match SKILL.md frontmatter description");
  }
}

function listBundleFiles(bundlePath) {
  const files = [];
  walkFiles(bundlePath, bundlePath, files);
  return files.sort((a, b) => a.localeCompare(b));
}

function walkFiles(rootPath, currentPath, files) {
  for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
    const fullPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(rootPath, fullPath, files);
      continue;
    }
    if (entry.isFile()) {
      files.push(path.relative(rootPath, fullPath).split(path.sep).join("/"));
    }
  }
}

function stripQuotes(value) {
  let next = (value || "").trim();
  if (
    (next.startsWith('"') && next.endsWith('"')) ||
    (next.startsWith("'") && next.endsWith("'"))
  ) {
    next = next.slice(1, -1);
  }
  return next;
}

function isSafeRelativePath(filePath) {
  return (
    typeof filePath === "string" &&
    !!filePath &&
    !path.isAbsolute(filePath) &&
    !filePath.split("/").includes("..")
  );
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }
    seen.add(value);
  }
  return [...duplicates].sort((a, b) => String(a).localeCompare(String(b)));
}
