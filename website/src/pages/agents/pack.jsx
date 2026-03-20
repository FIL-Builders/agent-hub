import React from 'react';
import Layout from '@theme/Layout';
import {useLocation} from '@docusaurus/router';
import SkillBundleCard from '@site/src/components/SkillBundleCard';
import SpecCard from '@site/src/components/SpecCard';
import agentSpecs from '@site/src/generated/agent-index.json';
import distributionIndex from '@site/src/generated/distribution-index.json';
import {buildPrompt} from '@site/src/utils/prompt';
import {
  buildPackPageUrl,
  stripSpecExtension,
} from '@site/src/utils/agentSpec';
import {
  buildSkillBundleUrl,
  buildSkillManifestUrl,
} from '@site/src/utils/skillBundle';

function useQuery() {
  const {search} = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function parseVersion(filename = '') {
  return stripSpecExtension(filename).split('.').map((n) => parseInt(n, 10) || 0);
}

function compareVersions(aParts, bParts) {
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i += 1) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal !== bVal) {
      return aVal - bVal;
    }
  }
  return 0;
}

function sortSpecsDesc(specs = []) {
  return specs.slice().sort((a, b) => compareVersions(parseVersion(b.file), parseVersion(a.file)));
}

function buildCanonicalDownloadUrl(project, version) {
  return `agents/${project}/${version}.md`;
}

function buildCanonicalRawUrl(project, version) {
  return `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/agents/${project}/${version}.md`;
}

export default function AgentPackPage() {
  const query = useQuery();
  const project = query.get('project');
  const requestedVersion = query.get('version') || '';
  const requestedFormat = query.get('format') || '';
  const requestedFile = query.get('file') || '';

  const specsForProject = React.useMemo(() => {
    if (!project) {
      return [];
    }
    return sortSpecsDesc(agentSpecs.filter((spec) => spec.project === project));
  }, [project]);

  const skillByVersion = React.useMemo(() => {
    const next = new Map();
    distributionIndex
      .filter((entry) => entry.project === project)
      .forEach((entry) => next.set(entry.version, entry));
    return next;
  }, [project]);

  const latestSpec = specsForProject[0] || null;
  const availableVersions = specsForProject.map((spec) => stripSpecExtension(spec.file));

  const initialVersion = React.useMemo(() => {
    if (!latestSpec) {
      return '';
    }
    return availableVersions.includes(requestedVersion)
      ? requestedVersion
      : stripSpecExtension(latestSpec.file);
  }, [availableVersions, latestSpec, requestedVersion]);

  const [selectedVersion, setSelectedVersion] = React.useState(initialVersion);
  const [selectedFormat, setSelectedFormat] = React.useState('canonical');
  const [selectedSkillFile, setSelectedSkillFile] = React.useState(requestedFile || 'SKILL.md');
  const [canonicalRaw, setCanonicalRaw] = React.useState('');
  const [canonicalStatus, setCanonicalStatus] = React.useState('idle');
  const [canonicalError, setCanonicalError] = React.useState('');
  const [skillManifest, setSkillManifest] = React.useState(null);
  const [skillContent, setSkillContent] = React.useState('');
  const [skillStatus, setSkillStatus] = React.useState('idle');
  const [skillError, setSkillError] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  const selectedSpec = specsForProject.find((spec) => stripSpecExtension(spec.file) === selectedVersion) || latestSpec;
  const selectedSkill = selectedVersion ? skillByVersion.get(selectedVersion) || null : null;
  const effectiveFormat = selectedFormat === 'claude' && !selectedSkill ? 'canonical' : selectedFormat;
  const selectedMeta = selectedSpec || {};
  const selectedTitle = selectedMeta.specName || selectedMeta.project || project;
  const selectedPurpose = selectedMeta.purpose || '';
  const currentPackUrl = buildPackPageUrl(project, {
    version: selectedVersion,
    format: effectiveFormat,
    file: effectiveFormat === 'claude' && selectedSkillFile !== 'SKILL.md' ? selectedSkillFile : '',
  });

  React.useEffect(() => {
    setSelectedVersion(initialVersion);
  }, [initialVersion]);

  React.useEffect(() => {
    if (!initialVersion) {
      return;
    }

    const initialSkill = skillByVersion.get(initialVersion);
    if (requestedFormat === 'claude' && initialSkill) {
      setSelectedFormat('claude');
    } else if (requestedFormat === 'canonical') {
      setSelectedFormat('canonical');
    } else {
      setSelectedFormat('canonical');
    }
  }, [initialVersion, requestedFormat, skillByVersion]);

  React.useEffect(() => {
    if (!selectedSkill) {
      setSelectedFormat('canonical');
    }
  }, [selectedSkill]);

  React.useEffect(() => {
    const next = requestedFile || 'SKILL.md';
    setSelectedSkillFile(next);
  }, [requestedFile, selectedVersion]);

  React.useEffect(() => {
    const onClick = (event) => {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  React.useEffect(() => {
    if (!project || !selectedVersion) {
      return;
    }
    const nextUrl = buildPackPageUrl(project, {
      version: selectedVersion,
      format: effectiveFormat,
      file: effectiveFormat === 'claude' && selectedSkillFile !== 'SKILL.md' ? selectedSkillFile : '',
    });
    window.history.replaceState(null, '', nextUrl);
  }, [effectiveFormat, project, selectedSkillFile, selectedVersion]);

  React.useEffect(() => {
    let cancelled = false;

    if (!project || !selectedVersion || effectiveFormat !== 'canonical') {
      setCanonicalRaw('');
      setCanonicalStatus('idle');
      setCanonicalError('');
      return () => {
        cancelled = true;
      };
    }

    setCanonicalStatus('loading');
    setCanonicalError('');
    fetch(`/agents/${project}/${selectedVersion}.md`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load canonical pack (${response.status})`);
        }
        return response.text();
      })
      .then((raw) => {
        if (!cancelled) {
          setCanonicalRaw(raw);
          setCanonicalStatus('ready');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setCanonicalStatus('error');
          setCanonicalError(error?.message || String(error));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveFormat, project, selectedVersion]);

  React.useEffect(() => {
    let cancelled = false;

    if (!project || !selectedVersion || effectiveFormat !== 'claude' || !selectedSkill) {
      setSkillManifest(null);
      setSkillContent('');
      setSkillStatus('idle');
      setSkillError('');
      return () => {
        cancelled = true;
      };
    }

    setSkillStatus('loading');
    setSkillError('');
    fetch(buildSkillManifestUrl(project, selectedVersion))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load skill manifest (${response.status})`);
        }
        return response.json();
      })
      .then((manifest) => {
        if (!cancelled) {
          setSkillManifest(manifest);
          const manifestFiles = Array.isArray(manifest.files) ? manifest.files : [];
          const nextFile = requestedFile && manifestFiles.includes(requestedFile)
            ? requestedFile
            : (manifest.entrypoint || 'SKILL.md');
          setSelectedSkillFile(nextFile);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSkillStatus('error');
          setSkillError(error?.message || String(error));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveFormat, project, requestedFile, selectedSkill, selectedVersion]);

  React.useEffect(() => {
    let cancelled = false;

    if (
      !project ||
      !selectedVersion ||
      effectiveFormat !== 'claude' ||
      !skillManifest ||
      !selectedSkillFile
    ) {
      return () => {
        cancelled = true;
      };
    }

    setSkillStatus('loading');
    setSkillError('');
    fetch(buildSkillBundleUrl(project, selectedVersion, selectedSkillFile))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load bundle file (${response.status})`);
        }
        return response.text();
      })
      .then((content) => {
        if (!cancelled) {
          setSkillContent(content);
          setSkillStatus('ready');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSkillStatus('error');
          setSkillError(error?.message || String(error));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveFormat, project, selectedSkillFile, selectedVersion, skillManifest]);

  if (!project || !latestSpec) {
    return (
      <Layout title="Agent Pack">
        <main className="container spec-page agenthub-page-shell">
          <div className="ai-card cg-glass-panel cg-industrial-border">
            <h3>Pack Not Found</h3>
            <p>Choose a pack from the registry to inspect versions and formats.</p>
            <a className="button button--secondary button--sm" href="/agents/">Back to All Agent Packs</a>
          </div>
        </main>
      </Layout>
    );
  }

  const rawUrl = buildCanonicalRawUrl(project, selectedVersion);
  const promptText = buildPrompt(rawUrl);
  const canonicalDownloadUrl = `/${buildCanonicalDownloadUrl(project, selectedVersion)}`;
  const skillDownloadUrl = effectiveFormat === 'claude'
    ? buildSkillBundleUrl(project, selectedVersion, selectedSkillFile || 'SKILL.md')
    : '';
  const directFormatUrl = effectiveFormat === 'claude'
    ? `/agents/skill?project=${encodeURIComponent(project)}&version=${encodeURIComponent(selectedVersion)}`
    : `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(`${selectedVersion}.md`)}`;

  const renderBody = () => {
    if (effectiveFormat === 'canonical') {
      if (canonicalStatus === 'loading') {
        return <LoadingCard />;
      }
      if (canonicalStatus === 'error') {
        return <ErrorCard title="Canonical Pack Unavailable" message={canonicalError} />;
      }
      return (
        <SpecCard
          spec={canonicalRaw}
          downloadUrl={buildCanonicalDownloadUrl(project, selectedVersion)}
          hideHeader={true}
          disableMobileActions={true}
          hideActions={true}
        />
      );
    }

    if (skillStatus === 'loading' || !skillManifest) {
      return <LoadingCard />;
    }
    if (skillStatus === 'error') {
      return <ErrorCard title="Claude-Compatible Skill Unavailable" message={skillError} />;
    }
    return (
      <SkillBundleCard
        project={project}
        version={selectedVersion}
        manifest={skillManifest}
        selectedFile={selectedSkillFile}
        selectedContent={skillContent}
        onSelectFile={setSelectedSkillFile}
        hideActions={true}
      />
    );
  };

  return (
    <Layout title={`${selectedTitle} – Agent Pack`}>
      <main className="container spec-page agenthub-page-shell">
        <div className="spec-page-nav">
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-desktop">← All Agent Packs</a>
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-mobile">← Back</a>
        </div>

        <div className="agenthub-page-header cg-glass-panel cg-industrial-border">
          <p className="agenthub-page-header__label">Pack</p>
          <h1 className="spec-page-title">{selectedTitle}</h1>
          {selectedPurpose ? (
            <p className="agenthub-page-header__copy">{selectedPurpose}</p>
          ) : null}
        </div>

        <div className="pack-view-toolbar cg-glass-panel cg-industrial-border-accent">
          <div className="pack-view-toolbar__group">
            <label className="pack-view-toolbar__label" htmlFor="pack-version-select">Version</label>
            <select
              id="pack-version-select"
              className="agents-select pack-view-toolbar__select"
              value={selectedVersion}
              onChange={(event) => setSelectedVersion(event.target.value)}
            >
              {availableVersions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>

          <div className="pack-view-toolbar__group pack-view-toolbar__group--formats">
            <span className="pack-view-toolbar__label">Format</span>
            <div className="pack-format-toggle" role="tablist" aria-label="Pack format">
              <button
                type="button"
                className={`pack-format-toggle__button ${effectiveFormat === 'canonical' ? 'is-active' : ''}`}
                onClick={() => setSelectedFormat('canonical')}
              >
                Canonical Pack
              </button>
              <button
                type="button"
                className={`pack-format-toggle__button ${effectiveFormat === 'claude' ? 'is-active' : ''}`}
                onClick={() => setSelectedFormat('claude')}
                disabled={!selectedSkill}
                title={selectedSkill ? 'View Claude-compatible skill' : 'No Claude-compatible skill for this version'}
              >
                Claude-Compatible Skill
              </button>
            </div>
          </div>

          <div className="pack-view-toolbar__group pack-view-toolbar__group--actions" ref={menuRef}>
            <span className="pack-view-toolbar__label">Details</span>
            <button type="button" className="agent-action-btn" onClick={() => setMenuOpen((value) => !value)}>
              More ▾
            </button>
            {menuOpen ? (
              <div className="spec-dropdown-menu" style={{right: 0, left: 'auto'}}>
                <a className="spec-dropdown-item" href={directFormatUrl}>
                  🔍 Open Direct {effectiveFormat === 'claude' ? 'Claude Skill' : 'Canonical Pack'} Page
                </a>
                <a
                  className="spec-dropdown-item"
                  href={effectiveFormat === 'claude' ? skillDownloadUrl : canonicalDownloadUrl}
                  download
                >
                  ⬇️ Download Current View
                </a>
                <button
                  className="spec-dropdown-item"
                  onClick={() => {
                    navigator.clipboard.writeText(currentPackUrl).finally(() => setMenuOpen(false));
                  }}
                >
                  🔗 Copy Pack Link
                </button>
                {effectiveFormat === 'canonical' && promptText ? (
                  <a
                    className="spec-dropdown-item"
                    href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    🤖 Open in ChatGPT
                  </a>
                ) : null}
                {effectiveFormat === 'canonical' && promptText ? (
                  <a
                    className="spec-dropdown-item"
                    href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    ✨ Open in Claude
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {selectedSkill || effectiveFormat === 'canonical' ? (
          <div className="pack-view-summary cg-glass-panel cg-industrial-border">
            <p className="agenthub-page-header__label">Current View</p>
            <p className="pack-view-summary__copy">
              {effectiveFormat === 'canonical'
                ? 'Inspect the canonical Markdown pack for this version, then switch to the Claude-compatible skill if you want the generated local-install distribution.'
                : 'Inspect the generated Claude-compatible skill for this version, then switch back to the canonical pack if you want the source Markdown pack.'}
            </p>
          </div>
        ) : null}

        {renderBody()}
      </main>
    </Layout>
  );
}

function LoadingCard() {
  return (
    <div className="ai-card cg-glass-panel cg-industrial-border" aria-busy="true">
      <div className="spec-skeleton">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
        <div className="skeleton skeleton-subtitle short" />
        <div className="skeleton-code">
          {[80, 95, 60, 85, 70, 90, 50, 88].map((width, index) => (
            <div key={index} className="skeleton skeleton-line" style={{width: `${width}%`}} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorCard({title, message}) {
  return (
    <div className="ai-card cg-glass-panel cg-industrial-border">
      <h3>{title}</h3>
      <p style={{color: 'var(--ifm-color-muted, #94a3b8)'}}>{message}</p>
    </div>
  );
}
