import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const features = [
    {
      title: 'Comprehensive Agents',
      description: 'Browse an extensive catalogue of smart agents ready to integrate into your workflows.',
      link: '/agents/',
    },
    {
      title: 'Step-By-Step Tutorials',
      description: 'Follow concise tutorials that guide you through agent setup and usage.',
      link: '/tutorials/getting-started-loading-your-first-agent-file',
    },
    {
      title: 'Insights & Updates',
      description: 'Read the blog for evaluations, release notes, and context-delivery experiments.',
      link: '/blog',
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
            <Link className="button button--secondary" to="/tutorials/getting-started-loading-your-first-agent-file">
              Tutorial
            </Link>
          </div>
        </div>
        <div className="agenthub-home-panel cg-glass-panel cg-industrial-border-accent">
          <p className="agenthub-home-panel__label">System Overview</p>
          <p className="agenthub-home-panel__copy">
            Agent Hub packages versioned agent specs, MCP delivery, tutorials, and evaluation flows
            into one place so models can pull the right context at the right time.
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
