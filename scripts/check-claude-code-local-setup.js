#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const CLAUDE_CONFIG_PATH = path.join(os.homedir(), '.claude.json');
const MCP_URL = 'https://agent-hub-1.netlify.app/mcp';

function runResult(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function run(command, args, options = {}) {
  const result = runResult(command, args, options);
  if (result.status !== 0) {
    const error = new Error(result.stderr || result.stdout || `Command failed: ${command} ${args.join(' ')}`);
    error.stdout = result.stdout;
    error.stderr = result.stderr;
    error.status = result.status;
    throw error;
  }

  return result.stdout;
}

function readClaudeConfig() {
  if (!fs.existsSync(CLAUDE_CONFIG_PATH)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(CLAUDE_CONFIG_PATH, 'utf8'));
}

function writeClaudeConfig(config) {
  fs.writeFileSync(CLAUDE_CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
}

function removeProjectConfig(projectPath) {
  if (!fs.existsSync(CLAUDE_CONFIG_PATH)) {
    return;
  }

  const config = readClaudeConfig();
  if (config.projects && config.projects[projectPath]) {
    delete config.projects[projectPath];
    writeClaudeConfig(config);
  }
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-hub-claude-code-'));
  const skillsTarget = path.join(tempRoot, '.claude', 'skills');
  const results = [];

  try {
    const authResult = runResult('claude', ['auth', 'status'], { cwd: tempRoot });
    const authText = (authResult.stdout || authResult.stderr || '').trim();
    const auth = JSON.parse(authText);
    results.push(`Claude auth status: loggedIn=${Boolean(auth.loggedIn)}`);

    run('node', ['scripts/install-claude-skill.js', '--pilot', '--target', skillsTarget], {
      cwd: REPO_ROOT,
    });
    const installedSkills = fs.readdirSync(skillsTarget).sort();
    results.push(`Installed pilot skills into ${skillsTarget}`);
    results.push(`Installed skills: ${installedSkills.join(', ')}`);

    run('claude', ['mcp', 'add', '--transport', 'http', 'agent-hub', MCP_URL], {
      cwd: tempRoot,
    });
    const mcpList = run('claude', ['mcp', 'list'], { cwd: tempRoot }).trim();
    results.push('Claude MCP local config check passed');
    results.push(mcpList);

    if (auth.loggedIn) {
      const runtimeOutput = run(
        'claude',
        [
          '-p',
          '--permission-mode',
          'bypassPermissions',
          'Reply with the names of any locally installed skills or MCP servers you can see for this project. Keep it short.',
        ],
        { cwd: tempRoot }
      ).trim();
      results.push('Claude runtime session probe succeeded');
      results.push(runtimeOutput);
    } else {
      results.push('Claude runtime session probe skipped because auth status is loggedOut');
    }

    console.log(results.join('\n\n'));
  } finally {
    removeProjectConfig(tempRoot);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error.stderr || error.message || String(error));
  process.exit(1);
}
