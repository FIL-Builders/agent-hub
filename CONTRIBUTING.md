# Contributing to **AgentHub**

Welcome — whether you’re here to fix a typo or craft the next flagship agent file, we’re thrilled to build AgentHub with you! This guide explains **how to contribute via Pull Requests** and what you can expect from the maintainer team.

---

## Philosophy

> **“Collaboration over control, transparency over hype.”**

AgentHub is a community conversation‑space: every design choice, every line of YAML, every review comment is out in the open. We prize clear reasoning, shared ownership, and learning together more than big vanity numbers. If that resonates with you, you’re in the right place.

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
   Follow **Open Agent Spec v0.1** (`/spec/open-agent-spec-v0.1.md`). All required fields must be present and correctly typed.

3. **Study the Founding Agents**  
   Browse `/agents/<tool>/` for examples of structure, tone, and depth. Aim for that quality bar (or higher!).

4. **Write Your Agent YAML**  
   Create a new folder:  
