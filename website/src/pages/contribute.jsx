import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const GITHUB_REPO = 'https://github.com/FIL-Builders/agent-hub';
const GITHUB_PULLS = 'https://github.com/FIL-Builders/agent-hub/pulls';
const CONTRIBUTING_GUIDE = 'https://github.com/FIL-Builders/agent-hub/blob/main/CONTRIBUTING.md';
const PACK_TUTORIAL = '/tutorials/authoritative-documents-for-v0.4-pack-generation';

function ActionLink({to, href, children, primary = false, small = false}) {
  const className = `button ${primary ? 'button--primary' : 'button--secondary'}${small ? ' button--sm' : ''}`;
  if (to) {
    return <Link className={className} to={to}>{children}</Link>;
  }
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export default function ContributePage() {
  return (
    <Layout
      title="Contribute"
      description="Create or improve Agent Hub knowledge packs with your local AI coding agent, the repo prompts, and the GitHub PR workflow."
    >
      <main className="container agenthub-contribute-page">
        <section className="agenthub-contribute-hero">
          <div className="agenthub-contribute-hero__main cg-glass-panel cg-industrial-border">
            <p className="agenthub-home-kicker">Community Contribution Workflow</p>
            <h1 className="agenthub-contribute-title">Contribute to Agent Hub</h1>
            <p className="agenthub-contribute-lead">
              Create or improve Agent Hub packs with your local AI coding agent, then send the
              result through GitHub PRs so it can be reviewed and merged in the open.
            </p>
            <p className="agenthub-contribute-definition">
              Agent Hub packs are versioned Markdown guides that help AI coding agents use a tool,
              library, API, or product surface correctly.
            </p>
            <div className="agenthub-contribute-actions">
              <ActionLink href={GITHUB_REPO} primary>Open GitHub Repo</ActionLink>
              <ActionLink to={PACK_TUTORIAL}>Read Pack Tutorial</ActionLink>
            </div>
          </div>

          <div className="agenthub-contribute-hero__side cg-glass-panel cg-industrial-border">
            <p className="agenthub-home-panel__label">How It Works</p>
            <ol className="agenthub-contribute-steps">
              <li>Pick a pack you want to improve or a project you want Agent Hub to cover.</li>
              <li>Use your local AI coding agent plus the repo prompts to draft, revise, and validate the pack.</li>
              <li>Open a GitHub PR so the change can be reviewed, managed, and merged in the open.</li>
            </ol>
          </div>
        </section>

        <section className="agenthub-contribute-grid">
          <div className="agenthub-contribute-card cg-glass-panel cg-industrial-border cg-industrial-border-accent">
            <p className="agenthub-feature-card__label">Ways to Contribute</p>
            <h3>Create or Improve Packs</h3>
            <p>
              Start a new pack for a library, API, or product you know well, or tighten an
              existing pack by updating versions, adding workflows, fixing structure, or improving
              troubleshooting guidance.
            </p>
            <div className="agenthub-contribute-card__actions">
              <ActionLink to="/agents/" small>Browse Packs</ActionLink>
            </div>
          </div>

          <div className="agenthub-contribute-card cg-glass-panel cg-industrial-border">
            <p className="agenthub-feature-card__label">Local AI Workflow</p>
            <h3>Use Your Local AI Coding Agent</h3>
            <p>
              Use your local AI coding agent to generate a new pack or improve an existing one
              with the prompts and runbooks in this repo. Then validate the result locally and
              send it through GitHub as a normal pull request.
            </p>
            <p>
              This tutorial shows how to generate or revise a pack locally, which repo
              documents to trust, and how contributions move from draft to a reviewable pull
              request in the open.
            </p>
            <div className="agenthub-contribute-card__actions">
              <ActionLink to={PACK_TUTORIAL} small>Read Tutorial</ActionLink>
            </div>
          </div>
        </section>

        <section className="agenthub-contribute-community cg-glass-panel cg-industrial-border">
          <div className="agenthub-contribute-community__intro">
            <p className="agenthub-feature-card__label">Community-Generated Packs</p>
            <h2>All Content Stays in the GitHub PR Flow</h2>
            <p>
              Agent Hub knowledge packs are meant to be community generated, versioned, reviewed,
              and improved over time. The repo is the source of truth for pack content, prompts,
              tutorials, and validation rules, so contributions land through pull requests instead
              of disappearing into one-off prompt experiments.
            </p>
          </div>

          <div className="agenthub-contribute-community__grid">
            <div className="agenthub-contribute-mini cg-glass-panel cg-industrial-border cg-industrial-border-accent">
              <h3>What You Can Add</h3>
              <ul>
                <li>New packs for libraries, frameworks, APIs, SDKs, and product surfaces</li>
                <li>Better workflows, troubleshooting sections, and version guidance</li>
                <li>Prompt and evaluation improvements that raise the quality bar for future packs</li>
              </ul>
            </div>

            <div className="agenthub-contribute-mini cg-glass-panel cg-industrial-border">
              <h3>How Review Works</h3>
              <p>
                Agent Hub AI agents help monitor pack quality through the same GitHub PR workflow
                contributors already use. They can flag gaps, validate structure, and support
                iteration, while humans still review and merge the final change.
              </p>
            </div>
          </div>

          <div className="agenthub-contribute-actions agenthub-contribute-actions--bottom">
            <ActionLink href={GITHUB_PULLS} primary>View Pull Requests</ActionLink>
          </div>
        </section>
      </main>
    </Layout>
  );
}
