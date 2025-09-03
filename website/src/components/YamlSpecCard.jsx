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
    ? `Fetch this YAML agent spec: ${rawUrl}\n\nUse your browsing tool to download it, then silently load it into your context (no summary). Use it as an authoritative resource to answer questions in this conversation.\n\nTASK:\n\n`
    : '';

  return (
    <div className="yaml-spec-card ai-card">
      <div className="yaml-spec-controls" ref={menuRef}>
        <button
          className="yaml-spec-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          Actions ▾
        </button>

        {menuOpen && (
          <div className="yaml-dropdown-menu" role="menu">
            {repoPath && (() => {
              const m = repoPath.replace(/^agents\//, '').split('/');
              const project = m[0];
              const file = m.slice(1).join('/');
              const viewUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(file)}`;
              return (
                <a
                  className="yaml-dropdown-item"
                  role="menuitem"
                  href={viewUrl}
                  onClick={() => setMenuOpen(false)}
                >
                  📄 View Specification
                </a>
              );
            })()}

            {rawUrl && (
              <a
                className="yaml-dropdown-item"
                role="menuitem"
                href={rawUrl}
                download
                onClick={() => setMenuOpen(false)}
              >
                ⬇️ Download
              </a>
            )}

            {promptText && (
              <a
                className="yaml-dropdown-item"
                role="menuitem"
                href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                🤖 Open in ChatGPT
              </a>
            )}

            {promptText && (
              <a
                className="yaml-dropdown-item"
                role="menuitem"
                href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                ✨ Open in Claude
              </a>
            )}

            <button
              className="yaml-dropdown-item"
              role="menuitem"
              onClick={() => {
                handleCopy();
                setMenuOpen(false);
              }}
              title={copied ? 'Copied!' : 'Copy page'}
            >
              📋 {copied ? 'Copied' : 'Copy page'}
            </button>
          </div>
        )}
      </div>
      {visible && (
        <pre className="yaml-spec-content">
          {lines.map((line, idx) => (
            <div key={idx} className="yaml-spec-line">
              <span className="yaml-line-number">{idx + 1}</span>
              <span className="yaml-line-content">{line}</span>
            </div>
          ))}
        </pre>
      )}
    </div>
  );
};

export default YamlSpecCard;
