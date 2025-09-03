import React from 'react';
import Layout from '@theme/Layout';
import YamlSpecCard from '@site/src/components/YamlSpecCard';

// Dynamically require all YAML files from the agents directory.  This uses
// webpack's require.context API, which is supported by Docusaurus.  The
// files are grouped by project so they can be presented under separate
// headings.
const req = require.context(
  '../../../../agents',
  true,
  /\.yaml$/
);

const agentSpecs = req
  .keys()
  .map((filePath) => {
    // filePath is like './react/0.1.0.yaml'
    const m = filePath.match(/^\.\/([^/]+)\/(.+\.yaml)$/);
    if (!m) return null;
    const project = m[1];
    const file = m[2];
    return {
      project,
      file,
      path: `/agents/${project}/${file}`,
      raw: req(filePath).default,
    };
  })
  .filter(Boolean);

export default function AgentsIndex() {
  const grouped = agentSpecs.reduce((acc, spec) => {
    (acc[spec.project] = acc[spec.project] || []).push(spec);
    return acc;
  }, {});

  // Helper to parse a semantic version from a file name (e.g. "0.2.0.yaml").
  const parseVersion = (filename) => {
    const base = filename.replace(/\.yaml$/, '');
    return base.split('.').map((n) => parseInt(n, 10) || 0);
  };
  // Compare two versions arrays.  Returns positive if a > b.
  const compareVersions = (aParts, bParts) => {
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0;
      const bVal = bParts[i] || 0;
      if (aVal !== bVal) return aVal - bVal;
    }
    return 0;
  };

  // State for toggling all versions per project.
  const [showAll, setShowAll] = React.useState({});
  const toggleShowAll = (project) => {
    setShowAll((prev) => ({ ...prev, [project]: !prev[project] }));
  };

  return (
    <Layout title="All Agent Specs">
      <main className="container" style={{ padding: '2rem 0' }}>
        <h1 style={{ color: 'var(--ifm-color-primary)', marginBottom: '1.5rem' }}>
          All AgentHub YAML Specs
        </h1>
        {Object.entries(grouped).map(([project, specs]) => {
          // Sort specs descending by version.
          const sorted = specs
            .slice()
            .sort((a, b) => {
              const av = parseVersion(a.file);
              const bv = parseVersion(b.file);
              return compareVersions(bv, av);
            });
          const latestSpec = sorted[0];
          const displaySpecs = showAll[project] ? sorted : [latestSpec];
          return (
            <section key={project} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2
                  style={{
                    color: 'var(--ifm-color-primary)',
                    fontSize: '1.25rem',
                    marginBottom: '0.5rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {project}
                </h2>
                {sorted.length > 1 && (
                  <button
                    className="yaml-spec-toggle"
                    onClick={() => toggleShowAll(project)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    {showAll[project] ? 'Hide Older Versions' : 'Show All Versions'}
                  </button>
                )}
              </div>
              <div className="agents-grid">
                {displaySpecs.map((spec) => (
                  <YamlSpecCard
                    key={spec.path}
                    spec={spec.raw}
                    downloadUrl={spec.path}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </Layout>
  );
}
