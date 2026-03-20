import React from 'react';
import { buildPrompt } from '@site/src/utils/prompt';
import { buildPackPageUrl, stripSpecExtension } from '@site/src/utils/agentSpec';

const accentFromString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) % 360;
  return `hsl(${h} 82% 52%)`;
};

export default function AgentCard({ project, latest, meta = {}, latestSkill = null }) {
  const { specName, purpose, language } = meta;
  const title = specName || project;
  const [openMenu, setOpenMenu] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const specPageUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(latest.file)}`;
  const canonicalVersion = stripSpecExtension(latest.file);
  const skillPageUrl = latestSkill
    ? `/agents/skill?project=${encodeURIComponent(project)}&version=${encodeURIComponent(latestSkill.version)}`
    : '';
  const packPageUrl = buildPackPageUrl(project, {
    version: canonicalVersion,
  });
  const rawUrl = `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/agents/${project}/${latest.file}`;
  const promptText = buildPrompt(rawUrl);
  const accent = React.useMemo(() => accentFromString(specName || project), [specName, project]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(packPageUrl); } catch {}
  };

  return (
    <div className={`agent-card ai-card ${openMenu ? "open" : ""}`} style={{ '--accent': accent }}>
      <div className="agent-card-header">
        <div>
          <h3 className="agent-card-title"><a className="agent-card-title-link" href={packPageUrl}>{title}</a></h3>
          {language && <span className="agent-lang-pill">{language}</span>}
          {latestSkill && <span className="agent-distribution-pill">Claude-compatible skill</span>}
          <div className="agent-versions-row">
            <span className="agent-version-latest">Latest canonical pack: {canonicalVersion}</span>
          </div>
        </div>
      </div>
      {purpose && <p className="agent-card-desc">{purpose}</p>}
      {latestSkill?.description && (
        <p className="agent-card-note">
          {latestSkill.description}
        </p>
      )}
      <div className="agent-card-footer">
        <div className="agent-card-footer__links">
          <span className="pill-link">{`agents/${project}/${latest.file}`}</span>
          {skillPageUrl && (
            <span className="pill-link pill-link--accent">{`distributions/claude/${project}/${latestSkill.version}/SKILL.md`}</span>
          )}
        </div>
        <div className="agent-card-footer__actions">
          <a className="button button--secondary button--sm agent-card-primary-cta" href={packPageUrl}>
            Open Pack
          </a>
          <div className="agent-actions" ref={menuRef}>
            <button className="agent-action-btn" onClick={() => setOpenMenu((v) => !v)} title="More">More ▾</button>
            {openMenu && (
              <div className="spec-dropdown-menu" style={{ right: 0, left: 'auto' }}>
                <a className="spec-dropdown-item" href={rawUrl} download>⬇️ Download Canonical Pack</a>
                <a className="spec-dropdown-item" href={specPageUrl}>🔍 Open Canonical Page</a>
                {skillPageUrl && (
                  <a className="spec-dropdown-item" href={skillPageUrl}>🧠 Open Claude Skill Page</a>
                )}
                {promptText && (
                  <a
                    className="spec-dropdown-item"
                    href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpenMenu(false)}
                  >
                    🤖 Open in ChatGPT
                  </a>
                )}
                {promptText && (
                  <a
                    className="spec-dropdown-item"
                    href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpenMenu(false)}
                  >
                    ✨ Open in Claude
                  </a>
                )}
                <button className="spec-dropdown-item" onClick={() => { handleCopyLink(); setOpenMenu(false); }}>🔗 Copy Pack Link</button>
              </div>
            )}
          </div>
          <div className="agent-mobile-actions">
            <button className="mobile-actions-btn" onClick={() => setSheetOpen(true)}>More ▼</button>
          </div>
        </div>
      </div>

      {/* Mobile action sheet */}
      {sheetOpen && (
        <div className="action-sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="action-sheet" role="dialog" aria-label="Available Actions" onClick={(e) => e.stopPropagation()}>
            <div className="action-sheet-header">More</div>
            <a className="action-sheet-item" href={specPageUrl} onClick={() => setSheetOpen(false)}>🔍 Open Canonical Page</a>
            {skillPageUrl && (<a className="action-sheet-item" href={skillPageUrl} onClick={() => setSheetOpen(false)}>🧠 Open Claude Skill Page</a>)}
            <a className="action-sheet-item" href={rawUrl} download onClick={() => setSheetOpen(false)}>⬇️ Download Canonical Pack</a>
            {promptText && (<a className="action-sheet-item" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setSheetOpen(false)}>🤖 Open in ChatGPT</a>)}
            {promptText && (<a className="action-sheet-item" href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setSheetOpen(false)}>✨ Open in Claude</a>)}
            <button className="action-sheet-item" onClick={() => { handleCopyLink(); setSheetOpen(false); }}>🔗 Copy Pack Link</button>
            <button className="action-sheet-cancel" onClick={() => setSheetOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
