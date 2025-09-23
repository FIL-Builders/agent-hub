import React from 'react';
import { buildPrompt } from '@site/src/utils/prompt';

const accentFromString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) % 360;
  return `hsl(${h} 82% 52%)`;
};

const parseMeta = (yaml) => {
  try {
    const lines = (yaml || '').split('\n');
    const idx = lines.findIndex((l) => /^\s*meta:\s*$/.test(l));
    if (idx === -1) return {};
    const metaIndent = (lines[idx].match(/^\s*/)?.[0] || '').length;
    const meta = [];
    for (let i = idx + 1; i < lines.length; i++) {
      const line = lines[i];
      const indent = (line.match(/^\s*/)?.[0] || '').length;
      if (line.trim() === '') { meta.push(line); continue; }
      if (indent <= metaIndent) break;
      meta.push(line);
    }
    const scalar = (key) => {
      const re = new RegExp('^\\s*' + key + '\\s*:\\s*(.*)$');
      for (const l of meta) {
        const m = l.match(re);
        if (m) {
          let v = (m[1] || '').trim();
          if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
          if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
          return v;
        }
      }
      return '';
    };
    // purpose block handling
    let purpose = '';
    for (let i = 0; i < meta.length; i++) {
      const l = meta[i];
      const m = l.match(/^\s*purpose\s*:\s*(.*)$/);
      if (!m) continue;
      const after = (m[1] || '').trim();
      const baseIndent = (l.match(/^\s*/)?.[0] || '').length;
      if (after && after !== '|' && after !== '>') {
        purpose = after;
      } else {
        const block = [];
        for (let j = i + 1; j < meta.length; j++) {
          const ln = meta[j];
          const ind = (ln.match(/^\s*/)?.[0] || '').length;
          if (ind <= baseIndent) break;
          block.push(ln.slice(baseIndent + 2));
        }
        purpose = (after === '|' ? block.join('\n') : block.join(' ')).trim();
      }
      break;
    }
    const specName = scalar('spec_name') || scalar('library_name');
    const language = scalar('language');
    return { specName, purpose, language };
  } catch { return {}; }
};

export default function AgentCard({ project, latest, older = [] }) {
  const { specName, purpose, language } = React.useMemo(() => parseMeta(latest.raw), [latest.raw]);
  const title = specName || project;
  const [openMenu, setOpenMenu] = React.useState(false);
  const [versionsOpen, setVersionsOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const specPageUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(latest.file)}`;
  const rawUrl = `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/agents/${project}/${latest.file}`;
  const promptText = buildPrompt(rawUrl);
  const accent = React.useMemo(() => accentFromString(specName || project), [specName, project]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(specPageUrl); } catch {}
  };

  return (
    <div className="agent-card ai-card" style={{ '--accent': accent }}>
      <div className="agent-card-header">
        <div>
          <h3 className="agent-card-title"><a className="agent-card-title-link" href={specPageUrl}>{title}</a></h3>
          {language && <span className="agent-lang-pill">{language}</span>}
          <div className="agent-versions-row">
            <span className="agent-version-latest">Latest: {latest.file.replace(/\.yaml$/, '')}</span>
            {older.length > 0 && (
              <button className="agent-older-link" onClick={() => setVersionsOpen(true)}>Older Versions</button>
            )}
          </div>
        </div>
        <div className="agent-actions" ref={menuRef}>
          <button className="agent-action-btn" onClick={() => setOpenMenu((v) => !v)} title="Actions">Actions ▾</button>
          {openMenu && (
            <div className="yaml-dropdown-menu" style={{ right: 0, left: 'auto' }}>
              <a className="yaml-dropdown-item" href={specPageUrl}>🔍 View Spec</a>
              <a className="yaml-dropdown-item" href={rawUrl} download>⬇️ Download</a>
              {promptText && (
                <a
                  className="yaml-dropdown-item"
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
                  className="yaml-dropdown-item"
                  href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpenMenu(false)}
                >
                  ✨ Open in Claude
                </a>
              )}
              <button className="yaml-dropdown-item" onClick={() => { handleCopyLink(); setOpenMenu(false); }}>🔗 Copy Link</button>
            </div>
          )}
        </div>
      </div>
      {purpose && <p className="agent-card-desc">{purpose}</p>}
      <div className="agent-card-footer">
        <a className="pill-link" href={specPageUrl}>{`agents/${project}/${latest.file}`}</a>
        <div className="agent-mobile-actions">
          <button className="mobile-actions-btn" onClick={() => setSheetOpen(true)}>Actions ▼</button>
        </div>
      </div>

      {/* Versions modal */}
      {versionsOpen && (
        <div className="action-sheet-overlay" onClick={() => setVersionsOpen(false)}>
          <div className="versions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="versions-modal-header">Older Versions</div>
            <div className="versions-list">
              {older.map((v) => (
                <a key={v.file} className="versions-item" href={`/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(v.file)}`} onClick={() => setVersionsOpen(false)}>
                  {v.file}
                </a>
              ))}
            </div>
            <button className="versions-cancel" onClick={() => setVersionsOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Mobile action sheet */}
      {sheetOpen && (
        <div className="action-sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="action-sheet" role="dialog" aria-label="Available Actions" onClick={(e) => e.stopPropagation()}>
            <div className="action-sheet-header">Available Actions</div>
            <a className="action-sheet-item" href={specPageUrl} onClick={() => setSheetOpen(false)}>🔍 View Spec</a>
            <a className="action-sheet-item" href={rawUrl} download onClick={() => setSheetOpen(false)}>⬇️ Download</a>
            {promptText && (<a className="action-sheet-item" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setSheetOpen(false)}>🤖 Open in ChatGPT</a>)}
            {promptText && (<a className="action-sheet-item" href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setSheetOpen(false)}>✨ Open in Claude</a>)}
            <button className="action-sheet-item" onClick={() => { handleCopyLink(); setSheetOpen(false); }}>🔗 Copy Link</button>
            <button className="action-sheet-cancel" onClick={() => setSheetOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
