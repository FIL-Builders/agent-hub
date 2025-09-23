---
name: "Add Project to Agent Hub Coverage"
about: "Request coverage for a new project (SDK, chain, tool, or agent) in Agent Hub."
title: "Add: <Project Name> — <Category>"
labels: ["area:catalog", "type:request", "triage"]
assignees: ""
---

<!--
Thank you for helping expand Agent Hub! Please fill in as much as you can.
One request per issue is ideal. For a batch, use the “Batch request (optional)” section.
-->

## 1) Quick summary
*A one-liner describing what you want added and why.*
> Example: “Add **Monad protocol docs + SDK** coverage so agents can fetch network params and submit txs.”

---

## 2) Project details
**Project name:**  
**Category:** (choose one) `chain` / `sdk` / `tool` / `service` / `agent` / `dataset` / `docs`  
**Primary ecosystem(s):** (e.g., Filecoin, EVM, NEAR, Golem, Randamu, Polygon, Hedera, Flow, etc.)  
**Official repo:**  
**Docs / API reference:**  
**Homepage (if different):**  
**License:**  
**Current version / tag:**  

---

## 3) Why this matters (user stories / impact)
*Describe concrete workflows this unlocks. Who benefits and how?*
- [ ] Example: As a builder, I can query network status and gas data to price transactions.
- [ ] Example: As a researcher, I can stream on-chain events for analytics agents.

---

## 4) Surfaces to add (check all that apply)
- [ ] **Agent spec (YAML)** in `agents/<project>/<version>.yaml`
- [ ] **Tools** (callable actions / methods)
- [ ] **Resources** (read-only fetchers, status, search)
- [ ] **Prompts** (starter prompts / chains)
- [ ] **Example agent** (minimal working example)
- [ ] **Tutorial / docs page** on Agent Hub site
- [ ] **Smoke tests** (CI)

---

## 5) Capabilities & endpoints
*List key API methods or JSON-RPC calls your agent needs. Include example requests/responses if possible.*
- **Endpoint / Method:**  
  **Purpose:**  
  **Example request:**  
  **Example response (redact secrets):**  

---

## 6) Auth, secrets & scopes
*How do we authenticate? What scopes are minimally required? Any rate limits to note?*
- **Auth type:** (API key / OAuth / none / wallet signature / other)  
- **Scopes:**  
- **Rate limits / quotas:**  
- **Test credentials or sandbox:** (share privately if needed)

---

## 7) Reference implementations (optional but helpful)
*SDKs, CLIs, code samples we can mirror in tools.*
- Language SDKs:  
- Example scripts / curl commands:  
- Known sample apps:

---

## 8) Compatibility & versions
*Anything we should support out of the gate?*
- **Networks / environments:** (mainnet, testnet names)  
- **Breaking changes to watch:**  
- **Minimum versions:**  

---

## 9) Acceptance criteria (Definition of Done)
*Mark what you consider “shipped” for this request.*
- [ ] YAML spec published at `agents/<project>/<version>.yaml`
- [ ] Tools expose the listed endpoints with parameter validation
- [ ] Resource(s) for common read-only queries
- [ ] Example agent loads and runs locally with a single config file
- [ ] Tutorial page linked from “All AgentHub YAML Specs”
- [ ] Smoke test(s) in CI (happy path + one failure path)
- [ ] Changelog entry & docs updated

---

## 10) Related coverage / duplicates
*Is there a similar spec already? What’s missing?*  
Links:

---

## 11) Priority
- [ ] **P0** (launch-critical / hackathon blocking)
- [ ] **P1** (near-term)
- [ ] **P2** (nice to have)

**Reason for priority:**  

---

## 12) Contact
*Who can answer questions or review PRs?*  
**Requester / sponsor:**  
**Preferred contact (GitHub / X / email / Discord):**  

---

## 13) Additional context / attachments
Screenshots, API schemas, OpenAPI/JSON-RPC specs, example configs, etc.

---

### Batch request (optional)
*If you’re requesting multiple projects at once, list them here. Otherwise, leave blank.*
| Project | Category | Repo/Docs | Ecosystem | Must-have endpoints |
|---|---|---|---|---|
|  |  |  |  |  |

---

## Pre-submission checklist
- [ ] I confirmed this project is **not already covered** in “All AgentHub YAML Specs”.
- [ ] I provided at least one **official repo or docs link**.
- [ ] I documented **auth requirements** (or stated none).
- [ ] I listed **minimum endpoints** and **acceptance criteria**.



