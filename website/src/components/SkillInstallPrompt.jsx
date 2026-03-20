import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import {useLocation} from '@docusaurus/router';
import {buildInstallPrompt, resolveSkillContext} from '@site/src/utils/skillInstall';

function useQuery() {
  const {search} = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function SkillInstallPrompt() {
  const query = useQuery();
  const {skill, version, displayName} = resolveSkillContext(query.get('skill'), query.get('version'));
  const [copied, setCopied] = React.useState(false);

  const prompt = buildInstallPrompt(skill, version, displayName);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="skill-install-prompt cg-glass-panel cg-industrial-border cg-industrial-border-accent">
      <div className="skill-install-prompt__header">
        <div>
          <p className="agenthub-page-header__label">Install Via Prompt</p>
          <h3 className="skill-install-commands__title">
            {displayName} ({skill} v{version})
          </h3>
        </div>
        <button type="button" className="button button--secondary button--sm" onClick={handleCopy}>
          {copied ? 'Prompt Copied' : 'Copy Prompt'}
        </button>
      </div>
      <p className="skill-install-commands__copy">
        Paste this into a local AI coding agent when you want the agent to choose the fastest available install path for this skill.
      </p>
      <CodeBlock language="text">{prompt}</CodeBlock>
    </div>
  );
}
