# Contributing to **AgentHub**

Welcome — whether you’re here to fix a typo or craft the next flagship agent file, we’re thrilled to build AgentHub with you! This guide explains **how to contribute via Pull Requests** and what you can expect from the maintainer team.

---

## Philosophy

> **“Collaboration over control, transparency over hype.”**

AgentHub is a community conversation‑space: every design choice, every line of an agent spec, every review comment is out in the open. We prize clear reasoning, shared ownership, and learning together more than big vanity numbers. If that resonates with you, you’re in the right place.

---

## Our PR‑based Workflow (30 s overview)

1. **Fork the repo** → make your change in a branch.  
2. **Open a Pull Request** early (Draft PRs welcome!).  
3. Automated CI will lint, validate the spec, and run a smoke test.  
4. A maintainer reviews; we aim to respond in **<12 h** during launch week.  
5. Iterate together until green ✓ — then **merge & celebrate**.  

First PR? Add yourself to the `all-contributors` list and we’ll happily credit you. 🎉

---

## How to Contribute an **Agent**

1. **Pick a Tool**  
   Find an API / SDK that doesn’t yet have an agent file in `/agents/`. Open an issue to claim it (optional but helps avoid double work).

2. **Read the Spec**  
   Follow **Open Agent Spec** in [`/spec/open-agent-spec-v0.3.0.yaml`](./spec/open-agent-spec-v0.3.0.yaml). All required fields must be present and correctly typed.

3. **Study the Founding Agents**  
   Browse `/agents/<tool>/` for examples of structure, tone, and depth. Aim for that quality bar (or higher!).

4. **Write Your Agent Markdown File**  
   Create a new folder:  
```

agents/<tool-name>/
├─ <version>.md
└─ DESIGN\_NOTES.md

```

   Use Markdown with YAML frontmatter containing the full `meta` block, followed by the remaining spec sections in the body. Minimal shape:

```md
---
meta:
  spec_name: my-awesome-api
  spec_version: "0.3.0"
  library_version: "^1.2.3"
  generated: "2026-03-12"
  purpose: >
    Briefly explain what this pack helps an LLM do.
  guiding_principles:
    - Prefer concrete, production-safe patterns.
    - Call out common failure modes early.
    - Keep examples runnable and minimal.
  design_notes: |
    Summarize key sources and structuring decisions.
---
groups:
  - name: core
    exports: [createClient]
    symbols:
      createClient:
        kind: function
        summary: Create the primary SDK client.
        definition:
          lang: typescript
          code: |
            function createClient(config: ClientConfig): Client;
        guidance:
          - Initialize once per process when possible.
        example:
          lang: javascript
          code: |
            import { createClient } from 'my-awesome-api';
            const client = createClient({ apiKey: process.env.API_KEY });
```

5. **Fill in `DESIGN_NOTES.md`**  
Use the template below to explain **why** you chose certain prompts, examples, and guardrails. Transparent rationale helps reviewers and future maintainers.

```markdown
# DESIGN NOTES: <Tool Name> Agent
* **Goal / Scope:** What problem does this agent solve?
* **Key Prompts & Reasoning:** Outline major prompt snippets and why they work.
* **Edge‑case Handling:** How does the agent avoid common pitfalls?
* **References:** Docs, blog posts, or code samples you consulted.
```

6. **Run CI Locally (optional)**

   ```bash
   npm run build   # MCP manifest + site build smoke check
   ```

   Your PR should run the same smoke build locally before submission.

7. **Open a Pull Request**
   In the PR description: link to any open issue, paste a sample “agent in action” snippet, and mention anything you’d like feedback on.

That’s it!

---

## What to Expect

* **Fast & Friendly Reviews**
  We target **< 12 hours** turnaround during the first launch week, and <24 hours thereafter. If we slip, please ping us politely.

* **Respectful Interaction**
  Feedback will be constructive and kind. We’ll explain “why,” not just “what.” See our [Code of Conduct](./CODE_OF_CONDUCT.md).

* **Iteration over Perfection**
  It’s okay if the first commit isn’t flawless. We’d rather iterate in the open than wait for hidden perfection.

* **Shared Ownership**
  Accepted contributors may be invited to `CODEOWNERS` for their agent—welcome to the maintainer circle!

---

## Need Help?

Open a **GitHub Discussion**, drop by our **Discord #contributors** channel, or join the next live office‑hours stream. No question is too small.

Happy agent‑crafting! ✨
