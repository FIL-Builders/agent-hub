import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import AIAgentOnboardingPrompt from '@site/src/components/AIAgentOnboardingPrompt';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const features = [
    {
      label: 'Onboarding',
      title: 'AI Agent Onboarding',
      description: 'Start here if you want the fastest way to use Agent Hub inside your AI coding workflow. Copy one prompt and your agent will either connect Agent Hub for you or give you the exact setup steps to finish it manually.',
      onboarding: true,
    },
    {
      label: 'Tutorial/MCP',
      title: 'Use The MCP Tutorial',
      description: 'Use this guide to connect Agent Hub over MCP, verify live retrieval from the deployed server, and understand when runtime fetch is a better fit than installing a local Claude-compatible skill.',
      link: '/tutorials/use-agent-hub-through-mcp',
      cta: 'Read Tutorial',
    },
    {
      label: 'BLOG/PROOF',
      title: 'Agent Hub Example: Improved React Debugging Results',
      description: [
        'We gave AI coding agents the same hard React debugging task and compared runs with Agent Hub against runs without it.',
        'The Agent Hub run produced the strongest overall result, showing that better context can improve both code quality and reasoning on the same problem.',
      ],
      link: '/blog/0005-why-agenthub-mcp-won-react-context-test',
      cta: 'Read Results',
    },
  ];

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className="agenthub-home-hero">
        <div className="agenthub-home-hero__inner cg-glass-panel cg-industrial-border">
          <p className="agenthub-home-kicker">Versioned Context for AI Coding Agents</p>
          <h1 className="agenthub-home-title">{siteConfig.title}</h1>
          <p className="agenthub-home-tagline">{siteConfig.tagline}</p>
          <div className="agenthub-home-actions">
            <Link className="button button--primary" to="/agents/">
              Browse Agent Packs
            </Link>
          </div>
        </div>
        <div className="agenthub-home-panel cg-glass-panel cg-industrial-border">
          <p className="agenthub-home-panel__label">System Overview</p>
          <p className="agenthub-home-panel__copy">
            Agent Hub helps AI coding agents use the right expert guidance in the right form:
            canonical packs for source truth, Claude-compatible skills for local installation,
            and MCP retrieval when runtime fetch is the better fit. That means more accurate
            answers, cleaner context, and results that are easier to repeat.
          </p>
        </div>
      </header>
      <main className="container agenthub-home-main">
        <div className="home-features">
          {features.map((feature) => (
            <div key={feature.title} className="ai-card agenthub-feature-card cg-glass-panel cg-industrial-border cg-industrial-border-accent">
              <p className="agenthub-feature-card__label">{feature.label}</p>
              <h3>{feature.title}</h3>
              {Array.isArray(feature.description) ? (
                feature.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p>{feature.description}</p>
              )}
              {feature.onboarding && <AIAgentOnboardingPrompt compact buttonLabel="Copy Prompt" />}
              {feature.link && (
                <Link className="button button--secondary button--sm agenthub-feature-card__cta" to={feature.link}>
                  {feature.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="agenthub-mcp-endpoint-panel cg-glass-panel cg-industrial-border">
          <div className="agenthub-mcp-endpoint-panel__body">
            <div className="agenthub-mcp-endpoint-panel__content">
              <p className="agenthub-feature-card__label">MCP Server</p>
              <h3 className="agenthub-mcp-endpoint-panel__title">Agent Hub MCP Endpoint</h3>
              <p className="agenthub-mcp-endpoint-panel__copy">
                Use the deployed MCP endpoint if you want to connect Agent Hub directly in your
                client or test the server yourself. It is the fastest path for manual setup,
                debugging, and quick verification.
              </p>
            </div>
            <pre className="agenthub-mcp-endpoint-panel__endpoint">
              https://agent-hub-1.netlify.app/mcp
            </pre>
          </div>
        </div>
      </main>
    </Layout>
  );
}
