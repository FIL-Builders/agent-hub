#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const CLAUDE_CONFIG_PATH = path.join(os.homedir(), '.claude.json');
const MCP_URL = 'https://agent-hub-1.netlify.app/mcp';
const DEFAULT_SKILLS = ['react', 'playwright', 'supabase-js'];

const PROBES = {
  react: {
    prompt:
      'You are in a temp repo with local skills installed. Diagnose a React 18 page with 5000 searchable rows where typing feels laggy, rows rerender too often, and the selected row resets after filtering. Give a concise fix plan. At the end, add a line starting with USED_RESOURCES: and list any local skills or MCP servers you actually used.',
  },
  playwright: {
    prompt:
      'You are in a temp repo with local skills installed. Explain how you would debug a flaky Playwright test using locators, tracing, and web-first assertions. Keep it short. At the end, add a line starting with USED_RESOURCES: and list any local skills or MCP servers you actually used.',
  },
  'supabase-js': {
    prompt:
      'You are in a temp repo with local skills installed. Explain how to safely initialize supabase-js in a web app, keep auth boundaries clear, and decide when to use RPC, storage, and realtime. Keep it short. At the end, add a line starting with USED_RESOURCES: and list any local skills or MCP servers you actually used.',
  },
};

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

function parseArgs(argv) {
  const selected = argv.length ? argv : DEFAULT_SKILLS;
  return selected.filter(Boolean);
}

function assertSupportedSkills(skillIds) {
  skillIds.forEach((skillId) => {
    if (!PROBES[skillId]) {
      throw new Error(`No runtime probe is defined for skill '${skillId}'.`);
    }
  });
}

function main() {
  const skillIds = parseArgs(process.argv.slice(2));
  assertSupportedSkills(skillIds);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-hub-claude-runtime-'));
  const reportLines = [];

  try {
    const version = run('claude', ['--version'], { cwd: tempRoot }).trim();
    const authResult = runResult('claude', ['auth', 'status'], { cwd: tempRoot });
    const authText = (authResult.stdout || authResult.stderr || '').trim();
    const auth = JSON.parse(authText);

    if (!auth.loggedIn) {
      throw new Error(
        [
          'Claude Code runtime validation requires an authenticated Claude session.',
          'Run `/login` in Claude Code first, then rerun:',
          'npm run check:claude-code-skill-runtime',
        ].join('\n')
      );
    }

    run('node', ['scripts/install-claude-skill.js', ...skillIds, '--target', path.join(tempRoot, '.claude', 'skills')], {
      cwd: REPO_ROOT,
    });
    run('claude', ['mcp', 'add', '--transport', 'http', 'agent-hub', MCP_URL], { cwd: tempRoot });

    reportLines.push('## Claude Code Runtime Validation');
    reportLines.push('');
    reportLines.push(`- Environment: Claude Code ${version}`);
    reportLines.push(`- Project path: \`${tempRoot}\``);
    reportLines.push(`- Installed skills: ${skillIds.join(', ')}`);
    reportLines.push(`- MCP server: ${MCP_URL}`);
    reportLines.push('');

    skillIds.forEach((skillId) => {
      const output = run(
        'claude',
        [
          '-p',
          '--permission-mode',
          'bypassPermissions',
          '--output-format',
          'text',
          PROBES[skillId].prompt,
        ],
        { cwd: tempRoot }
      ).trim();

      reportLines.push(`### ${skillId}`);
      reportLines.push('');
      reportLines.push('```text');
      reportLines.push(output);
      reportLines.push('```');
      reportLines.push('');
    });

    console.log(reportLines.join('\n'));
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
