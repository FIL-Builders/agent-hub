# Better Context, Better Fixes: Why AgentHub MCP Won a Real React Test

*Same task, four delivery modes, one clear winner.*

---

When people talk about AI coding tools, the conversation usually centers on the model:
Which model is smartest? Which one writes the cleanest code? Which one reasons best?

That matters. But there is another variable that gets less attention and has real practical impact:
**how the model receives context**.

At AgentHub, that question matters because we are not just building a registry of expert packs for APIs and frameworks. We are also building the tooling layer that delivers those packs to models in a structured, usable way.

So we ran a practical test on a realistic React problem:

> A React 18 page renders 5,000 searchable rows with row selection. Typing is laggy, rows rerender too often, and the selected row appears to reset after filtering.

We asked agents to diagnose the root causes, propose a production-sane fix, include complete code, and explain when to use `useDeferredValue`, `useTransition`, `memo`, and stable props.

Then we compared **four different context delivery modes**.

---

## **The Four-Way Comparison**

We kept the task and answer constraints constant, and only changed how React context was delivered:

* **A / MCP** — The agent used the AgentHub MCP server to retrieve React pack context.
* **B / Direct File** — The agent read the local `react/0.4.0.md` file directly.
* **C / No Pack** — The agent answered without AgentHub context.
* **D / Inline Pack** — The React pack was pasted directly into the prompt.

This is the kind of comparison that matters in the real world.
Not “can a model define `useMemo`?” but:

* does it diagnose the right problem?
* does it pick the right React 18 primitives?
* does it write code you would actually ship?
* does the delivery method change the answer quality?

---

## **The Results**

Here is the final ranking from the latest run:

| Candidate | Delivery Mode | Total /60 | Score /10 | Rank |
|-----------|---------------|-----------|-----------|------|
| **A** | **AgentHub MCP** | **59** | **9.8** | **1** |
| **B** | **Direct file** | **57** | **9.5** | **2** |
| **C** | **No pack** | **54** | **9.0** | **3** |
| **D** | **Inline pack** | **53** | **8.8** | **4** |

The reviewer’s scoring rubric covered:

* root-cause diagnosis
* API choice
* tradeoffs and caveats
* code quality
* completeness
* senior-level practicality

And the top line is straightforward:

> **In this React comparison, AgentHub MCP finished first: `59/60`, `9.8`, rank `#1`.**

This was not a toy prompt, and the difference was not cosmetic. The best answer was better because it:

* separated urgent input updates from expensive list work more cleanly
* diagnosed the identity bug behind the selection issue
* paired `useDeferredValue`, `useMemo`, `memo`, and stable props in a more coherent way
* delivered more complete, production-sane code

---

## **What Actually Improved**

The most important result is not the number itself. It is what changed in practice.

The MCP-backed answer was strongest where real engineering answers usually break:

* It diagnosed the problem as **three separate issues**, not one vague “performance problem.”
* It clearly distinguished **urgent input updates** from **non-urgent derived rendering work**.
* It treated the selection bug as an **identity problem**, not just a rendering glitch.
* It explained why `useDeferredValue` was the right first move here, and why `useTransition` was not the right tool for the controlled input itself.
* It produced the most complete implementation without bloating into a generic performance essay.

That is what better context delivery should do: not make the answer longer, make it sharper.

---

## **Why MCP Likely Helped**

We want to be careful here: this is a strong signal, not a universal law.

But the result fits a pattern we care about deeply at AgentHub:

**the strongest outcome did not come from the most raw context. It came from the best-delivered context.**

In this run:

* **MCP beat direct file access**
* **direct file access beat no pack**
* **inline pack came in last**

That last point is especially interesting. A lot of people assume that pasting more context directly into the prompt is the safest option. In this case, it was not. The inline-pack answer was still good, but it was the weakest of the four. The reviewer specifically called out unnecessary implementation noise and less disciplined code despite strong conceptual explanations.

That suggests something important:

> **Context delivery is not just plumbing. It is part of the product.**

MCP appears to help because it gives the model a cleaner retrieval path:

* less friction than raw file handling
* less cognitive overload than a giant inline blob
* better structure than “just answer from memory”

For developers building AI tooling, that is a useful takeaway.

---

## **Why This Matters for AgentHub**

AgentHub is often described as a registry of expert packs. That is true, but it is incomplete.

The packs matter. The spec matters. The peer review matters. But the **delivery mechanism** matters too.

If the same React pack produces a better answer through MCP than through a raw inline prompt, then the tooling is part of the quality story. That is good news for AgentHub, because it means the project is not just curating better content. It is also creating a better path from content to output.

For teams building:

* internal coding assistants
* agent workbenches
* AI-native IDE experiences
* API support copilots

the practical lesson is simple:

**invest in context delivery, not just context collection.**

Better answers do not come only from “having documentation.”
They come from giving models the right documentation in the right shape at the right moment.

---

## **What We Are Not Claiming**

A result like this is exciting, but we want to stay disciplined about it.

This post does **not** claim:

* MCP is always the best delivery mode for every task
* that one run is enough to prove a universal rule
* inline context is always bad
* React performance work can be reduced to one canned pattern

What we are saying is narrower:

* this was a realistic engineering task
* the task was held constant
* the delivery mode changed
* AgentHub MCP produced the best result in this comparison

That is a meaningful product signal.

---

## **The Big Takeaway**

This React benchmark reinforced something we believe strongly:

> **Better context delivery produces better engineering work.**

In this test, AgentHub MCP did not just look cleaner architecturally.
It produced the top-ranked answer on a real React problem, outperforming direct-file, no-pack, and inline-pack alternatives.

That is the kind of result we care about at AgentHub: not abstract elegance, not benchmark theater, but measurable improvement on work developers actually do.

If you are building agent tooling, coding copilots, or internal AI systems, you should treat context delivery as a first-class product decision.

If you want a concrete place to start, AgentHub now gives you both:

* the expert packs
* the MCP tooling to deliver them well

---

*The strongest result did not come from more raw context. It came from better-delivered context.*
