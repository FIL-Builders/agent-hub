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

  return (
    <Layout title={project && file ? `${project} – ${file}` : 'Agent Spec'}>
      <main className="container spec-page" style={{ padding: '3rem 2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <a href="/agents/" className="spec-breadcrumb">← All Agent Specs</a>
        </div>
        {!error ? (
          <>
            <h1 className="spec-page-title">{project} / {file}</h1>
            <YamlSpecCard
              spec={specRaw}
              downloadUrl={`agents/${project}/${file}`}
              initialVisible={true}
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
