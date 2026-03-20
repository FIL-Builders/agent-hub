import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import {useLocation} from '@docusaurus/router';
import {resolveSkillContext} from '@site/src/utils/skillInstall';

function useQuery() {
  const {search} = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function SkillInstallCommands({mode = 'full'}) {
  const query = useQuery();
  const {skill, version, displayName} = resolveSkillContext(query.get('skill'), query.get('version'));

  const cliProject = `agent-hub install-skill ${skill} --version ${version} --project`;
  const cliGlobal = `agent-hub install-skill ${skill} --version ${version} --global`;
  const repoProject = `npm run install:claude-skill -- ${skill} --version ${version} --project`;
  const repoGlobal = `npm run install:claude-skill -- ${skill} --version ${version} --global`;
  const bundlePath = `distributions/claude/${skill}/${version}/`;

  if (mode === 'inline') {
    return (
      <>
        <p>
          The examples below are currently configured for <strong>{displayName}</strong>{' '}
          (`{skill}` v{version}).
        </p>
      </>
    );
  }

  return (
    <div className="skill-install-commands cg-glass-panel cg-industrial-border cg-industrial-border-accent">
      <p className="agenthub-page-header__label">Install Commands</p>
      <h3 className="skill-install-commands__title">
        {displayName} ({skill} v{version})
      </h3>
      <p className="skill-install-commands__copy">
        This page reads optional <code>skill</code> and <code>version</code> query params and
        renders commands for the selected Claude skill bundle.
      </p>

      <div className="skill-install-commands__grid">
        <div>
          <p className="agenthub-page-header__label">Package CLI</p>
          <CodeBlock language="bash">{cliProject}</CodeBlock>
          <CodeBlock language="bash">{cliGlobal}</CodeBlock>
        </div>
        <div>
          <p className="agenthub-page-header__label">Repo Script</p>
          <CodeBlock language="bash">{repoProject}</CodeBlock>
          <CodeBlock language="bash">{repoGlobal}</CodeBlock>
        </div>
      </div>

      <p className="skill-install-commands__copy">
        Manual bundle path: <code>{bundlePath}</code>
      </p>
    </div>
  );
}
