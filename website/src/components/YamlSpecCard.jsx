import React, { useState } from 'react';

/**
 * YamlSpecCard displays YAML content in a styled card with a toggle to show
 * or hide the raw specification and a download link.  The component is
 * intentionally self contained so it can be imported into MDX pages
 * representing agent specs.  To use this component within a MDX file,
 * import it at the top of the file:
 *
 * ```mdx
 * import YamlSpecCard from '@site/src/components/YamlSpecCard';
 *
 * <YamlSpecCard spec={require('!!raw-loader!./my-spec.yaml').default} downloadUrl={'/agents/my-spec.yaml'} />
 * ```
 */
const YamlSpecCard = ({ spec, downloadUrl }) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleVisible = () => setVisible((v) => !v);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(spec);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Split the YAML into lines for line numbering.  Use empty array when hidden to avoid unnecessary work.
  const lines = visible ? spec.trimEnd().split('\n') : [];

  // Build absolute URL for the YAML spec so external tools can fetch it.
  const getAbsoluteUrl = (path) => {
    if (!path) return '';
    try {
      if (typeof window !== 'undefined') {
        return new URL(path, window.location.origin).toString();
      }
      return path; // SSR fallback; will be resolved client-side
    } catch (e) {
      return path;
    }
  };

  const specUrl = getAbsoluteUrl(downloadUrl);
  const promptText = specUrl
    ? `Fetch this YAML agent spec: ${specUrl}\nUse your browsing/tool agent to download it, then parse and process it. Confirm once loaded.`
    : '';

  return (
    <div className="yaml-spec-card ai-card">
      <div className="yaml-spec-controls">
        <button
          className="yaml-spec-toggle"
          onClick={toggleVisible}
          aria-expanded={visible}
        >
          {visible ? 'Hide Specification' : 'View Specification'}
        </button>
        {downloadUrl && (
          <a className="yaml-spec-download" href={downloadUrl} download>
            Download
          </a>
        )}
        {downloadUrl && (
          <>
            <a
              className="yaml-spec-chatgpt"
              href={`https://chatgpt.com/?prompt=${encodeURIComponent(promptText)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open prompt in ChatGPT"
              title="Open in ChatGPT"
            >
              ChatGPT
            </a>
            <a
              className="yaml-spec-claude"
              href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open prompt in Claude"
              title="Open in Claude"
            >
              Claude
            </a>
          </>
        )}
        <button
          className="yaml-spec-copy"
          onClick={handleCopy}
          aria-label="Copy YAML to clipboard"
          title={copied ? 'Copied!' : 'Copy'}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {visible && (
        <pre className="yaml-spec-content">
          {lines.map((line, idx) => (
            <div key={idx} className="yaml-spec-line">
              <span className="yaml-line-number">{idx + 1}</span>
              <span className="yaml-line-content">{line}</span>
            </div>
          ))}
        </pre>
      )}
    </div>
  );
};

export default YamlSpecCard;
