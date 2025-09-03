import React from 'react';
import Layout from '@theme/Layout';
import YamlSpecCard from '@site/src/components/YamlSpecCard';
import {useLocation} from '@docusaurus/router';
import { buildPrompt } from '@site/src/utils/prompt';

const req = require.context(
  '../../../../agents',
  true,
  /\.yaml$/
);

function useQuery() {
  const {search} = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AgentSpecPage() {
  const query = useQuery();
  const project = query.get('project');
  const file = query.get('file');

  const [specRaw, setSpecRaw] = React.useState('');
  const [status, setStatus] = React.useState('loading'); // loading | ready | error
  const [error, setError] = React.useState('');

  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError('');
    setSpecRaw('');
    setSheetOpen(false);
    try {
      if (!project || !file) throw new Error('Missing project or file parameter');
      const path = `./${project}/${file}`;
      // Synchronous require, but we defer state update to avoid flashing SSR mismatch
      const raw = req(path).default;
      if (!cancelled) {
        setSpecRaw(raw);
        setStatus('ready');
      }
    } catch (e) {
      if (!cancelled) {
        setError(e?.message || String(e));
        setStatus('error');
      }
    }
    return () => { cancelled = true; };
  }, [project, file]);

  // Lightweight purpose extraction for subtitle
  const purpose = React.useMemo(() => {
    try {
      const lines = (specRaw || '').split('\n');
      const iMeta = lines.findIndex((l) => /^\s*meta:\s*$/.test(l));
      if (iMeta === -1) return '';
      const metaIndent = (lines[iMeta].match(/^\s*/)?.[0] || '').length;
      for (let i = iMeta + 1; i < lines.length; i++) {
        const l = lines[i];
        const ind = (l.match(/^\s*/)?.[0] || '').length;
        if (ind <= metaIndent) break;
        const m = l.match(/^\s*purpose\s*:\s*(.*)$/);
        if (m) {
          const after = (m[1] || '').trim();
          if (after && after !== '|' && after !== '>') return after;
          const baseIndent = ind;
          const block = [];
          for (let j = i + 1; j < lines.length; j++) {
            const ln = lines[j];
            const inj = (ln.match(/^\s*/)?.[0] || '').length;
            if (inj <= baseIndent) break;
            block.push(ln.slice(baseIndent + 2));
          }
          return block.join(after === '|' ? '\n' : ' ').trim();
        }
      }
      return '';
    } catch { return ''; }
  }, [specRaw]);

  return (
    <Layout title={project && file ? `${project} – ${file}` : 'Agent Spec'}>
      <main className="container spec-page" style={{ padding: '3rem 2rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-desktop">← All Agent Specs</a>
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-mobile">← Back</a>
        </div>
        {status === 'loading' && (
          <div className="ai-card" aria-busy="true">
            <div className="spec-skeleton">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-subtitle" />
              <div className="skeleton skeleton-subtitle short" />
              <div className="skeleton-code">
                {[80, 95, 60, 85, 70, 90, 50, 88].map((w, i) => (
                  <div key={i} className="skeleton skeleton-line" style={{ width: w + '%' }} />
                ))}
              </div>
            </div>
          </div>
        )}
        {status === 'ready' ? (
          <>
            <h1 className="spec-page-title">{project} / {file}</h1>
            {/* Mobile actions button under title */}
            <div className="mobile-actions-container">
              <button className="mobile-actions-btn" onClick={() => setSheetOpen(true)}>
                Actions ▼
              </button>
            </div>
            {purpose && (
              <div className="spec-subtitle-card">
                {purpose}
              </div>
            )}
            <YamlSpecCard
              spec={specRaw}
              downloadUrl={`agents/${project}/${file}`}
              initialVisible={true}
              hideHeader={true}
              disableMobileActions={true}
            />
            {/* Action sheet for mobile */}
            <ActionSheet
              open={sheetOpen}
              onClose={() => setSheetOpen(false)}
              project={project}
              file={file}
            />
          </>
        ) : null}
        {status === 'error' && (
          <div className="ai-card">
            <h3>Specification Not Found</h3>
            <p>
              Unable to load spec for project <code>{project || '(missing)'}</code> and
              file <code>{file || '(missing)'}</code>.
            </p>
            <p style={{ color: 'var(--ifm-color-muted, #94a3b8)' }}>
              {error}
            </p>
          </div>
        )}
      </main>
    </Layout>
  );
}

function ActionSheet({ open, onClose, project, file }) {
  const sheetRef = React.useRef(null);
  const startYRef = React.useRef(0);
  const currentYRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const [dragY, setDragY] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    const onTouchStart = (e) => {
      if (!sheetRef.current) return;
      draggingRef.current = true;
      startYRef.current = e.touches[0].clientY;
      currentYRef.current = startYRef.current;
      setDragY(0);
    };
    const onTouchMove = (e) => {
      if (!draggingRef.current) return;
      currentYRef.current = e.touches[0].clientY;
      const dy = Math.max(0, currentYRef.current - startYRef.current);
      setDragY(dy);
    };
    const onTouchEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (dragY > 80) {
        onClose();
      } else {
        setDragY(0);
      }
    };
    const el = sheetRef.current;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [open, dragY, onClose]);

  if (!open) return null;
  const rawUrl = `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/agents/${project}/${file}`;
  const promptText = buildPrompt(rawUrl);
  const viewUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(file)}`;

  const sheetStyle = dragY
    ? { transform: `translateY(${dragY}px)` }
    : undefined;

  return (
    <div className="action-sheet-overlay" onClick={onClose}>
      <div
        ref={sheetRef}
        className="action-sheet"
        style={sheetStyle}
        role="dialog"
        aria-label="Available Actions"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="action-sheet-header">Available Actions</div>
        <a className="action-sheet-item" href={rawUrl} download onClick={onClose}>⬇️ Download</a>
        <a className="action-sheet-item" href={viewUrl} onClick={onClose}>🔍 View Spec</a>
        <a className="action-sheet-item" href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={onClose}>🤖 Open in ChatGPT</a>
        <a className="action-sheet-item" href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`} target="_blank" rel="noopener noreferrer" onClick={onClose}>✨ Open in Claude</a>
        <button className="action-sheet-item" onClick={() => { navigator.clipboard.writeText(rawUrl).finally(onClose); }}>📋 Copy</button>
        <button className="action-sheet-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
