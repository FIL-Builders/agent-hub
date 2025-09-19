import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { buildPrompt } from '@site/src/utils/prompt';

export default function LoopsHackerHouseWinKit() {
  // No inline YAML preview; link cards route to the spec viewer

  // Organize agent specs into prize-track sections (project → agents/<project>/0.3.0.yaml)
  const sections = [
    {
      id: 'win-kit',
      title: 'Win Kit',
      items: [
        { title: 'Win Kit (Master Pack)', project: 'loops-hacker-house-win-kit', highlight: true, blurb: 'Curated expert pack to ship a production‑ready MVP fast across all prize tracks.' },
      ],
    },
    {
      id: 'near',
      title: 'NEAR',
      items: [
        { title: 'NEAR Intents (1Click + Explorer)', project: 'near-intents-1click-and-explorer', blurb: 'Quote, deposit, and status flows for Intent-based swaps.' },
        { title: 'NEAR AI Environment', project: 'near-ai-environment', blurb: 'Agent runtime components and helpers to orchestrate NEAR workloads.' },
        { title: 'NEAR Twitter Contract (rs)', project: 'near-twitter-contract-rs', blurb: 'Example social contract for quick user-facing demos.' },
      ],
    },
    {
      id: 'openserv',
      title: 'OpenServ AI',
      items: [
        { title: 'OpenServ Labs SDK', project: 'openserv-labs-sdk', blurb: 'Agentic orchestration to ship an MVP in hours.' },
      ],
    },
    {
      id: 'randamu',
      title: 'Randamu',
      items: [
        { title: 'Randamu dCipher SDK', project: 'randamu-dcipher-sdk', blurb: 'VRF, Blocklock encryption, and OnlySwaps primitives.' },
        { title: 'Blocklock (Encryption)', project: 'blocklock', blurb: 'Time-/height-locked encryption with decrypt workflows.' },
      ],
    },
    {
      id: 'golem',
      title: 'Golem DB',
      items: [
        { title: 'Golem Base JSON-RPC (DB‑Chain)', project: 'golem-base-json-rpc', blurb: 'L2 decentralized data primitives over familiar JSON‑RPC.' },
      ],
    },
    {
      id: 'filecoin',
      title: 'Filecoin',
      items: [
        { title: 'Filecoin Synapse SDK', project: 'filecoin-synapse-sdk', blurb: 'Decentralized storage and data layer integrations.' },
        { title: 'Filecoin FS Upload DApp', project: 'filecoin-fs-upload-dapp', blurb: 'Reference upload flow and patterns for user data.' },
        { title: 'Filecoin (Core)', project: 'filecoin', blurb: 'Core Filecoin agent primitives and references.' },
      ],
    },
  ];

  // Schema card removed per request

  const renderAgentCard = ({ title, project, blurb, highlight }) => {
    const yamlFile = '0.3.0.yaml';
    const specUrl = `/agents/spec?project=${encodeURIComponent(project)}&file=${encodeURIComponent(yamlFile)}`;
    const rawUrl = `https://raw.githubusercontent.com/FIL-Builders/agent-hub/refs/heads/main/agents/${project}/${yamlFile}`;
    const prompt = buildPrompt(rawUrl);
    return (
      <div key={project} className="ai-card" style={highlight ? { borderColor: 'var(--ifm-color-primary)', boxShadow: '0 8px 24px rgba(249, 115, 22, 0.15)' } : undefined}>
        <h3 style={{ marginBottom: '0.25rem' }}>{title}</h3>
        <p style={{ marginTop: 0 }}>{blurb}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="button button--primary button--sm" to={specUrl}>View Spec</Link>
          <a className="button button--secondary button--sm" href={rawUrl} download>Download</a>
          <a className="button button--secondary button--sm" href={`https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`} target="_blank" rel="noopener noreferrer">Open in ChatGPT</a>
          <a className="button button--secondary button--sm" href={`https://claude.ai/new?q=${encodeURIComponent(prompt)}`} target="_blank" rel="noopener noreferrer">Open in Claude</a>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <code>{`agents/${project}/${yamlFile}`}</code>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Loops Hacker House – Win Kit" description="Curated agent specs and strategies to win the Loops Hacker House across NEAR, OpenServ, Randamu, Golem DB, and Filecoin tracks.">
      <main className="container" style={{ padding: '2rem 0' }}>
        <header className="ai-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0, color: 'var(--ifm-color-primary)' }}>Loops Hacker House – Win Kit</h1>
          <p style={{ marginTop: '0.5rem' }}>
            This page is a curated starting point for teams at the Loops Hacker House. It brings together the
            exact YAML agent specs and reference flows you need to integrate the five prize‑track protocols quickly—
            without yak‑shaving. The intent is to help you ship a small but production‑sane MVP: clear onboarding,
            minimal UI, verifiable on‑chain actions, and telemetry you can show during the demo.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Use the Win Kit to pick a lane, then open the track‑specific specs below to wire in core flows in hours,
            not days. Start with one track, add a second only if it deepens product‑market fit. Focus on reliability,
            crisp UX, and a believable path to production.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <Link className="button button--primary" to="#win-kit">Open the Win Kit</Link>
            <Link className="button button--secondary" to="#judging">Judging & Prize Tracks</Link>
          </div>
        </header>

        <section id="judging" style={{ marginTop: '1rem' }}>
          <div className="ai-card">
            <h2 style={{ marginTop: 0, color: 'var(--ifm-color-primary)' }}>Judging & Prize Tracks</h2>
            <p style={{ marginTop: '0.25rem', marginBottom: '0.75rem' }}>Total prize pool: $13,000 across five tracks.</p>
            <h3 style={{ marginTop: 0 }}>Prizes</h3>
            <div className="ai-grid" style={{ marginTop: '0.5rem' }}>
              <div className="ai-card">
                <h4 style={{ margin: 0 }}>NEAR ($3,000)</h4>
                <p>Build on NEAR Intents and NEAR Shade Agents; consumer UX with intent‑based architecture.</p>
                <Link className="button button--secondary button--sm" to="#near">View NEAR specs</Link>
              </div>
              <div className="ai-card">
                <h4 style={{ margin: 0 }}>OpenServ AI ($3,000)</h4>
                <p>Live integration sprint; orchestrate your MVP with OpenServ to ship fast.</p>
                <Link className="button button--secondary button--sm" to="#openserv">View OpenServ specs</Link>
              </div>
              <div className="ai-card">
                <h4 style={{ margin: 0 }}>Randamu ($3,000)</h4>
                <p>Use VRF, Blocklock Encryption, OnlySwaps; provable randomness, secure data, seamless swaps.</p>
                <Link className="button button--secondary button--sm" to="#randamu">View Randamu specs</Link>
              </div>
              <div className="ai-card">
                <h4 style={{ margin: 0 }}>Golem DB ($3,000)</h4>
                <p>DB‑Chain L2 for decentralized data; social, gaming infra, analytics, or Web2→Web3 ports.</p>
                <Link className="button button--secondary button--sm" to="#golem">View Golem specs</Link>
              </div>
              <div className="ai-card">
                <h4 style={{ margin: 0 }}>Filecoin ($1,000)</h4>
                <p>Integrate the Filecoin Synapse SDK for decentralized storage/data layers.</p>
                <Link className="button button--secondary button--sm" to="#filecoin">View Filecoin specs</Link>
              </div>
            </div>
            <p style={{ marginTop: '0.75rem' }}>
              What tends to win: a tight scope with obvious user value, a clean and reliable demo,
              and a credible path to production. Show how new users get started, surface progress and
              errors clearly, log on‑chain references, and include light documentation so judges can
              see this becoming a real product beyond the hackathon.
            </p>
          </div>
        </section>

        <section id="agents" style={{ marginTop: '1.5rem' }}>
          <h2 style={{ color: 'var(--ifm-color-primary)' }}>Agent Specs (Quick Links)</h2>
          {sections.map((sec) => (
            <div key={sec.id} id={sec.id} style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{sec.title}</h3>
              <div className="ai-grid">
                {sec.items.map(renderAgentCard)}
              </div>
            </div>
          ))}
        </section>

        {/* Prompt summary and inline preview removed per request */}
      </main>
    </Layout>
  );
}
