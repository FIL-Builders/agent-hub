import React from 'react';
import Layout from '@theme/Layout';
import AgentCard from '@site/src/components/AgentCard';
import agentSpecs from '@site/src/generated/agent-index.json';
import distributionIndex from '@site/src/generated/distribution-index.json';
import { parseAgentMeta, stripSpecExtension } from '@site/src/utils/agentSpec';

export default function AgentsIndex() {
  const grouped = agentSpecs.reduce((acc, spec) => {
    (acc[spec.project] = acc[spec.project] || []).push(spec);
    return acc;
  }, {});

  // Helper to parse a semantic version from a file name (e.g. "0.3.0.md").
  const parseVersion = (filename) => {
    const base = stripSpecExtension(filename);
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
  const skillByProjectVersion = React.useMemo(() => {
    const next = new Map();
    distributionIndex.forEach((entry) => {
      next.set(`${entry.project}:${entry.version}`, entry);
    });
    return next;
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      const entries = await Promise.all(Object.entries(grouped).map(async ([project, specs]) => {
        const latest = specs.slice().sort((a, b) => {
          const av = parseVersion(a.file);
          const bv = parseVersion(b.file);
          return compareVersions(bv, av);
        })[0];

        try {
          const response = await fetch(`/agents/${project}/${latest.file}`);
          if (!response.ok) {
            throw new Error(`Failed to load metadata (${response.status})`);
          }
          const raw = await response.text();
          return [project, parseAgentMeta(raw)];
        } catch {
          return [project, {}];
        }
      }));

      if (!cancelled) {
        setMetaByProject(Object.fromEntries(entries));
      }
    }

    loadMeta();
    return () => { cancelled = true; };
  }, []);

  const languages = React.useMemo(() => {
    const set = new Set();
    Object.values(metaByProject).forEach((m) => { if (m.language) set.add(m.language); });
    return Array.from(set).sort();
  }, [metaByProject]);

  return (
    <Layout title="All Agent Packs">
      <main className="container agenthub-page-shell">
        <div className="agenthub-page-header cg-glass-panel cg-industrial-border">
          <p className="agenthub-page-header__label">Registry</p>
          <h1 className="agenthub-page-header__title">All AgentHub Packs</h1>
          <p className="agenthub-page-header__copy">
          Browse canonical Markdown packs and generated Claude-compatible skills.
          Use search and filters to find the pack you need, then inspect whichever
          distribution fits your workflow.
          </p>
        </div>
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
                meta={meta}
                latestSkill={skillByProjectVersion.get(`${project}:${stripSpecExtension(latestSpec.file)}`) || null}
              />
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
