import React from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';


// Use require.context to get all YAML files recursively in static/agents
const req = require.context(
  '../../../../agents', // path relative to this file
  true,
  /\.yaml$/
);

const agentSpecs = req.keys().map((filePath) => {
  // filePath like './react/0.1.0.yaml'
  const m = filePath.match(/^\.\/([^/]+)\/(.+\.yaml)$/);
  if (!m) return null;
  const project = m[1];
  const file = m[2];
  return {
    project,
    file,
    path: `/agents/${project}/${file}`,
    raw: req(filePath).default,
  };
}).filter(Boolean);

export default function AgentsIndex() {
  const grouped = agentSpecs.reduce((acc, spec) => {
    (acc[spec.project] = acc[spec.project] || []).push(spec);
    return acc;
  }, {});

  return (
<Layout title="Agent Specs" description="All registered agent specs in YAML.">

    <main className="container margin-vert--lg">
      <h1>All AgentHub YAML Specs</h1>
      {Object.entries(grouped).map(([project, specs]) => (
        <section key={project} style={{ marginBottom: 32 }}>
          <h2>{project}</h2>
          {specs.map((spec) => (
            <div key={spec.file} style={{ marginBottom: 24 }}>
              <a href={spec.path} download>
                Download {spec.file}
              </a>
              <details style={{ marginTop: 8 }}>
                <summary>Preview: {spec.file}</summary>
                <CodeBlock language="yaml" showLineNumbers>
                  {spec.raw}
                </CodeBlock>
              </details>
            </div>
          ))}
        </section>
      ))}
    </main>
	      </Layout>

  );
}

