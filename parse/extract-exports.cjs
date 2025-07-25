#!/usr/bin/env node

const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");
const fs = require("fs");

const [, , pkgPath] = process.argv;

if (!pkgPath) {
  console.error("Usage: extract-exports <path-to-npm-package>");
  process.exit(1);
}

const pkgJsonPath = path.resolve(pkgPath, "package.json");
if (!fs.existsSync(pkgJsonPath)) {
  console.error("Invalid package path: package.json not found");
  process.exit(1);
}

const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

const tsEntry = path.resolve(pkgPath, "src/index.ts");
const dtsEntry = path.resolve(pkgPath, pkgJson.types || "index.d.ts");
let entry = null;

if (fs.existsSync(dtsEntry)) {
  entry = dtsEntry;
} else if (fs.existsSync(tsEntry)) {
  entry = tsEntry;
} else {
  entry = path.resolve(pkgPath, pkgJson.main || "index.js");
  if (!fs.existsSync(entry)) {
    console.error("Entry point not found:", entry);
    process.exit(1);
  }
}

const project = new Project({ tsConfigFilePath: undefined });
const sourceFile = project.addSourceFileAtPath(entry);
const typeChecker = project.getTypeChecker();

const exportsMap = sourceFile.getExportedDeclarations();
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
    exportsList.push(JSON.parse(JSON.stringify({ name, kind, signature: sig, doc, tags })));
    if (kind === "PropertySignature" || kind === "PropertyDeclaration") {
      const childType = prop.getDeclaredType();
      if (childType.getProperties().length > 0) {
        extractObjectProperties(prop, name);
      }
    }
  }
}

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

    exportsList.push(JSON.parse(JSON.stringify({ name, kind, signature, doc, tags })));

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

console.log(JSON.stringify({ exports: exportsList }, null, 2));
