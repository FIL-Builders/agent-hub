# A Better Signal Than a Benchmark: An Agent Chose AgentHub on Its Own

*A simple Scaffold-ETH planning task became a useful test of whether an AI agent knew when to reach for better context.*

---

One of the hardest parts of AI tooling is not just making context available. It is teaching agents **when to use it**.

That sounds small, but it is the difference between:

* an MCP server that sits there unused
* a context system that agents actually reach for at the right moment

At AgentHub, we have been working on both sides of that problem:

* building expert knowledge packs
* delivering them through MCP
* improving onboarding so agents can install AgentHub and keep a short persistent note about when to check it

That raised a natural question:

> If AgentHub is installed and available, will a capable agent actually decide to use it on its own?

We ran a small but meaningful test around `scaffold-eth-2`.

<!--truncate-->

---

## **The Question We Asked**

We gave an agent a normal planning request. We did **not** tell it to use AgentHub. We did **not** name any specific pack. We did **not** steer it toward MCP.

We asked:

```text
Share a concrete build plan for how you would build an app using Scaffold-ETH 2 in this environment. Use whatever local files, MCP tools, or other available context sources you judge appropriate. Do not edit files. Return:
1. A short note on what sources you chose to inspect
2. A step-by-step build plan
3. Any key assumptions or risks
Keep it concise and practical.
```

This matters because it is much closer to a real workflow than a contrived evaluation prompt.

The question was not:

* “Can you use AgentHub?”
* “Fetch the Scaffold-ETH pack.”
* “Use MCP before answering.”

The question was simply: **plan the work well**.

---

## **What We Wanted To Learn**

We were looking for one behavior in particular:

> Would the agent recognize that Scaffold-ETH 2 is a framework-specific workflow where AgentHub context would help, and choose that context without being told to?

That is a better product signal than a lot of headline benchmarks. Real agents do not live inside neat A/B test prompts all day. They operate in messy environments with many possible tools and sources available. If AgentHub only works when a human explicitly says “now use AgentHub,” then the product is still missing an important layer of intelligence.

What we want instead is a more natural behavior:

* the agent identifies that a task is framework-specific
* it decides that its built-in knowledge may not be the best primary source
* it retrieves the relevant pack just in time
* it uses that pack to produce a more grounded plan

That is the real test.

---

## **What The Agent Actually Did**

The agent independently chose these AgentHub files as its **primary planning sources**:

* `agents/scaffold-eth-2/0.4.0.md`
* `parse/scaffold-eth-2-docs-v0.4.0.md`

Only after that did it check the official Scaffold-ETH docs to confirm the bootstrap command and toolchain.

The agent did not treat AgentHub as optional decoration. It treated the local Scaffold-ETH pack as the best first source of truth for planning the work.

In other words:

> the agent autonomously selected AgentHub as its working context

---

## **Why This Was The Right Choice**

Scaffold-ETH 2 is not just “a Next.js dapp starter.”

It has its own workflow conventions, generated artifacts, debugging surfaces, and tool-specific abstractions. A generic Ethereum answer can sound plausible while still missing the parts that actually make Scaffold-ETH productive.

The agent’s plan reflected Scaffold-ETH-specific knowledge in a way that generic Web3 planning usually does not.

It correctly centered the standard three-terminal local loop:

* `yarn chain`
* `yarn deploy`
* `yarn start`

It treated `yarn deploy` as the thing that regenerates frontend contract metadata, rather than implying that generated files should be edited by hand.

It recommended Scaffold-ETH hooks instead of flattening everything into generic `wagmi` usage.

It kept network intent in the scaffold config layer instead of suggesting broad random changes across the frontend.

It called out `/debug` as the built-in operator surface for validating reads and writes before building custom UX.

It also preserved an important boundary:

* this pack was anchored to the Hardhat-flavor Scaffold-ETH workflow
* Foundry should be treated as a separate path, not silently mixed in

That is not just better phrasing. It is a better engineering plan for this framework.

---

## **The Plan It Produced**

The final plan was concise and practical. In substance, it said:

1. create the new app as a sibling Scaffold-ETH 2 workspace
2. use the default Hardhat flavor unless there is a clear reason not to
3. validate the local toolchain
4. start the standard three-process development loop
5. replace the starter contract and deploy script
6. let the deploy flow regenerate frontend contract metadata
7. use Scaffold-ETH contract hooks for the frontend
8. keep network intent in the scaffold config
9. use `/debug` to validate the contract surface
10. switch to a testnet and verify once the local loop is stable

It also called out the real failure modes:

* stale generated metadata
* editing `deployedContracts.ts` manually
* drifting into generic `wagmi` patterns instead of scaffold-native hooks
* assuming the current workspace was already a Scaffold-ETH app

That is the kind of planning help developers actually need from an agent.

---

## **What This Suggests About AgentHub**

This test was not about proving that AgentHub always beats every other context source in every situation.

It was about something more specific:

> whether AgentHub is becoming a tool that agents know how to use well on their own

This run suggests the answer is yes. That is encouraging because AgentHub is not just a directory of packs. It is trying to be a usable context layer for AI coding agents.

For that to work, an agent needs more than access to packs. It needs some sense of **routing**:

* when is a task generic enough to answer from memory?
* when is it specific enough that a pack is the better first source?
* when should it fetch just one pack instead of preloading everything?

That is why our onboarding work now goes beyond “connect the MCP server.”

The onboarding prompt is designed to:

1. connect AgentHub MCP
2. verify it by fetching the `agent-hub` pack
3. derive a short persistent note about when to use AgentHub efficiently

This Scaffold-ETH test is a useful signal that the approach is moving in the right direction.

---

## **What We Are Not Claiming**

We want to stay disciplined here.

This post does **not** claim:

* one planning run proves a universal law
* every agent will always choose AgentHub correctly
* AgentHub should be fetched for every task
* framework packs eliminate the need for official docs

In fact, this run included a healthy pattern:

* use the AgentHub pack first as the primary planning source
* check official docs after that for confirmation

That is the behavior we want.

AgentHub should improve the first draft of reasoning, not replace judgment.

---

## **Why This Is A Better Product Signal Than A Forced Demo**

There is a big difference between:

* “Here is a benchmark where we forced the agent to use our system”
* “Here is a normal task where the agent independently decided our system was the right tool”

The second one is far more interesting. It suggests that AgentHub is starting to function as part of the agent’s own working model of the environment.

That is closer to how good developers use tools too.

A strong engineer does not need to be told:

* “open the framework docs now”
* “check the generated config now”
* “look for the project-specific abstraction instead of generic advice”

They know when those moves matter.

If AgentHub is useful, agents should start learning the same habit. This Scaffold-ETH planning run is a small but real example of that happening.

---

## **Try This In Your Own Agent**

If you want to test this behavior yourself, the easiest path is to install AgentHub through the prompt-based onboarding flow.

Start with the [AgentHub MCP tutorial](/tutorials/use-agent-hub-through-mcp). It gives you a ready-to-paste onboarding prompt that tells your AI coding agent to:

1. connect the AgentHub MCP server
2. verify the installation
3. fetch the `agent-hub` pack
4. install a short persistent note about when to check AgentHub

That last step matters. The goal is not just to make AgentHub available. The goal is to help your agent learn when framework-specific or tool-specific context is worth retrieving.

Once that is installed, give your agent a real task for a framework or tool you care about and watch what happens. The best outcome is not that the agent mentions AgentHub. It is that the agent quietly uses the right pack at the right moment and produces a better plan because of it.

---

## **The Takeaway**

The most encouraging result was not that the agent wrote a decent plan.

It was that the agent recognized the kind of task it was facing, decided that AgentHub was the right source of working context, and used it without being told to.

That is the behavior we are trying to build toward:

* not just better packs
* not just better delivery
* but better judgment about when to retrieve context in the first place

If AgentHub can help agents become more accurate on framework-specific work because they know when to reach for it, that is a much stronger product story than “we have documentation in MCP.”

It means the system is starting to work the way good tooling should:

**quietly, at the right moment, for the right task.**

If you want to put that to work in your own setup, install AgentHub with the [prompt-based MCP onboarding flow](/tutorials/use-agent-hub-through-mcp) and see whether your agent starts reaching for the right context on its own.
