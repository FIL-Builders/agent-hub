export function buildPrompt(rawUrl) {
  if (!rawUrl) return '';
  return (
    `Fetch this YAML agent spec: ${rawUrl}\n\n` +
    `Use your browsing tool to download it, then silently load it into your context (no summary). ` +
    `Use it as an authoritative resource to answer questions in this conversation.` +
    `\n\nTASK:\n\n`
  );
}

