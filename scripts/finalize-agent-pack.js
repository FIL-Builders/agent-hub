#!/usr/bin/env node

const {spawnSync} = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Usage: node scripts/finalize-agent-pack.js agents/<tool>/<version>.md');
  process.exit(1);
}

const packArg = args[0];
const packPath = path.resolve(process.cwd(), packArg);

if (!fs.existsSync(packPath)) {
  console.error(`Pack not found: ${packArg}`);
  process.exit(1);
}

const version = path.basename(packPath, '.md');
const toolId = path.basename(path.dirname(packPath));
const claudeDir = path.join('distributions', 'claude', toolId, version);

run('Validate canonical pack', 'node', ['scripts/validate-agent-pack-v0.4.0.js', packArg]);
run('Generate Claude-compatible skill', 'node', ['scripts/pack-to-claude-skill.js', packArg]);
run('Validate Claude-compatible skill', 'node', ['scripts/validate-claude-skill-pack.js', claudeDir]);

console.log('');
console.log('Finalized pack output:');
console.log(`- canonical: ${packArg}`);
console.log(`- claude: ${claudeDir}`);

function run(label, command, commandArgs) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
