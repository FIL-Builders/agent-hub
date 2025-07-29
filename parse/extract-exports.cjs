#!/usr/bin/env node

const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const [, , pkgPath] = process.argv;

if (!pkgPath) {
  console.error("Usage: extract-exports <path-to-npm-package>");
  process.exit(1);
}

const project = new Project({ tsConfigFilePath: undefined });

function resolveEntryFiles(pkgPath) {
  const pkgJsonPath = path.resolve(pkgPath, "package.json");
  const entryFiles = new Set();

  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

    if (pkgJson.types) {
      const dtsPath = path.resolve(pkgPath, pkgJson.types);
      if (fs.existsSync(dtsPath)) entryFiles.add(dtsPath);
    }

    if (pkgJson.main) {
      const mainPath = path.resolve(pkgPath, pkgJson.main);
      if (fs.existsSync(mainPath)) entryFiles.add(mainPath);
    }
  }

  // Walk all .ts and .d.ts files under src.ts or src directories
  const patterns = ["src/**/*.ts", "src.ts/**/*.ts"];
  for (const pattern of patterns) {
    const matches = glob.sync(pattern, { cwd: pkgPath, absolute: true });
    matches.forEach(f => entryFiles.add(f));
  }

  return [...entryFiles];
}

const entryFiles = resolveEntryFiles(pkgPath);
if (entryFiles.length === 0) {
  console.error("No valid TypeScript files found under:", pkgPath);
  process.exit(1);
}

const exportsList = [];

function extractObjectProperties(symbol, prefix = "") {
  const type = symbol.getDeclaredType();
  const props = type.getProperties();
  for (const prop of props) {
    const name = prefix ? `${prefix}.${prop.getName()}` : prop.getName();
    const declarations = prop.getDeclarations();
    if (declarations.length === 0) continue;
    const decl = declarations[0];
    const kind = decl.getKindName();
    const sig = decl.getText().slice(0, 300);
    const jsDocs = (typeof decl.getJsDocs === "function") ? decl.getJsDocs() : [];
    const doc = jsDocs.map(d => d.getComment()).filter(Boolean).join("\n");
    const tags = [];
    for (const doc of jsDocs) {
      for (const tag of doc.getTags()) {
        tags.push({
          tagName: String(tag.getTagName()),
          text: tag.getCommentText() || tag.getComment()?.toString() || ""
        });
      }
    }
    exportsList.push({ name, kind, signature: sig, doc, tags });
    if (kind === "PropertySignature" || kind === "PropertyDeclaration") {
      const childType = prop.getDeclaredType();
      if (childType.getProperties().length > 0) {
        extractObjectProperties(prop, name);
      }
    }
  }
}

for (const entry of entryFiles) {
  const sourceFile = project.addSourceFileAtPath(entry);
  const exportsMap = sourceFile.getExportedDeclarations();
  exportsMap.forEach((decls, name) => {
    for (const decl of decls) {
      const kind = decl.getKindName();
      const signature = decl.getText().slice(0, 300);
      const jsDocs = (typeof decl.getJsDocs === "function") ? decl.getJsDocs() : [];
      const doc = jsDocs.map(d => d.getComment()).filter(Boolean).join("\n");
      const tags = [];
      for (const doc of jsDocs) {
        for (const tag of doc.getTags()) {
          tags.push({
            tagName: String(tag.getTagName()),
            text: tag.getCommentText() || tag.getComment()?.toString() || ""
          });
        }
      }

      exportsList.push({ name, kind, signature, doc, tags });

      if (kind === "VariableDeclaration") {
        const initializer = decl.getInitializer();
        if (initializer && initializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
          const symbol = decl.getSymbol();
          if (symbol) extractObjectProperties(symbol, name);
        }
      }

      if (kind === "FunctionDeclaration") {
        const type = decl.getReturnType();
        const symbol = type.getSymbol();
        if (symbol) extractObjectProperties(symbol, name);
      }
    }
  });
}

console.log(JSON.stringify({ exports: exportsList }, null, 2));
