import React from 'react';
import Layout from '@theme/Layout';
import AgentCard from '@site/src/components/AgentCard';

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
  const [query, setQuery] = React.useState('');
  const [language, setLanguage] = React.useState('');
  const [metaByProject, setMetaByProject] = React.useState({});

  React.useEffect(() => {
    const next = {};
    for (const [project, specs] of Object.entries(grouped)) {
      const latest = specs.slice().sort((a, b) => {
        const av = parseVersion(a.file); const bv = parseVersion(b.file); return compareVersions(bv, av);
      })[0];
      // Parse language simple from meta
      const text = latest.raw || '';
      const lines = text.split('\n');
      const iMeta = lines.findIndex((l) => /^\s*meta:\s*$/.test(l));
      let lang = '';
      if (iMeta !== -1) {
        const metaIndent = (lines[iMeta].match(/^\s*/)?.[0] || '').length;
        for (let i = iMeta + 1; i < lines.length; i++) {
          const l = lines[i];
          const ind = (l.match(/^\s*/)?.[0] || '').length;
          if (ind <= metaIndent) break;
          const m = l.match(/^\s*language\s*:\s*(.*)$/);
          if (m) { lang = (m[1] || '').trim().replace(/^['"]|['"]$/g, ''); break; }
        }
      }
      next[project] = { language: lang.toLowerCase() };
    }
    setMetaByProject(next);
  }, []);

  const languages = React.useMemo(() => {
    const set = new Set();
    Object.values(metaByProject).forEach((m) => { if (m.language) set.add(m.language); });
    return Array.from(set).sort();
  }, [metaByProject]);

  return (
    <Layout title="All Agent Specs">
      <main className="container" style={{ padding: '2rem 0' }}>
        <h1 style={{ color: 'var(--ifm-color-primary)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>
          All AgentHub YAML Specs
        </h1>
        <p style={{ color: 'var(--ifm-color-content-secondary, #6b7280)', marginBottom: '1rem' }}>
          Browse and open agent YAML specifications. Use search and filters to find what you need.
        </p>
        <div className="agents-filter">
          <input
            className="agents-search"
            placeholder="Search agents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="agents-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="agents-grid">
          {Object.entries(grouped).map(([project, specs]) => {
            const sorted = specs
              .slice()
              .sort((a, b) => {
                const av = parseVersion(a.file);
                const bv = parseVersion(b.file);
                return compareVersions(bv, av);
              });
            const latestSpec = sorted[0];
            const meta = metaByProject[project] || {};
            const matchesQuery = project.toLowerCase().includes(query.toLowerCase());
            const matchesLang = !language || (meta.language || '').includes(language.toLowerCase());
            if (!matchesQuery || !matchesLang) return null;
            return (
              <AgentCard
                key={project}
                project={project}
                latest={latestSpec}
                older={sorted.slice(1)}
              />
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
