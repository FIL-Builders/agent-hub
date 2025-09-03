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
const YamlSpecCard = ({ spec, downloadUrl, initialVisible = false }) => {
  const [visible, setVisible] = useState(initialVisible);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleVisible = () => setVisible((v) => !v);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(spec);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Split the YAML into lines for line numbering.  Use empty array when hidden to avoid unnecessary work.
  const lines = visible ? spec.trimEnd().split('\n') : [];

  // Always reference the YAML in GitHub Raw to avoid hosting copies.
  const repoPath = (downloadUrl || '').replace(/^\//, ''); // agents/.../file.yaml
  const rawUrl = repoPath
    ? `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/${repoPath}`
    : '';
  const promptText = rawUrl
    ? `Fetch this YAML agent spec: ${rawUrl}\n\nUse your browsing tool to download it, then silently load it into your context (no summary). Use it as an authoritative resource to answer questions in this conversation.`
    : '';

  // Extract simple metadata from the YAML (meta.spec_name or meta.library_name, and meta.purpose)
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
      // purpose: may be inline, '|' block, or '>' folded
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
            // strip common indent (assume +2 under key)
            block.push(ln.slice(baseIndent + 2));
          }
          purpose = (after === '|' ? block.join('\n') : block.join(' ')).trim();
        }
        break;
      }
      const specName = scalar('spec_name') || scalar('library_name');
      return { specName, purpose };
    } catch {
      return {};
    }
  };
  const { specName, purpose } = parseMeta(spec);

  // Copy a single line to clipboard
  const handleCopyLine = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  // Basic YAML syntax highlight per line
  const renderLine = (line) => {
    // Separate comment
    let before = line;
    let comment = '';
    const hashIdx = line.indexOf('#');
    if (hashIdx !== -1) {
      before = line.slice(0, hashIdx);
      comment = line.slice(hashIdx);
    }
    const keyMatch = before.match(/^(\s*)([^:#]+):(\s*)(.*)$/);
    if (keyMatch) {
      const [, indent, key, spaceAfter, rest] = keyMatch;
      const isString = /^(".*"|'.*'|\|\s*$|>\s*$)/.test(rest.trim());
      return (
        <>
          <span className="yaml-indent">{indent}</span>
          <span className="yaml-key">{key}</span>
          <span className="yaml-colon">:</span>
          <span className="yaml-space">{spaceAfter}</span>
          {rest && (
            <span className={isString ? 'yaml-string' : 'yaml-value'}>{rest}</span>
          )}
          {comment && <span className="yaml-comment">{comment}</span>}
        </>
      );
    }
    return (
      <>
        <span className="yaml-plain">{before}</span>
        {comment && <span className="yaml-comment">{comment}</span>}
      </>
    );
  };

  // Insert section dividers for readability
  const isSectionStart = (t) => {
    const s = t.trim();
    return s === 'meta:' || s === 'groups:' || /^guiding_principles\s*:/.test(s) || /^design_notes\s*:/.test(s);
  };

  return (
    <div className="yaml-spec-card ai-card">
      <div className="yaml-spec-header">
        <div className="yaml-spec-headings">
          <h3 className="yaml-spec-title">{specName || repoPath || 'Spec'}</h3>
          {purpose && <p className="yaml-spec-purpose">{purpose}</p>}
        </div>
        <div className="yaml-actions">
          {rawUrl && (
            <a className="yaml-action-btn" href={rawUrl} download title="Download">
              ⬇️
            </a>
          )}
          {repoPath && (() => {
            const m = repoPath.replace(/^agents\//, '').split('/');
            const project = m[0];
            const file = m.slice(1).join('/');
            const viewUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(file)}`;
            return (
              <a className="yaml-action-btn" href={viewUrl} title="View Spec">🔍</a>
            );
          })()}
          {promptText && (
            <a
              className="yaml-action-btn"
              href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in ChatGPT"
            >
              🤖
            </a>
          )}
          <button
            className="yaml-action-btn"
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy page'}
          >
            📄
          </button>
        </div>
        <div className="yaml-actions-mobile" ref={menuRef}>
          <button
            className="yaml-action-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            title="Actions"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="yaml-dropdown-menu" role="menu">
              {rawUrl && (
                <a className="yaml-dropdown-item" role="menuitem" href={rawUrl} download onClick={() => setMenuOpen(false)}>
                  ⬇️ Download
                </a>
              )}
              {repoPath && (() => {
                const m = repoPath.replace(/^agents\//, '').split('/');
                const project = m[0];
                const file = m.slice(1).join('/');
                const viewUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(file)}`;
                return (
                  <a className="yaml-dropdown-item" role="menuitem" href={viewUrl} onClick={() => setMenuOpen(false)}>
                    🔍 View Spec
                  </a>
                );
              })()}
              {promptText && (
                <a className="yaml-dropdown-item" role="menuitem" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                  🤖 Open in ChatGPT
                </a>
              )}
              <button className="yaml-dropdown-item" role="menuitem" onClick={() => { handleCopy(); setMenuOpen(false); }}>
                📄 Copy page
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="yaml-spec-controls" />
      {visible && (
        <pre className="yaml-spec-content">
          {lines.map((line, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && isSectionStart(line) && (
                <div className="yaml-section-divider" />
              )}
              <div className="yaml-spec-line">
                <span
                  className="yaml-line-number"
                  title="Copy line"
                  onClick={() => handleCopyLine(line)}
                >
                  {idx + 1}
                </span>
                <span className="yaml-line-content">{renderLine(line)}</span>
              </div>
            </React.Fragment>
          ))}
        </pre>
      )}
    </div>
  );
};

export default YamlSpecCard;
