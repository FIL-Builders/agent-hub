import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const features = [
    {
      title: 'Connect AgentHub Through MCP',
      description: 'Learn how to list packs, fetch exact versions, and give agents runtime access to the right spec instead of pasting prompt blobs.',
      link: '/tutorials/use-agent-hub-through-mcp',
    },
    {
      title: 'Explore Agent Specs',
      description: 'Browse the versioned AgentHub catalogue and find the exact framework or API pack your agent needs.',
      link: '/agents/',
    },
    {
      title: 'See MCP Results',
      description: 'Read the React comparison showing how AgentHub MCP beat direct-file, no-pack, and inline-pack delivery.',
      link: '/blog/0005-why-agenthub-mcp-won-react-context-test',
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
            Agent Hub packages versioned agent specs, MCP delivery, tutorials, and proof-backed
            evaluations so models can fetch the right context at the moment they need it.
          </p>
        </div>
      </header>
      <main className="container agenthub-home-main">
        <div className="home-features">
          {features.map((feature) => (
            <div key={feature.title} className="ai-card agenthub-feature-card cg-glass-panel cg-industrial-border">
              <p className="agenthub-feature-card__label">Surface</p>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <Link className="button button--primary button--sm" to={feature.link}>
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
