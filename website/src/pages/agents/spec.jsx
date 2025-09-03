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

  let specRaw = null;
  let error = null;
  let path;
  try {
    if (!project || !file) throw new Error('Missing project or file parameter');
    path = `./${project}/${file}`;
    // Will throw if not found
    specRaw = req(path).default;
  } catch (e) {
    error = e?.message || String(e);
  }

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
        {!error ? (
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
        ) : (
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
