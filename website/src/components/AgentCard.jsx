import React from 'react';
import { buildPackPageUrl, stripSpecExtension } from '@site/src/utils/agentSpec';

const accentFromString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) % 360;
  return `hsl(${h} 82% 52%)`;
};

export default function AgentCard({ project, latest, meta = {}, latestSkill = null }) {
  const { specName, purpose, language } = meta;
  const title = specName || project;

  const canonicalVersion = stripSpecExtension(latest.file);
  const packPageUrl = buildPackPageUrl(project, {
    version: canonicalVersion,
  });
  const accent = React.useMemo(() => accentFromString(specName || project), [specName, project]);

  return (
    <div className="agent-card ai-card" style={{ '--accent': accent }}>
      <div className="agent-card-header">
        <div>
          <h3 className="agent-card-title"><a className="agent-card-title-link" href={packPageUrl}>{title}</a></h3>
          {language && <span className="agent-lang-pill">{language}</span>}
        </div>
      </div>
      {purpose && <p className="agent-card-desc">{purpose}</p>}
      {latestSkill?.description && (
        <p className="agent-card-note">
          {latestSkill.description}
        </p>
      )}
      <div className="agent-card-footer">
        <div className="agent-card-footer__actions">
          <a className="button button--secondary button--sm agent-card-primary-cta" href={packPageUrl}>
            Open Pack
          </a>
        </div>
      </div>
    </div>
  );
}
