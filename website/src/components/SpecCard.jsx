import React, { useEffect, useRef, useState } from 'react';
import { buildPrompt } from '@site/src/utils/prompt';
import { parseAgentMeta } from '@site/src/utils/agentSpec';

/**
 * SpecCard displays a raw agent specification file in a styled card and
 * keeps actions close to the content for copy/download/open flows.
 */
const SpecCard = ({ spec, downloadUrl, hideHeader = false, disableMobileActions = false }) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
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

  const handleCopyLine = async (line) => {
    try {
      await navigator.clipboard.writeText(line);
    } catch {}
  };

  const repoPath = (downloadUrl || '').replace(/^\//, '');
  const rawUrl = repoPath ? `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/${repoPath}` : '';
  const promptText = buildPrompt(rawUrl);
  const pathParts = repoPath ? repoPath.replace(/^agents\//, '').split('/') : [];
  const projectSlug = pathParts[0] || '';
  const fileName = pathParts.slice(1).join('/');
  const viewUrl = projectSlug && fileName
    ? `/agents/spec?project=${encodeURIComponent(projectSlug)}&file=${encodeURIComponent(fileName)}`
    : '';

  const { specName, purpose } = parseAgentMeta(spec);
  const lines = (spec || '').trimEnd().split('\n');

  return (
    <div className="spec-card ai-card">
      <div className="spec-card-header">
        {!hideHeader && (
          <div className="spec-card-headings">
            <h3 className="spec-card-title">{specName || repoPath || 'Spec'}</h3>
            {purpose && <p className="spec-card-purpose">{purpose}</p>}
          </div>
        )}
        <div className="spec-actions">
          {rawUrl && (
            <a className="spec-action-btn" href={rawUrl} download title="Download">⬇️ Download</a>
          )}
          {viewUrl && (
            <a className="spec-action-btn" href={viewUrl} title="View Spec">🔍 View Spec</a>
          )}
          {promptText && (
            <a className="spec-action-btn" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" title="Open in ChatGPT">🤖 Open in ChatGPT</a>
          )}
          {promptText && (
            <a className="spec-action-btn" href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" title="Open in Claude">✨ Open in Claude</a>
          )}
          <button className="spec-action-btn" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy'}>📋 {copied ? 'Copied' : 'Copy'}</button>
        </div>
        {!disableMobileActions && (
          <div className="spec-actions-mobile" ref={menuRef}>
            <button className="spec-action-btn" onClick={() => setMenuOpen((value) => !value)} aria-haspopup="menu" aria-expanded={menuOpen} title="Actions">⋯</button>
            {menuOpen && (
              <div className="spec-dropdown-menu" role="menu">
                {rawUrl && (<a className="spec-dropdown-item" role="menuitem" href={rawUrl} download onClick={() => setMenuOpen(false)}>⬇️ Download</a>)}
                {viewUrl && (<a className="spec-dropdown-item" role="menuitem" href={viewUrl} onClick={() => setMenuOpen(false)}>🔍 View Spec</a>)}
                {promptText && (<a className="spec-dropdown-item" role="menuitem" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>🤖 Open in ChatGPT</a>)}
                {promptText && (<a className="spec-dropdown-item" role="menuitem" href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>✨ Open in Claude</a>)}
                <button className="spec-dropdown-item" role="menuitem" onClick={() => { handleCopy(); setMenuOpen(false); }}>📋 Copy</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="spec-card-controls" />
      <pre className="spec-card-content">
        {lines.map((line, idx) => (
          <div key={idx} className="spec-card-line">
            <span className="spec-line-number" title="Copy line" onClick={() => handleCopyLine(line)}>{idx + 1}</span>
            <span className="spec-line-content">{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
};

export default SpecCard;
