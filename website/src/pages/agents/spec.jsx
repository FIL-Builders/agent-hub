import React from 'react';
import Layout from '@theme/Layout';
import YamlSpecCard from '@site/src/components/YamlSpecCard';
import {useLocation} from '@docusaurus/router';

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

  React.useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError('');
    setSpecRaw('');
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
        <div style={{ marginBottom: '1rem' }}>
          <a href="/agents/" className="spec-breadcrumb">← All Agent Specs</a>
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
