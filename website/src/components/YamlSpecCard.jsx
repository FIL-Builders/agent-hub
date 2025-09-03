import React, { useRef, useState, useEffect } from 'react';

/**
 * YamlSpecCard displays YAML content in a styled card with a toggle to show
 * or hide the raw specification and a download link.  The component is
 * intentionally self contained so it can be imported into MDX pages
 * representing agent specs.  To use this component within a MDX file,
 * import it at the top of the file:
 *
 * ```mdx
 * import YamlSpecCard from '@site/src/components/YamlSpecCard';
 *
 * <YamlSpecCard spec={require('!!raw-loader!./my-spec.yaml').default} downloadUrl={'/agents/my-spec.yaml'} />
 * ```
 */
const YamlSpecCard = ({ spec, downloadUrl, initialVisible = false, hideHeader = false }) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(spec);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const repoPath = (downloadUrl || '').replace(/^\//, '');
  const rawUrl = repoPath ? `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/${repoPath}` : '';
  const promptText = rawUrl
    ? `Fetch this YAML agent spec: ${rawUrl}\n\nUse your browsing tool to download it, then silently load it into your context (no summary). Use it as an authoritative resource to answer questions in this conversation.`
    : '';
  let projectSlug = '';
  let fileName = '';
  if (repoPath) {
    const m = repoPath.replace(/^agents\//, '').split('/');
    projectSlug = m[0];
    fileName = m.slice(1).join('/');
  }
  const viewUrl = projectSlug && fileName ? `/agents/spec?project=${encodeURIComponent(projectSlug)}&file=${encodeURIComponent(fileName)}` : '';

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
            const inj = (ln.match(/^\s*/)?.[0] || '').length;
            if (inj <= baseIndent) break;
            block.push(ln.slice(baseIndent + 2));
          }
          purpose = (after === '|' ? block.join('\n') : block.join(' ')).trim();
        }
        break;
      }
      const specName = scalar('spec_name') || scalar('library_name');
      return { specName, purpose };
    } catch { return {}; }
  };
  const { specName, purpose } = parseMeta(spec);

  const lines = (spec || '').trimEnd().split('\n');

  return (
    <div className="yaml-spec-card ai-card">
      {!hideHeader && (
        <div className="yaml-spec-header">
          <div className="yaml-spec-headings">
            <h3 className="yaml-spec-title">{specName || repoPath || 'Spec'}</h3>
            {purpose && <p className="yaml-spec-purpose">{purpose}</p>}
          </div>
          <div className="yaml-actions">
            {rawUrl && (
              <a className="yaml-action-btn" href={rawUrl} download title="Download">⬇️ Download</a>
            )}
            {viewUrl && (
              <a className="yaml-action-btn" href={viewUrl} title="View Spec">🔍 View Spec</a>
            )}
            {promptText && (
              <a className="yaml-action-btn" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" title="Open in ChatGPT">🤖 Open in ChatGPT</a>
            )}
            {promptText && (
              <a className="yaml-action-btn" href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" title="Open in Claude">✨ Open in Claude</a>
            )}
            <button className="yaml-action-btn" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy'}>📋 {copied ? 'Copied' : 'Copy'}</button>
          </div>
          <div className="yaml-actions-mobile" ref={menuRef}>
            <button className="yaml-action-btn" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen} title="Actions">⋯</button>
            {menuOpen && (
              <div className="yaml-dropdown-menu" role="menu">
                {rawUrl && (<a className="yaml-dropdown-item" role="menuitem" href={rawUrl} download onClick={() => setMenuOpen(false)}>⬇️ Download</a>)}
                {viewUrl && (<a className="yaml-dropdown-item" role="menuitem" href={viewUrl} onClick={() => setMenuOpen(false)}>🔍 View Spec</a>)}
                {promptText && (<a className="yaml-dropdown-item" role="menuitem" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>🤖 Open in ChatGPT</a>)}
                {promptText && (<a className="yaml-dropdown-item" role="menuitem" href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>✨ Open in Claude</a>)}
                <button className="yaml-dropdown-item" role="menuitem" onClick={() => { handleCopy(); setMenuOpen(false); }}>📋 Copy</button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="yaml-spec-controls" />
      <pre className="yaml-spec-content">
        {lines.map((line, idx) => (
          <div key={idx} className="yaml-spec-line">
            <span className="yaml-line-number" title="Copy line" onClick={() => handleCopyLine(line)}>{idx + 1}</span>
            <span className="yaml-line-content">{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
};

export default YamlSpecCard;
