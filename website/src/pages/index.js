import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const features = [
    {
      title: 'Connect Agent Hub MCP',
      description: 'Use the deployed Agent Hub MCP server to list packs, inspect versions, and fetch the exact spec your agent needs at runtime.',
      endpoint: 'https://agent-hub-1.netlify.app/mcp',
      link: '/tutorials/use-agent-hub-through-mcp',
      cta: 'Use MCP',
    },
    {
      title: 'Explore Agent Specs',
      description: 'Browse the Agent Hub catalog and find versioned packs for the frameworks, APIs, and tools your agents work with.',
      link: '/agents/',
      cta: 'Browse Specs',
    },
    {
      title: 'See MCP Results',
      description: 'See how Agent Hub MCP performed in a real React comparison against direct-file, no-pack, and inline-pack context delivery.',
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
              <p className="agenthub-feature-card__label">Surface</p>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.endpoint && <pre className="agenthub-feature-card__endpoint">{feature.endpoint}</pre>}
              <Link className="button button--secondary button--sm" to={feature.link}>
                {feature.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
