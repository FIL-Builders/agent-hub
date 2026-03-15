import React, {useState} from 'react';

export const AGENT_HUB_MCP_ONBOARDING_PROMPT = `I want you to connect Agent Hub MCP in this CLI AI agent environment.

Agent Hub MCP is a versioned context server for agent packs. It is useful for listing available packs, checking versions, and fetching the exact spec an AI agent needs at runtime instead of pasting large prompt blobs into every session.

Agent Hub MCP server:
https://agent-hub-1.netlify.app/mcp

Docs:
https://agent-hub-1.netlify.app/mcp?format=json

Your job:
1. Detect whether this environment supports MCP server configuration and identify the correct config file or settings location.
2. If you can edit the config safely, add an MCP server named "agent-hub". Prefer direct Streamable HTTP configuration when supported. If this client requires a proxy, use an mcp-remote style setup instead.
3. If you cannot edit the config automatically, tell me the exact file path, snippet, and next command I should run myself.
4. After setup, verify the connection by listing the available tools and fetching a known pack (for example, the latest "agent-hub" pack).
5. After verification, fetch the latest "agent-hub" pack and derive a short persistent routing note that teaches this AI agent when to use Agent Hub efficiently.
6. If this environment supports a persistent system prompt, developer note, workspace instruction, memory, or similar instruction surface, install that routing note there. If not, print the exact note and tell me where I should paste it manually.
7. Summarize what you changed, what worked, what routing note you installed or generated, and anything I still need to do.

Constraints:
- Do not make up config locations or syntax. Detect them first or say you are unsure.
- Preserve any existing MCP servers already configured.
- Prefer the smallest correct change.
- If authentication or transport details are required, explain them plainly.
- Keep the routing note short and practical.
- The routing note should teach when to use Agent Hub, when not to use it, and to prefer just-in-time retrieval over preloading many packs.

Success criteria:
- Agent Hub MCP is configured or I have exact manual steps.
- The connection is verified by listing tools and fetching a known pack such as the latest agent-hub pack.
- A short Agent Hub routing note is installed into persistent instructions, or I have the exact note and where to paste it.`;

function compactPrompt() {
  return [
    'Connect Agent Hub MCP in this CLI AI agent environment.',
    '',
    'Agent Hub MCP is a versioned context server for agent packs.',
    'Use it to list available packs, check versions, and fetch the right spec at runtime instead of pasting large prompt blobs into each session.',
    '',
    'Server:',
    'https://agent-hub-1.netlify.app/mcp',
    '',
    'Your job:',
    '1. Detect whether this environment supports MCP configuration and find the correct config file or settings location.',
    '2. If you can edit it safely, add an MCP server named "agent-hub" using the smallest correct change.',
    '3. If you cannot edit it automatically, give me the exact file path, config snippet, and next step to do manually.',
    '4. Verify the connection by listing tools and fetching a known pack, such as the latest "agent-hub" pack.',
    '5. Fetch the latest "agent-hub" pack and derive a short routing note that teaches when to use Agent Hub efficiently.',
    '6. Install that note into persistent agent instructions if possible, or print the exact note and where I should paste it.',
    '7. Summarize what you changed, what worked, what note you installed or generated, and anything I still need to do.',
  ].join('\n');
}

export default function AIAgentOnboardingPrompt({
  compact = false,
  buttonLabel = 'Copy Prompt',
}) {
  const [copied, setCopied] = useState(false);
  const prompt = compact ? compactPrompt() : AGENT_HUB_MCP_ONBOARDING_PROMPT;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(AGENT_HUB_MCP_ONBOARDING_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div className="agenthub-onboarding-prompt">
      <pre className="agenthub-onboarding-prompt__code">{prompt}</pre>
      <button type="button" className="button button--secondary button--sm" onClick={handleCopy}>
        {copied ? 'Copied' : buttonLabel}
      </button>
    </div>
  );
}
