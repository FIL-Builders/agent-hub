import React from 'react';
import Layout from '@theme/Layout';
import {useLocation} from '@docusaurus/router';
import JSZip from 'jszip';
import SkillBundleCard from '@site/src/components/SkillBundleCard';
import SpecCard from '@site/src/components/SpecCard';
import agentSpecs from '@site/src/generated/agent-index.json';
import distributionIndex from '@site/src/generated/distribution-index.json';
import {
  buildPackPageUrl,
  stripSpecExtension,
} from '@site/src/utils/agentSpec';
import {buildInstallOptionsUrl} from '@site/src/utils/skillInstall';
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
  const [ctaState, setCtaState] = React.useState('idle');
  const menuRef = React.useRef(null);

  const selectedSpec = specsForProject.find((spec) => stripSpecExtension(spec.file) === selectedVersion) || latestSpec;
  const selectedSkill = selectedVersion ? skillByVersion.get(selectedVersion) || null : null;
  const effectiveFormat = selectedFormat === 'claude' && !selectedSkill ? 'canonical' : selectedFormat;
  const selectedMeta = selectedSpec || {};
  const selectedTitle = selectedMeta.specName || selectedMeta.project || project;
  const selectedPurpose = selectedMeta.purpose || '';
  const selectedLanguage = selectedMeta.language || '';
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

  const canonicalDownloadUrl = `/${buildCanonicalDownloadUrl(project, selectedVersion)}`;
  const installGuideUrl = buildInstallOptionsUrl(project, selectedVersion);
  const installPromptUrl = buildInstallOptionsUrl(project, selectedVersion, 'install-via-prompt');

  async function handleCopyPackText() {
    if (!canonicalRaw) {
      return;
    }
    try {
      await navigator.clipboard.writeText(canonicalRaw);
      setCtaState('pack-copied');
      window.setTimeout(() => setCtaState('idle'), 1600);
    } catch {
      setCtaState('idle');
    }
  }

  async function handleDownloadSkillBundle() {
    if (!selectedSkill || !skillManifest) {
      return;
    }

    try {
      setCtaState('downloading');
      const zip = new JSZip();
      const files = Array.isArray(skillManifest.files) ? skillManifest.files : [];

      await Promise.all(files.map(async (file) => {
        const response = await fetch(buildSkillBundleUrl(project, selectedVersion, file));
        if (!response.ok) {
          throw new Error(`Failed to fetch ${file}`);
        }
        const content = await response.text();
        zip.file(file, content);
      }));

      const blob = await zip.generateAsync({type: 'blob'});
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${project}-${selectedVersion}-claude-skill.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
      setCtaState('downloaded');
      window.setTimeout(() => setCtaState('idle'), 1600);
    } catch {
      setCtaState('idle');
    }
  }

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
        <div className="spec-page-nav cg-glass-panel cg-industrial-border-accent">
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-desktop">← All Agent Packs</a>
          <a href="/agents/" className="spec-breadcrumb spec-breadcrumb-mobile">← Back</a>
        </div>

        <div className="agenthub-page-header cg-glass-panel cg-industrial-border">
          <p className="agenthub-page-header__label">Pack</p>
          <h1 className="spec-page-title">{selectedTitle}</h1>
          {selectedPurpose ? (
            <p className="agenthub-page-header__copy">{selectedPurpose}</p>
          ) : null}
          <div className="pack-summary-pills">
            {selectedLanguage ? (
              <span className="pill-link">{selectedLanguage}</span>
            ) : null}
            <span className="pill-link">
              {selectedSkill ? 'Markdown + Claude Skill' : 'Markdown Only'}
            </span>
          </div>
        </div>

        <div className="pack-view-toolbar cg-glass-panel cg-industrial-border-accent">
          <div className="pack-view-toolbar__group pack-view-toolbar__group--formats">
            <span className="pack-view-toolbar__label">Format</span>
            <div className="pack-format-toggle" role="tablist" aria-label="Pack format">
              <button
                type="button"
                className={`pack-format-toggle__button ${effectiveFormat === 'canonical' ? 'is-active' : ''}`}
                onClick={() => setSelectedFormat('canonical')}
              >
                Markdown Pack
              </button>
              <button
                type="button"
                className={`pack-format-toggle__button ${effectiveFormat === 'claude' ? 'is-active' : ''}`}
                onClick={() => setSelectedFormat('claude')}
                disabled={!selectedSkill}
                title={selectedSkill ? 'View Claude skill' : 'No Claude skill for this version'}
              >
                Claude Skill
              </button>
            </div>
          </div>

        </div>

        <div className="pack-primary-actions-panel cg-glass-panel cg-industrial-border-accent">
          <p className="pack-view-toolbar__label">Next Step</p>
          <div className="pack-primary-actions-panel__body">
            <div className="pack-primary-actions">
              {effectiveFormat === 'canonical' ? (
                <>
                <button
                  type="button"
                  className="button button--secondary button--sm"
                  onClick={handleCopyPackText}
                  disabled={canonicalStatus !== 'ready' || !canonicalRaw}
                >
                  {ctaState === 'pack-copied' ? 'Pack Text Copied' : 'Copy Pack Text'}
                </button>
                <a className="button button--secondary button--sm" href={canonicalDownloadUrl} download>
                  Download Markdown
                </a>
              </>
            ) : (
                <div className="pack-skill-actions">
                  <button
                    type="button"
                    className="button button--secondary button--sm"
                    onClick={handleDownloadSkillBundle}
                    disabled={ctaState === 'downloading'}
                  >
                    {ctaState === 'downloading'
                      ? 'Preparing Bundle'
                      : ctaState === 'downloaded'
                        ? 'Bundle Downloaded'
                        : 'Download Skill Bundle'}
                  </button>
                  <a className="button button--secondary button--sm" href={installPromptUrl}>
                    Install Via Prompt
                  </a>
                  <a className="button button--secondary button--sm" href={installGuideUrl}>
                    Install Options
                  </a>
                  <p className="pack-skill-actions__support">
                    Download the bundle, hand the install prompt to a local AI agent, or review the install options for Claude Code and repo-local workflows.
                  </p>
                </div>
              )}
            </div>
            <div className="pack-view-toolbar__group pack-view-toolbar__group--actions" ref={menuRef}>
              <span className="pack-view-toolbar__label">Utilities</span>
              <button type="button" className="agent-action-btn" onClick={() => setMenuOpen((value) => !value)}>
                Utilities ▾
              </button>
              {menuOpen ? (
                <div className="spec-dropdown-menu" style={{right: 0, left: 'auto'}}>
                  <button
                    className="spec-dropdown-item"
                    onClick={() => {
                      navigator.clipboard.writeText(currentPackUrl).finally(() => setMenuOpen(false));
                    }}
                  >
                    🔗 Copy Pack Link
                  </button>
                  {availableVersions.length > 1 ? (
                    <>
                      <span className="spec-dropdown-label">Older Versions</span>
                      {availableVersions
                        .filter((version) => version !== selectedVersion)
                        .map((version) => (
                          <a
                            key={version}
                            className="spec-dropdown-item"
                            href={buildPackPageUrl(project, {
                              version,
                              format: effectiveFormat,
                            })}
                            onClick={() => setMenuOpen(false)}
                          >
                            ↳ Open {version}
                          </a>
                        ))}
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

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
