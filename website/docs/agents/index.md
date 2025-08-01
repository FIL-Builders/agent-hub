import React from 'react';
import CodeBlock from '@theme/CodeBlock';

// ---
// Use require.context to get all yaml files in static/agents recursively
const req = require.context(
  '../../../static/agents', // relative to /website/src/pages/agents/
  true, // recursive
  /\.yaml$/
);

// Build an array of {project, file, path, raw}
const agentSpecs = req.keys().map((filePath) => {
  // filePath example: './react/0.1.0.yaml'
console.log(filePath)
  const matches = filePath.match(/.yaml/);
  if (!matches) return null;
  const project = matches[1];
  const file = matches[2];
  return {
    project,
    file,
    path: `/agents/${project}/${file}`,
    raw: req(filePath).default,
  };
}).filter(Boolean);

export default function AgentsIndex() {
  // Optional: group by project
  const grouped = agentSpecs.reduce((acc, spec) => {
    (acc[spec.project] = acc[spec.project] || []).push(spec);
    return acc;
  }, {});

  return (
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
  );
}


