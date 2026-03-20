---
hide_table_of_contents: true
---

# Getting Started: Loading Your First Agent Pack

---

Welcome to AgentHub! In this quick tutorial, you’ll learn how to **find, load, and benefit from your first AgentHub pack**—all in just a few minutes. No plugins, no custom tools—just copy, paste, and give your LLM sessions better guidance.

---

## **Step 1: Browse the AgentHub Registry**

Go to the [AgentHub packs directory](https://github.com/FIL-Builders/agent-hub/tree/main/agents) on GitHub.

* Packs are organized by tool or API (for example, `react` or `github-api`).
* Click on a tool you want to work with.

---

## **Step 2: Open and Copy the Canonical Markdown Pack**

* Inside each tool’s folder, you’ll find a versioned Markdown file (for example, `0.4.0.md`).
* Click on the Markdown file to view its contents.
* **Copy the full contents** to your clipboard.

---

## **Step 3: Load the Pack Into Your LLM**

How you do this depends on your LLM stack:

* **ChatGPT, Claude, Perplexity, etc.:**

  * Start a new chat.
  * Paste the canonical Markdown pack as your first message or system prompt.
  * Continue with your development questions and requests.

* **Ollama, LM Studio, LocalAI, etc.:**

  * Use the “system prompt” or “context” field in your interface.
  * Paste the canonical Markdown pack before your instructions.

* **Custom LLM/agentic tools:**

  * Supply the pack as part of your context window or prompt assembly step.

---

## **Step 4: Start Your Session!**

With the pack loaded, your LLM will now:

* Apply best practices for the tool or API
* Avoid common pitfalls and anti-patterns
* Produce code, explanations, or integrations that reflect real community expertise

**Example Prompt:**

```
(system prompt): [paste canonical Markdown pack here]
(user prompt): Generate a React component for a signup form with email validation.
```

---

## **Pro Tips**

* **Stack packs:** You can load multiple packs if you’re using more than one tool (e.g., React + Redux).
* **Customize:** Feel free to edit or annotate the Markdown pack for your specific needs.
* **Check for updates:** The [AgentHub registry](https://github.com/FIL-Builders/agent-hub/tree/main/agents) is growing—come back for new and improved packs.

---

## **FAQ**

**Q: Do I need any special software?**
A: No! If your LLM supports “system prompts” or context injection, you’re good to go.

**Q: Will this work with proprietary models as well as open-source?**
A: Yes—any LLM that can accept pasted instructions or context can benefit from AgentHub files.

**Q: How do I know what’s in the Markdown file?**
A: Each file is human-readable and reviewed. Read the comments, rationale, and best practices inside!

**Q: What if I find a mistake or want to improve a pack?**
A: [Contribute back via Pull Request](https://github.com/FIL-Builders/agent-hub/blob/main/CONTRIBUTING.md)—community improvements are welcome!

---

## **Next Steps**

* Try your first pack now!
* Browse for packs covering other tools or APIs you use.
* Want to help others? Write or improve a pack for your favorite stack.

---

**AgentHub makes every LLM session smarter. Welcome aboard, and happy pack-crafting! 🌱**
