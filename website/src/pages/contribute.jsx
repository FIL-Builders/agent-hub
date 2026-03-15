import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const GITHUB_REPO = 'https://github.com/FIL-Builders/agent-hub';
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
              Create or improve versioned knowledge packs for the tools you care about using your
              local AI coding agent, the prompts already in this repo, and the GitHub pull request
              workflow that keeps everything reviewable.
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
          <div className="agenthub-contribute-card agenthub-contribute-card--narrow cg-glass-panel cg-industrial-border cg-industrial-border-accent">
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

          <div className="agenthub-contribute-card agenthub-contribute-card--wide cg-glass-panel cg-industrial-border">
            <p className="agenthub-feature-card__label">Local AI Workflow</p>
            <h3>Use Your Local AI Coding Agent</h3>
            <p>
              You do not need to write every pack by hand. Agent Hub is designed so contributors
              can use a local AI coding agent on their own machine, apply the repo’s pack prompts
              and runbooks, iterate on content, validate the result, and then send the change
              through GitHub.
            </p>
            <p>
              That means you can generate new packs for projects you care about, tweak existing
              packs with better examples or source grounding, and keep the entire contribution flow
              inside your normal local coding workflow.
            </p>
            <div className="agenthub-contribute-card__actions">
              <ActionLink href={CONTRIBUTING_GUIDE} small>Read Contribution Guide</ActionLink>
              <ActionLink to={PACK_TUTORIAL} small>See Tutorial</ActionLink>
            </div>
          </div>

          <div className="agenthub-contribute-card agenthub-contribute-card--narrow cg-glass-panel cg-industrial-border cg-industrial-border-accent">
            <p className="agenthub-feature-card__label">Tutorial Summary</p>
            <h3>Start With the Pack Generation Tutorial</h3>
            <p>
              The authoritative v0.4 tutorial explains which documents govern pack generation,
              how the prompts and runbook fit together, and which files should be treated as the
              source of truth when you generate or revise a pack locally.
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
                Agent Hub AI agents will help monitor and manage content through the same GitHub PR
                process contributors already use. They can surface gaps, validate structure, and
                keep iteration moving, while humans still review, discuss, and merge the final
                change.
              </p>
            </div>
          </div>

          <div className="agenthub-contribute-actions agenthub-contribute-actions--bottom">
            <ActionLink href={GITHUB_REPO} primary>Open GitHub Repo</ActionLink>
            <ActionLink href={`${GITHUB_REPO}/issues`}>View Open Issues</ActionLink>
            <ActionLink href={CONTRIBUTING_GUIDE}>Contribution Guide</ActionLink>
          </div>
        </section>
      </main>
    </Layout>
  );
}
