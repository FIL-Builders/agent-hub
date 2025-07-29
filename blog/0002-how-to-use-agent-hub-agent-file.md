# How to Use an AgentHub Agent File With Your Local LLM Stack

*Unlock expert-level LLM coding sessions in three simple steps.*

---

If you’re exploring large language models (LLMs) for software development, you know the promise: write, test, and refactor code in seconds. But getting *great* results—especially with real-world frameworks and APIs—can be hit or miss.

**AgentHub changes that.** With a curated agent file, your LLM is seeded with community wisdom, not just surface-level docs. This tutorial will show you the absolute fastest way to upgrade your LLM coding experience—using the [React agent](https://github.com/FIL-Builders/agent-hub/tree/main/agents/react)—with any local or hosted LLM setup.

---

## **What You’ll Need**

* **An LLM environment:** This could be OpenAI ChatGPT, Claude, LM Studio, Ollama, or any local stack that supports “context” or “system prompt” injection.
* **The AgentHub registry:** [Browse the latest agent files here.](https://github.com/FIL-Builders/agent-hub/tree/main/agents)
* **Your development goal:** What do you want your LLM to do (e.g., write a React component, interact with a REST API, etc.)?

---

## **Step 1: Find the Right Agent File**

AgentHub is organized by tool and API.
For React, simply go to:

```
https://github.com/FIL-Builders/agent-hub/tree/main/agents/react
```

You’ll see one or more `.yaml` files.

---

## **Step 2: Copy the Agent File’s Contents**

Click into the `react.yaml` file.
Copy the entire YAML contents to your clipboard.

> **Tip:** The agent file is readable—skim it for gotchas, expert tips, and important context!

---

## **Step 3: Paste the Agent Into Your LLM’s Context**

Every LLM interface is different, but the workflow is the same:

* **ChatGPT, Claude, or Web UI:**

  * Paste the agent YAML as a “system prompt” or at the top of your first message.
  * Then, start your coding conversation as usual.
* **Ollama, LM Studio, or LocalAI:**

  * Use the context injection or system prompt feature in your tool (check docs).
  * Paste the YAML agent before any user instructions.
* **Custom LLM Agents:**

  * If you’re building with frameworks like OpenDevin, Agent-LLM, or Autogen, load the agent YAML into your prompt builder or context window before running code tasks.

**Example:**

```
SYSTEM:
(paste agenthub/agents/react/react.yaml here)

USER:
Write a React component for a login form with validation and a “forgot password” link.
```

---

## **What Happens Next?**

The LLM will “see” and internalize the expert strategies, common mistakes, and recommended patterns encoded in the agent file.

* **Generated code** will be more robust and idiomatic.
* **Edge cases and pitfalls** (like prop handling, hooks misuse, or state leaks) will be avoided.
* **Testing, refactoring, and doc generation** will follow best practices by default.

You just gave your LLM a senior developer’s guidance—for free.

---

## **Can I Do More?**

Yes!

* **Stack agent files:** You can paste in several (for example, React *and* Redux, or GitHub API and Jest testing).
* **Edit/extend:** Tailor the YAML to your project quirks—add extra “dos and don’ts” as your team learns.
* **Contribute back:** If you improve an agent file, [open a Pull Request](https://github.com/FIL-Builders/agent-hub/blob/main/CONTRIBUTING.md) so the community benefits.

---

## **FAQ**

**Q: Do I need a plugin or parser to use AgentHub files?**
A: No. Any LLM that can read context/system prompts can use AgentHub files directly.

**Q: Is this only for coding?**
A: No! You can use agent files for API calls, workflow orchestration, documentation, and more—any task where expertise helps.

**Q: How do I know the file is up to date?**
A: Each agent file is peer-reviewed and versioned. Check the [agents directory](https://github.com/FIL-Builders/agent-hub/tree/main/agents) for updates.

---

## **Next Steps**

* Try it now: [Copy the React agent file](https://github.com/FIL-Builders/agent-hub/tree/main/agents/react) and drop it into your LLM session.
* Explore: Browse agents for other tools and APIs you use.
* Level up: [Contribute your own](https://github.com/FIL-Builders/agent-hub/blob/main/CONTRIBUTING.md) and become a founding member of the AgentHub community!

---

**Welcome to AgentHub—where every session is a step closer to expert-level LLMs. Happy agent-crafting! 🌱**

---

*Want more guides or a video walkthrough? Let us know in [GitHub Discussions](https://github.com/FIL-Builders/agent-hub/discussions)—we’re just getting started!*
