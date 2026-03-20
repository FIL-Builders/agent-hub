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
6. Make sure that routing note explains the difference between Agent Hub MCP for runtime retrieval and local Claude-compatible skills for file-based installation, so this agent knows which path fits the environment and task.
7. If this environment supports a persistent system prompt, developer note, workspace instruction, memory, or similar instruction surface, install that routing note there. If not, print the exact note and tell me where I should paste it manually.
8. If this environment explicitly prefers local Claude-compatible skills over MCP, say so plainly and tell me how you would fetch or install the generated skill bundle instead.
9. Summarize what you changed, what worked, what routing note you installed or generated, and anything I still need to do.

Constraints:
- Do not make up config locations or syntax. Detect them first or say you are unsure.
- Preserve any existing MCP servers already configured.
- Prefer the smallest correct change.
- If authentication or transport details are required, explain them plainly.
- Keep the routing note short and practical.
- The routing note should teach when to use Agent Hub, when not to use it, to prefer just-in-time retrieval over preloading many packs, and when a local Claude-compatible skill is a better fit than MCP.

Success criteria:
- Agent Hub MCP is configured or I have exact manual steps.
- The connection is verified by listing tools and fetching a known pack such as the latest agent-hub pack.
- A short Agent Hub routing note is installed into persistent instructions, or I have the exact note and where to paste it.`;

function compactPrompt() {
  return [
    'Set up Agent Hub in this AI coding environment.',
    '',
    'Goal:',
    '- connect Agent Hub MCP when runtime retrieval is the right fit',
    '- or tell me when a local Claude-compatible skill is the better setup path',
    '',
    'Server:',
    'https://agent-hub-1.netlify.app/mcp',
    '',
    'Your job:',
    '1. Detect the right setup path for this environment.',
    '2. Configure Agent Hub MCP, or explain why a local Claude-compatible skill is the better fit here.',
    '3. Verify the setup by fetching the latest "agent-hub" pack.',
    '4. Install or print a short routing note that explains when to use MCP vs a local skill.',
    '',
    'Then summarize what you changed, what worked, and anything I still need to do.',
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
      {compact ? (
        <p className="agenthub-onboarding-prompt__meta">
          Copying this button uses the full setup prompt, not just the preview.
        </p>
      ) : null}
      <button type="button" className="button button--secondary button--sm" onClick={handleCopy}>
        {copied ? 'Copied' : buttonLabel}
      </button>
    </div>
  );
}
