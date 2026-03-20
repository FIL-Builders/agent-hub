#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const PILOT_SKILLS = [
  'agent-hub',
  'react',
  'typescript',
  'nextjs',
  'playwright',
  'supabase-js',
  'scaffold-eth-2',
];

function parseArgs(argv) {
  const options = {
    pilot: false,
    global: false,
    project: false,
    target: '',
    version: '0.4.0',
    skills: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--pilot') {
      options.pilot = true;
      continue;
    }

    if (arg === '--global') {
      options.global = true;
      continue;
    }

    if (arg === '--project') {
      options.project = true;
      continue;
    }

    if (arg === '--target') {
      options.target = argv[index + 1] || '';
      index += 1;
      continue;
    }

    if (arg === '--version') {
      options.version = argv[index + 1] || options.version;
      index += 1;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown flag: ${arg}`);
    }

    options.skills.push(arg);
  }

  return options;
}

function printHelp() {
  console.log(`
Install generated Claude-compatible skill bundles into a local skills directory.

Usage:
  node scripts/install-claude-skill.js [skill-id ...] [--version 0.4.0] [--project|--global|--target <path>]
  node scripts/install-claude-skill.js --pilot [--project|--global|--target <path>]

Examples:
  npm run install:claude-skill -- agent-hub --project
  npm run install:claude-skill -- react playwright --global
  npm run install:claude-skill:pilot

Defaults:
  - installs version 0.4.0
  - installs into .claude/skills in the current working directory unless --global or --target is set
  `);
}

function resolveInstallRoot(options) {
  if (options.target) {
    return path.resolve(options.target);
  }

  if (options.global) {
    return path.join(os.homedir(), '.claude', 'skills');
  }

  return path.resolve('.claude', 'skills');
}

function resolveSkillIds(options) {
  if (options.pilot) {
    return PILOT_SKILLS;
  }

  if (!options.skills.length) {
    throw new Error('Provide at least one skill id or use --pilot.');
  }

  return options.skills;
}

function installSkill(skillId, version, installRoot) {
  const sourceDir = path.resolve('distributions', 'claude', skillId, version);
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing generated skill bundle: ${sourceDir}`);
  }

  const destDir = path.join(installRoot, skillId);
  fs.mkdirSync(installRoot, { recursive: true });
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.cpSync(sourceDir, destDir, { recursive: true });

  return { skillId, sourceDir, destDir };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const skillIds = resolveSkillIds(options);
  const installRoot = resolveInstallRoot(options);

  if (options.global && options.project) {
    throw new Error('Choose only one of --global or --project.');
  }

  const installed = skillIds.map((skillId) => installSkill(skillId, options.version, installRoot));

  console.log(`Installed ${installed.length} Claude-compatible skill bundle(s) into ${installRoot}`);
  installed.forEach(({ skillId, destDir }) => {
    console.log(`- ${skillId} -> ${destDir}`);
  });
}

try {
  main();
} catch (error) {
  console.error(error.message || String(error));
  process.exit(1);
}
