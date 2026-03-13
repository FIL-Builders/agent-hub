#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (!args.length) {
  console.error("Usage: node scripts/validate-agent-pack-v0.4.0.js <pack.md> [more-files...]");
  process.exit(1);
}

let hadErrors = false;

for (const fileArg of args) {
  const filePath = path.resolve(process.cwd(), fileArg);
  const errors = validatePack(filePath);
  if (errors.length) {
    hadErrors = true;
    console.error(`\n${fileArg}`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
  } else {
    console.log(`${fileArg}: OK`);
  }
}

process.exit(hadErrors ? 1 : 0);

function validatePack(filePath) {
  const errors = [];

  if (!fs.existsSync(filePath)) {
    return [`file not found: ${filePath}`];
  }

  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);
  const sections = parseSectionsFromLines(lines, 2);

  if (!lines[0] || !/^#\s+.+/.test(lines[0])) {
    errors.push("first line must be a level-1 title");
  }

  const requiredH2 = [
    "Snapshot",
    "Purpose",
    "Guiding Principles",
    "Design Notes",
    "API Groups"
  ];

  const h2Order = sections.filter((section) => section.level === 2).map((section) => section.title);
  let lastIndex = -1;
  for (const title of requiredH2) {
    const index = h2Order.indexOf(title);
    if (index === -1) {
      errors.push(`missing required section: ## ${title}`);
      continue;
    }
    if (index < lastIndex) {
      errors.push(`required section out of order: ## ${title}`);
    }
    lastIndex = index;
  }

  const snapshot = getSection(sections, 2, "Snapshot");
  if (!snapshot) {
    return errors;
  }

  validateSnapshot(snapshot.lines, errors);
  validateGuidingPrinciples(getSection(sections, 2, "Guiding Principles"), errors);
  validateApiGroups(getSection(sections, 2, "API Groups"), errors);
  validateOptionalSections(sections, errors);

  return errors;
}

function getSection(sections, level, title) {
  return sections.find((section) => section.level === level && section.title === title);
}

function validateSnapshot(lines, errors) {
  const bulletMap = new Map();
  for (const line of lines) {
    const match = line.match(/^-\s+([^:]+):\s+(.+)$/);
    if (match) {
      bulletMap.set(match[1].trim(), match[2].trim());
    }
  }

  const required = ["Spec name", "Spec version", "Generated", "Library version"];
  for (const key of required) {
    if (!bulletMap.has(key)) {
      errors.push(`Snapshot missing required bullet: ${key}`);
    }
  }

  const specName = bulletMap.get("Spec name");
  if (specName && !/^[a-z0-9]+([-/][a-z0-9]+)*$/.test(specName)) {
    errors.push(`Spec name has invalid format: ${specName}`);
  }

  const specVersion = bulletMap.get("Spec version");
  if (specVersion && !/^0\.4\.[0-9]+$/.test(specVersion)) {
    errors.push(`Spec version must match ^0.4.[patch]: ${specVersion}`);
  }

  const generated = bulletMap.get("Generated");
  if (generated && !/^\d{4}-\d{2}-\d{2}$/.test(generated)) {
    errors.push(`Generated must use YYYY-MM-DD: ${generated}`);
  }

  const tagsIndex = lines.findIndex((line) => line.trim() === "**Tags**");
  if (tagsIndex !== -1) {
    const tags = [];
    for (let i = tagsIndex + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) {
        if (tags.length) {
          break;
        }
        continue;
      }
      if (/^-\s+/.test(line)) {
        tags.push(line.replace(/^-+\s+/, "").trim());
        continue;
      }
      break;
    }
    if (!tags.length) {
      errors.push("Tags field is present but contains no list items");
    }
    const uniqueTags = new Set(tags);
    if (uniqueTags.size !== tags.length) {
      errors.push("Tags list contains duplicate values");
    }
  }
}

function validateGuidingPrinciples(section, errors) {
  if (!section) {
    return;
  }
  const bullets = section.lines.filter((line) => /^-\s+/.test(line.trim()));
  if (bullets.length < 3 || bullets.length > 10) {
    errors.push("Guiding Principles must contain 3 to 10 bullet items");
  }
}

function validateApiGroups(section, errors) {
  if (!section) {
    return;
  }

  const groups = parseNestedSections(section.lines, 3, 4);
  if (!groups.length) {
    errors.push("API Groups must contain at least one level-3 group");
    return;
  }

  const seenGroupNames = new Set();
  const globalExports = new Set();

  for (const group of groups) {
    if (!group.title.trim()) {
      errors.push("API group has an empty title");
    }
    if (seenGroupNames.has(group.title)) {
      errors.push(`duplicate API group name: ${group.title}`);
    }
    seenGroupNames.add(group.title);

    const exportList = parseNamedList(group.lines, "**Exports**");
    if (!exportList.length) {
      errors.push(`group "${group.title}" must have an **Exports** list with at least one item`);
      continue;
    }

    for (const exportName of exportList) {
      if (globalExports.has(exportName)) {
        errors.push(`duplicate export across groups: ${exportName}`);
      }
      globalExports.add(exportName);
    }

    const symbols = parseSectionsFromLines(group.lines, 4);
    const symbolTitles = new Set(symbols.map((symbol) => symbol.title));

    for (const exportName of exportList) {
      if (!symbolTitles.has(exportName)) {
        errors.push(`group "${group.title}" export "${exportName}" is missing a matching symbol subsection`);
      }
    }

    for (const symbol of symbols) {
      if (!exportList.includes(symbol.title)) {
        errors.push(`group "${group.title}" symbol "${symbol.title}" is not declared in **Exports**`);
      }
      validateSymbol(symbol, errors);
    }
  }
}

function validateSymbol(symbol, errors) {
  const lines = symbol.lines;
  const requiredFields = ["**Kind**", "**Summary**", "**Definition**", "**Guidance**", "**Example**"];
  const positions = [];

  for (const field of requiredFields) {
    const index = lines.findIndex((line) => line.trim() === field);
    if (index === -1) {
      errors.push(`symbol "${symbol.title}" is missing required field ${field}`);
      return;
    }
    positions.push(index);
  }

  for (let i = 1; i < positions.length; i += 1) {
    if (positions[i] <= positions[i - 1]) {
      errors.push(`symbol "${symbol.title}" fields are out of order`);
      return;
    }
  }

  const kindIndex = positions[0];
  const kindValue = firstContentLine(lines, kindIndex + 1, positions[1]);
  const allowedKinds = new Set([
    "function",
    "hook",
    "component",
    "class",
    "constant",
    "type",
    "interface",
    "object",
    "endpoint",
    "config",
    "workflow",
    "other"
  ]);
  if (!kindValue || !allowedKinds.has(kindValue)) {
    errors.push(`symbol "${symbol.title}" has invalid Kind value: ${kindValue || "<missing>"}`);
  }

  const definitionIndex = positions[2];
  const guidanceIndex = positions[3];
  const exampleIndex = positions[4];

  const definitionLines = lines.slice(definitionIndex + 1, guidanceIndex);
  if (!definitionLines.some((line) => /^Language:\s+\S+/.test(line.trim()))) {
    errors.push(`symbol "${symbol.title}" Definition must begin with a Language line`);
  }
  if (!hasCodeFence(definitionLines)) {
    errors.push(`symbol "${symbol.title}" Definition must contain a fenced code block`);
  }

  const guidanceLines = lines.slice(guidanceIndex + 1, exampleIndex);
  const guidanceBullets = guidanceLines.filter((line) => /^-\s+/.test(line.trim()));
  if (!guidanceBullets.length) {
    errors.push(`symbol "${symbol.title}" Guidance must contain at least one bullet`);
  }

  const nextFieldIndex = lines.findIndex((line, idx) => idx > exampleIndex && /^\*\*(Since|Deprecated)\*\*$/.test(line.trim()));
  const exampleLines = lines.slice(exampleIndex + 1, nextFieldIndex === -1 ? lines.length : nextFieldIndex);
  if (!hasCodeFence(exampleLines)) {
    errors.push(`symbol "${symbol.title}" Example must contain a fenced code block`);
  }

  const sinceIndex = lines.findIndex((line) => line.trim() === "**Since**");
  const deprecatedIndex = lines.findIndex((line) => line.trim() === "**Deprecated**");
  if (sinceIndex !== -1 && sinceIndex <= exampleIndex) {
    errors.push(`symbol "${symbol.title}" Since must appear after Example`);
  }
  if (deprecatedIndex !== -1) {
    if (sinceIndex !== -1 && deprecatedIndex <= sinceIndex) {
      errors.push(`symbol "${symbol.title}" Deprecated must appear after Since`);
    }
    if (sinceIndex === -1 && deprecatedIndex <= exampleIndex) {
      errors.push(`symbol "${symbol.title}" Deprecated must appear after Example`);
    }
  }
}

function validateOptionalSections(sections, errors) {
  validateCommonWorkflows(getSection(sections, 2, "Common Workflows"), errors);
  validateTroubleshooting(getSection(sections, 2, "Troubleshooting Cheatsheet"), errors);
  validateFaq(getSection(sections, 2, "FAQ"), errors);
  validateExternalResources(getSection(sections, 2, "External Resources"), errors);
}

function validateCommonWorkflows(section, errors) {
  if (!section) {
    return;
  }
  const entries = parseSectionsFromLines(section.lines, 3);
  if (!entries.length) {
    errors.push("Common Workflows must contain at least one workflow entry");
    return;
  }
  for (const entry of entries) {
    const hasOrderedStep = entry.lines.some((line) => /^\d+\.\s+/.test(line.trim()));
    if (!hasOrderedStep) {
      errors.push(`workflow "${entry.title}" must contain at least one ordered step`);
    }
  }
}

function validateTroubleshooting(section, errors) {
  if (!section) {
    return;
  }
  const entries = parseSectionsFromLines(section.lines, 3);
  if (!entries.length) {
    errors.push("Troubleshooting Cheatsheet must contain at least one entry");
    return;
  }
  for (const entry of entries) {
    if (!entry.lines.some((line) => line.trim() === "**Cause**")) {
      errors.push(`troubleshooting entry "${entry.title}" is missing **Cause**`);
    }
    if (!entry.lines.some((line) => line.trim() === "**Fix**")) {
      errors.push(`troubleshooting entry "${entry.title}" is missing **Fix**`);
    }
  }
}

function validateFaq(section, errors) {
  if (!section) {
    return;
  }
  const entries = parseSectionsFromLines(section.lines, 3);
  if (!entries.length) {
    errors.push("FAQ must contain at least one entry");
    return;
  }
  for (const entry of entries) {
    const content = entry.lines.join("\n").trim();
    if (!content) {
      errors.push(`FAQ entry "${entry.title}" must contain an answer`);
    }
  }
}

function validateExternalResources(section, errors) {
  if (!section) {
    return;
  }
  const items = section.lines.filter((line) => /^-\s+/.test(line.trim()));
  if (!items.length) {
    errors.push("External Resources must contain at least one bullet item");
    return;
  }
  for (const item of items) {
    if (!/^-\s+.+:\s+https?:\/\/\S+/.test(item.trim())) {
      errors.push(`invalid External Resources item: ${item.trim()}`);
    }
  }
}

function parseNestedSections(lines, level, childLevel) {
  const sections = parseSectionsFromLines(lines, level);
  return sections.map((section) => ({
    ...section,
    childLevel
  }));
}

function parseSectionsFromLines(lines, level) {
  const sections = [];
  let current = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(new RegExp(`^#{${level}}\\s+(.+?)\\s*$`));
    if (match) {
      if (current) {
        current.lines = lines.slice(current.start + 1, i);
        sections.push(current);
      }
      current = { level, title: match[1], start: i, lines: [] };
    }
  }
  if (current) {
    current.lines = lines.slice(current.start + 1);
    sections.push(current);
  }
  return sections;
}

function parseNamedList(lines, label) {
  const index = lines.findIndex((line) => line.trim() === label);
  if (index === -1) {
    return [];
  }
  const items = [];
  for (let i = index + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) {
      if (items.length) {
        break;
      }
      continue;
    }
    if (/^-\s+/.test(line.trim())) {
      items.push(line.trim().replace(/^-+\s+/, ""));
      continue;
    }
    break;
  }
  return items;
}

function firstContentLine(lines, start, end) {
  for (let i = start; i < end; i += 1) {
    const line = lines[i].trim();
    if (line) {
      return line;
    }
  }
  return "";
}

function hasCodeFence(lines) {
  return lines.some((line) => /^```/.test(line.trim()));
}
