import React from 'react';

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
  const [showOlder, setShowOlder] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const specPageUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(latest.file)}`;
  const rawUrl = `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/agents/${project}/${latest.file}`;

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(specPageUrl); } catch {}
  };

  return (
    <div className="agent-card ai-card">
      <div className="agent-card-header">
        <div>
          <h3 className="agent-card-title">{title}</h3>
          {language && <span className="agent-lang-pill">{language}</span>}
        </div>
        <div className="agent-actions" ref={menuRef}>
          <button className="agent-action-btn" onClick={() => setOpenMenu((v) => !v)} title="Actions">⋯</button>
          {openMenu && (
            <div className="yaml-dropdown-menu" style={{ right: 0, left: 'auto' }}>
              <a className="yaml-dropdown-item" href={specPageUrl}>🔍 View Spec</a>
              <a className="yaml-dropdown-item" href={rawUrl} download>⬇️ Download</a>
              <button className="yaml-dropdown-item" onClick={handleCopyLink}>🔗 Copy Link</button>
            </div>
          )}
        </div>
      </div>
      {purpose && <p className="agent-card-desc">{purpose}</p>}
      <div className="agent-card-footer">
        <a className="pill-link" href={specPageUrl}>{`agents/${project}/${latest.file}`}</a>
        {older.length > 0 && (
          <button className="older-link" onClick={() => setShowOlder((s) => !s)}>
            {showOlder ? 'Hide Older Versions' : 'View Older Versions'}
          </button>
        )}
      </div>
      {showOlder && (
        <div className="older-list">
          {older.map((v) => (
            <a key={v.file} href={`/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(v.file)}`}>{v.file}</a>
          ))}
        </div>
      )}
    </div>
  );
}

