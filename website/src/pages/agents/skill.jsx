import React from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import SkillBundleCard from '@site/src/components/SkillBundleCard';
import {
  buildSkillBundleUrl,
  buildSkillManifestUrl,
} from '@site/src/utils/skillBundle';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AgentSkillPage() {
  const query = useQuery();
  const project = query.get('project');
  const version = query.get('version');
  const initialFile = query.get('file') || 'SKILL.md';

  const [manifest, setManifest] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(initialFile);
  const [selectedContent, setSelectedContent] = React.useState('');
  const [status, setStatus] = React.useState('loading');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError('');
    setManifest(null);
    setSelectedContent('');
    if (!project || !version) {
      setStatus('error');
      setError('Missing project or version parameter');
      return () => {
        cancelled = true;
      };
    }

    fetch(buildSkillManifestUrl(project, version))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load manifest (${response.status})`);
        }
        return response.json();
      })
      .then((nextManifest) => {
        if (!cancelled) {
          setManifest(nextManifest);
          setSelectedFile(initialFile || nextManifest.entrypoint || 'SKILL.md');
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setStatus('error');
          setError(nextError?.message || String(nextError));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [project, version, initialFile]);

  React.useEffect(() => {
    let cancelled = false;
    if (!manifest || !project || !version || !selectedFile) {
      return () => {
        cancelled = true;
      };
    }

    setStatus('loading');
    setError('');
    fetch(buildSkillBundleUrl(project, version, selectedFile))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load bundle file (${response.status})`);
        }
        return response.text();
      })
      .then((content) => {
        if (!cancelled) {
          setSelectedContent(content);
          setStatus('ready');
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setStatus('error');
          setError(nextError?.message || String(nextError));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [manifest, project, version, selectedFile]);

  return (
    <Layout title={project && version ? `${project} – Claude Skill ${version}` : 'Claude-Compatible Skill'}>
      <main className="container spec-page agenthub-page-shell">
        <div className="spec-page-nav">
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-desktop">← All Agent Packs</a>
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-mobile">← Back</a>
        </div>
        {status === 'loading' && (
          <div className="ai-card cg-glass-panel cg-industrial-border" aria-busy="true">
            <div className="spec-skeleton">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-subtitle" />
              <div className="skeleton skeleton-subtitle short" />
              <div className="skeleton-code">
                {[80, 95, 60, 85, 70, 90, 50, 88].map((w, i) => (
                  <div key={i} className="skeleton skeleton-line" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {status === 'ready' && manifest ? (
          <>
            <div className="agenthub-page-header cg-glass-panel cg-industrial-border">
              <p className="agenthub-page-header__label">Distribution</p>
              <h1 className="spec-page-title">{project} / Claude-compatible skill / {version}</h1>
              <p className="agenthub-page-header__copy">
                Inspect the generated Claude-compatible skill bundle alongside the
                canonical Markdown pack.
              </p>
            </div>
            <SkillBundleCard
              project={project}
              version={version}
              manifest={manifest}
              selectedFile={selectedFile}
              selectedContent={selectedContent}
              onSelectFile={setSelectedFile}
            />
          </>
        ) : null}

        {status === 'error' && (
          <div className="ai-card cg-glass-panel cg-industrial-border">
            <h3>Claude-Compatible Skill Not Found</h3>
            <p>
              Unable to load the generated skill for project <code>{project || '(missing)'}</code> and
              version <code>{version || '(missing)'}</code>.
            </p>
            <p style={{ color: 'var(--ifm-color-muted, #94a3b8)' }}>{error}</p>
          </div>
        )}
      </main>
    </Layout>
  );
}
