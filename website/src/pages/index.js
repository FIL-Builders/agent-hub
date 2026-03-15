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
      description: 'Copy one setup prompt that tells your AI agent what Agent Hub MCP is, connects it if possible, and falls back to exact manual steps when it cannot edit the config itself.',
      onboarding: true,
    },
    {
      label: 'Tutorial',
      title: 'Use The MCP Tutorial',
      description: 'Connect Agent Hub to any MCP-aware client with direct HTTP or mcp-remote, then verify the setup by listing tools, checking React versions, and fetching a live pack from the deployed server.',
      link: '/tutorials/use-agent-hub-through-mcp',
      cta: 'Read Tutorial',
    },
    {
      label: 'Proof',
      title: 'See MCP Results',
      description: 'Agent Hub MCP produced the top React result in our four-way test, beating direct file access, no pack, and an inline prompt. The comparison matters because it isolates delivery mode, not just model quality.',
      link: '/blog/0005-why-agenthub-mcp-won-react-context-test',
      cta: 'Read Results',
    },
  ];

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className="agenthub-home-hero">
        <div className="agenthub-home-hero__inner cg-glass-panel cg-industrial-border">
          <p className="agenthub-home-kicker">Agent-Native Context Delivery</p>
          <h1 className="agenthub-home-title">{siteConfig.title}</h1>
          <p className="agenthub-home-tagline">{siteConfig.tagline}</p>
          <div className="agenthub-home-actions">
            <Link className="button button--primary" to="/agents/">
              View Agents
            </Link>
          </div>
        </div>
        <div className="agenthub-home-panel cg-glass-panel cg-industrial-border">
          <p className="agenthub-home-panel__label">System Overview</p>
          <p className="agenthub-home-panel__copy">
            Agent Hub gives agents versioned specs, MCP delivery, tutorials, and measured
            evaluations so they can pull the right context when the task actually needs it.
          </p>
        </div>
      </header>
      <main className="container agenthub-home-main">
        <div className="home-features">
          {features.map((feature) => (
            <div key={feature.title} className="ai-card agenthub-feature-card cg-glass-panel cg-industrial-border cg-industrial-border-accent">
              <p className="agenthub-feature-card__label">{feature.label}</p>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
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
                Prefer direct setup? Use the deployed MCP server URL below for manual
                configuration, debugging, or quick client verification.
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
