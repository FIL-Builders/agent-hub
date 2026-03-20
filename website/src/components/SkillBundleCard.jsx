import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { splitFrontmatter } from '@site/src/utils/agentSpec';
import {
  buildSkillBundleUrl,
  isJsonFile,
  isMarkdownFile,
  normalizeSkillFile,
} from '@site/src/utils/skillBundle';

export default function SkillBundleCard({
  project,
  version,
  manifest,
  selectedFile,
  selectedContent,
  onSelectFile,
  hideActions = false,
}) {
  const files = manifest?.files || [];
  const normalizedSelected = normalizeSkillFile(selectedFile || manifest?.entrypoint || 'SKILL.md');
  const selectedDownloadUrl = buildSkillBundleUrl(project, version, normalizedSelected);
  const renderedMarkdown = isMarkdownFile(normalizedSelected)
    ? splitFrontmatter(selectedContent || '').body
    : selectedContent;

  return (
    <div className="skill-bundle-shell">
      <aside className="skill-bundle-nav ai-card cg-glass-panel cg-industrial-border">
        <div className="skill-bundle-nav__header">
          <p className="agenthub-page-header__label">Claude-Compatible Skill</p>
          <h3 className="skill-bundle-nav__title">{manifest?.displayName || manifest?.display_name || project}</h3>
          {manifest?.description ? (
            <p className="skill-bundle-nav__copy">{manifest.description}</p>
          ) : null}
        </div>
        <div className="skill-bundle-nav__meta">
          <span className="pill-link">Distribution: {manifest?.distribution || 'claude'}</span>
          <span className="pill-link">Version: {version}</span>
        </div>
        <div className="skill-bundle-nav__files">
          {files.map((file) => (
            <button
              key={file}
              className={`skill-bundle-nav__file ${file === normalizedSelected ? 'is-active' : ''}`}
              onClick={() => onSelectFile(file)}
              type="button"
            >
              {file}
            </button>
          ))}
        </div>
      </aside>

      <div className="skill-bundle-main">
        <div className="spec-card ai-card cg-glass-panel cg-industrial-border cg-industrial-border-accent">
          <div className="spec-card-header">
            <div className="spec-card-headings">
              <p className="agenthub-page-header__label">Bundle File</p>
              <h3 className="spec-card-title">{normalizedSelected}</h3>
              {manifest?.generated_from ? (
                <p className="spec-card-purpose">Generated from {manifest.generated_from}</p>
              ) : null}
            </div>
            {!hideActions ? (
              <div className="spec-actions">
                <a className="spec-action-btn" href={selectedDownloadUrl} download>
                  ⬇️ Download File
                </a>
                <a
                  className="spec-action-btn"
                  href={`/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(`${version}.md`)}`}
                >
                  🔍 View Canonical Pack
                </a>
              </div>
            ) : null}
          </div>
          <div className="skill-bundle-install cg-glass-panel cg-industrial-border-accent">
            <p className="skill-bundle-install__copy">
              Install this skill in a Claude-compatible environment by copying the
              bundle files into your local skills directory with <code>SKILL.md</code> at
              the top level.
            </p>
          </div>
          <div className="spec-card-content markdown">
            {isMarkdownFile(normalizedSelected) ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {renderedMarkdown}
              </ReactMarkdown>
            ) : isJsonFile(normalizedSelected) ? (
              <pre className="skill-bundle-code">{selectedContent}</pre>
            ) : (
              <pre className="skill-bundle-code">{selectedContent}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
