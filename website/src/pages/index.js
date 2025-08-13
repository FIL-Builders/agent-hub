import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Custom home page for the Agent Hub site.  It replaces the default
 * template with a hero banner and a set of feature cards styled with
 * the AI Templates design system.  Buttons link users to tutorials,
 * the agent catalogue and the blog.
 */
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const features = [
    {
      title: 'Comprehensive Agents',
      description:
        'Browse an extensive catalogue of smart agents ready to integrate into your workflows.',
      link: '/agents/',
    },
    {
      title: 'Step‑By‑Step Tutorials',
      description:
        'Follow concise tutorials that guide you through agent setup and usage.',
      link: '/tutorials/getting-started-loading-your-first-agent-file',
    },
    {
      title: 'Insights & Updates',
      description:
        'Read our blog for news, updates and behind‑the‑scenes on agent development.',
      link: '/blog',
    },
  ];

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className="heroBanner" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'Courier New, monospace',
            color: 'var(--ifm-color-primary)',
            marginBottom: '0.5rem',
          }}
        >
          {siteConfig.title}
        </h1>
        <p
          style={{
            color: 'var(--ifm-color-content-secondary, #475569)',
            marginBottom: '2rem',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {siteConfig.tagline}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link className="button button--primary" to="/tutorials/getting-started-loading-your-first-agent-file">
            Get Started
          </Link>
          <Link className="button button--secondary" to="/agents/">
            View Agents
          </Link>
        </div>
      </header>
      <main className="container" style={{ padding: '2rem 0' }}>
        <div className="ai-grid">
          {features.map((feat) => (
            <div key={feat.title} className="ai-card">
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
              <Link
                className="button button--outline button--sm"
                style={{ marginTop: '0.5rem' }}
                to={feat.link}
              >
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
