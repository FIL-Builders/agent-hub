/*
  Copy YAML agent specs from the repo-level `agents` folder into
  the website's `static/agents` directory so they are publicly
  accessible at runtime under `/agents/...`.
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.resolve(root, '..', 'agents');
const destDir = path.resolve(root, 'static', 'agents');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyYamlFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  ensureDir(dest);
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyYamlFiles(srcPath, destPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.yaml')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(srcDir)) {
  console.warn(`[copy-agents] Source agents directory not found: ${srcDir}`);
  process.exit(0);
}

ensureDir(destDir);
copyYamlFiles(srcDir, destDir);
console.log(`[copy-agents] Copied YAML specs from ${srcDir} to ${destDir}`);

