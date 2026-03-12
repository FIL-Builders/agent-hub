# First Steps: Contributing a New Agent to AgentHub

---

AgentHub thrives on new contributors and fresh perspectives. Whether you want to add support for a new API, share hard-won best practices for a tool you love, or help others avoid common pitfalls, your contribution makes the community—and every LLM agent—stronger.

This guide will walk you through your **first AgentHub contribution**, with clear steps and helpful advice at every stage. (No screenshots, just actionable info!)

---

## **1. Fork and Clone the Repository**

Start by forking the [AgentHub repo](https://github.com/FIL-Builders/agent-hub) to your own GitHub account.
Clone your fork locally so you can work with files and version control.

```bash
git clone https://github.com/<your-username>/agent-hub.git
cd agent-hub
```

---

## **2. Pick a Tool or API**

Look through the `/agents/` directory. If the tool or API you want to cover isn’t there, you’re in the right place!
You can open an issue to “claim” your agent idea, but this is optional.

---

## **3. Study the Spec and Example Agents**

* **Open Agent Spec:** Read `/spec/open-agent-spec-v0.3.0.yaml` (or check [the latest on GitHub](https://github.com/FIL-Builders/agent-hub/blob/main/README.md)) to understand the required fields and structure.
* **Review Examples:** Look at existing agents in `/agents/<tool>/`—they set the bar for clarity, depth, and reasoning.

---

## **4. Write Your Agent Markdown File**

* Create a new folder in `/agents/` named after your tool, e.g.,

  ```
  agents/my-awesome-api/
  ```
* Add your Markdown file, following the spec (name it after the version, e.g., `0.3.0.md`).
* The Markdown file should use YAML frontmatter for the `meta` block and then capture:

  * **Best practices**
  * **Pitfalls and “gotchas”**
  * **Key patterns, example requests, and expert logic**
  * Anything an LLM would need to reliably use the tool

---

## **5. Add DESIGN\_NOTES.md**

Every agent comes with a short `DESIGN_NOTES.md`.
Here’s a template to get you started:

```markdown
# DESIGN NOTES: <Tool Name> Agent
* **Goal / Scope:** What problem does this agent solve?
* **Key Prompts & Reasoning:** Outline major prompt snippets and why they work.
* **Edge‑case Handling:** How does the agent avoid common pitfalls?
* **References:** Docs, blog posts, or code samples you consulted.
```

This is where you explain *why* you made certain choices and how future maintainers or contributors should think about evolving the agent.

---

## **6. Open a Pull Request (PR)**

* Commit your changes and push to your fork.
* Go to the main AgentHub repo and open a Pull Request from your branch.
* In the PR description:

  * Link to any related issues (if you opened one)
  * Paste a sample “agent in action” prompt if you have one
  * Mention anything you’d like feedback on

You can open a **draft PR** if you’re still working—early feedback is encouraged!

---

## **7. Collaborate and Iterate**

* The AgentHub team aims for a review turnaround of **≤12 hours** during launch week, and &lt;24 hours after that.
* Feedback is friendly, specific, and transparent.
* Expect suggestions, discussion, and (often) a bit of collaborative iteration before merging.

---

## **8. Celebrate Your Contribution!**

* Once your PR is merged, add yourself to the `all-contributors` list—you’re part of AgentHub history.
* You may be invited as a code owner for your agent or tool area as you continue to contribute.
* Every agent helps shape the quality and reach of the entire ecosystem.

---

## **Quick Tips for First-Time Contributors**

* **Iterate openly:** Your first draft doesn’t have to be perfect—collaboration is the heart of AgentHub.
* **Be transparent:** Document your reasoning and references in `DESIGN_NOTES.md`.
* **Ask questions:** Open a GitHub Discussion, join Discord, or comment in your PR. The community is here to help.
* **Be respectful:** See the [Code of Conduct](https://github.com/FIL-Builders/agent-hub/blob/main/CODE_OF_CONDUCT.md) for our commitment to a welcoming environment.

---

## **Ready to Start?**

* **Fork the repo**
* **Write or adapt an agent**
* **Open your first PR**
* **Join the conversation**

Happy agent-crafting! 🌱

---

*Questions or feedback? Visit [GitHub Discussions](https://github.com/FIL-Builders/agent-hub/discussions) or join the next office hours!*

---

Let me know if you want an even more granular step-by-step, a checklist, or FAQ—happy to keep building out resources!
