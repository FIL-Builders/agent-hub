#!/usr/bin/env node

const {installFromArgv, printHelp} = require('../scripts/install-claude-skill.js');

function printCliHelp() {
  console.log(`Agent Hub CLI

Usage:
  agent-hub <command> [options]

Commands:
  install-skill   Install generated Claude-compatible skill bundles
  help            Show this message

Examples:
  agent-hub install-skill agent-hub --project
  agent-hub install-skill react --version 0.4.0 --global
  agent-hub install-skill --pilot --project

install-skill help:
${printHelp()}`);
}

function main(argv) {
  const [command, ...rest] = argv;

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printCliHelp();
    return;
  }

  if (command === 'install-skill') {
    if (rest.includes('--help') || rest.includes('-h')) {
      console.log(printHelp());
      return;
    }

    installFromArgv(rest);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(error.message || String(error));
  process.exit(1);
}
