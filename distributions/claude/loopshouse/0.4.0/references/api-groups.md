# Loopshouse CLI API Groups

### Authentication
**Exports**
- loops auth login
- loops auth status
- loops auth logout

Browser-based OAuth flows and session inspection.

#### loops auth login
**Kind**
workflow

**Summary**
Authenticate the local Loops CLI session through browser-based OAuth.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops auth login
loops auth login --provider github
```

**Guidance**
- Run this before any project or hackathon command.
- Expect browser-based OAuth and local credential storage under `~/.loops/credentials.json`.
- Use the provider flag when the login flow must be pinned to GitHub instead of the default.

**Example**
Language: bash
Description: Log in with the default provider.

```bash
npx loopshouse auth login
```

#### loops auth status
**Kind**
workflow

**Summary**
Check whether the current local CLI session is authenticated.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops auth status
```

**Guidance**
- Use this before automating project or submission flows.
- Treat it as the fastest preflight for local environment issues.
- Prefer this over inferring auth state from later command failures.

**Example**
Language: bash
Description: Verify current auth status.

```bash
loops auth status
```

#### loops auth logout
**Kind**
workflow

**Summary**
Clear locally stored CLI credentials and end the current session.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops auth logout
```

**Guidance**
- Use this when rotating identities or clearing broken local credentials.
- Expect it to remove or invalidate the stored local session rather than changing server-side history.
- Re-run `loops auth login` before attempting further operations afterward.

**Example**
Language: bash
Description: Log out of the local session.

```bash
loops auth logout
```

### Projects
**Exports**
- loops project list
- loops project create
- loops project update

Project CRUD flows for hackathon submissions and ideation context.

#### loops project list
**Kind**
workflow

**Summary**
List the authenticated user’s Loops House projects.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops project list
```

**Guidance**
- Use this to discover project IDs before update, ideation, or submission.
- Treat the returned project ID as the stable handle for later commands.
- Keep this as the first read step when the local operator is unsure which project is current.

**Example**
Language: bash
Description: List current projects.

```bash
loops project list
```

#### loops project create
**Kind**
workflow

**Summary**
Create a new Loops House project with minimal or detailed metadata.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops project create \
  --name "My App" \
  --description "Description" \
  --githubUrl https://github.com/user/repo \
  --techStack "React,Solidity,IPFS" \
  --category DeFi
```

**Guidance**
- Supply at least the required identity fields up front so later submission steps do not need emergency edits.
- Keep structured list-like flags in the formats described by the README, such as comma-separated values or JSON arrays.
- Store the resulting project ID immediately because later ideation and submission flows use it directly.

**Example**
Language: bash
Description: Create a minimal project.

```bash
loops project create --name "My DApp" --description "On-chain analytics"
```

#### loops project update
**Kind**
workflow

**Summary**
Update an existing project by ID.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops project update --id <project-id> --name "New Name" --techStack "React,Rust"
```

**Guidance**
- Use the project ID from `loops project list` or the earlier create response.
- Update only the fields that need to change instead of recreating the project.
- Keep project metadata aligned before hackathon submission so the submission reflects the intended state.

**Example**
Language: bash
Description: Update a project description.

```bash
loops project update --id "$PROJECT_ID" --description "Updated desc"
```

### Hackathons
**Exports**
- loops hackathon list
- loops hackathon ideate
- loops hackathon submit

Hackathon browsing, AI ideation, and project submission.

#### loops hackathon list
**Kind**
workflow

**Summary**
List hackathons, optionally including non-open phases.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops hackathon list
loops hackathon list --all
```

**Guidance**
- Use the returned hackathon ID as the durable handle for ideation and submission.
- Prefer the default list when you want currently relevant hackathons and `--all` when doing historical or planning work.
- Keep phase awareness explicit because submission is phase-gated.

**Example**
Language: bash
Description: List currently relevant hackathons.

```bash
loops hackathon list
```

#### loops hackathon ideate
**Kind**
workflow

**Summary**
Run the AI ideation flow for a hackathon, optionally grounded in a specific project.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops hackathon ideate \
  --hackathonId <hackathon-id> \
  --projectId <project-id> \
  --message "How does my project align with this hackathon?"
```

**Guidance**
- Use `--projectId` when you want feedback grounded in an existing project.
- Treat ideation as advisory planning, not as project mutation or submission.
- Preserve `hackathonId` and `projectId` exactly when chaining from list or project flows.

**Example**
Language: bash
Description: Ideate with project context.

```bash
loops hackathon ideate -h "$HACKATHON_ID" -p "$PROJECT_ID" -m "How does my project fit?"
```

#### loops hackathon submit
**Kind**
workflow

**Summary**
Submit a project to a hackathon during the valid building phase.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops hackathon submit --hackathonId <hackathon-id> --projectId <project-id>
```

**Guidance**
- Ensure the hackathon is in the building phase before attempting submission.
- Keep project metadata current before submitting because the submission resolves from the project state.
- Treat project ID and hackathon ID as required stable inputs, not names.

**Example**
Language: bash
Description: Submit a project to a hackathon.

```bash
loops hackathon submit -h "$HACKATHON_ID" -p "$PROJECT_ID"
```

### MCP Integration
**Exports**
- loops mcp add
- loops --mcp
- auth_login
- project_list
- hackathon_submit

Register the CLI as an MCP server and reason about representative published MCP tools.

#### loops mcp add
**Kind**
workflow

**Summary**
Register Loops House as an MCP server in supported agent environments.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops mcp add
```

**Guidance**
- Use this when the environment supports auto-configuration for MCP.
- Treat this as configuration setup, not as the server runtime itself.
- Prefer this over manually editing config when the client supports it.

**Example**
Language: bash
Description: Auto-configure MCP integration.

```bash
loops mcp add
```

#### loops --mcp
**Kind**
workflow

**Summary**
Start the CLI as an MCP stdio server.

**Definition**
Language: bash
Source: npm README and packaged SKILL.md for `loopshouse@0.1.1`

```bash
loops --mcp
```

**Guidance**
- Use this as the actual MCP server runtime command in manual MCP client configuration.
- Keep it separate from `loops mcp add`, which configures rather than runs the server.
- Use `npx loopshouse --mcp` in environments where global installation is not guaranteed.

**Example**
Language: json
Description: Manual MCP config snippet.

```json
{
  "mcpServers": {
    "loops": {
      "command": "npx",
      "args": ["loopshouse", "--mcp"]
    }
  }
}
```

#### auth_login
**Kind**
other

**Summary**
Representative MCP tool that triggers browser OAuth login.

**Definition**
Language: text
Source: npm README for `loopshouse@0.1.1`

```text
auth_login
```

**Guidance**
- Think of this as the MCP equivalent of `loops auth login`.
- Keep the CLI-vs-MCP distinction explicit when documenting agent workflows.
- Use it from an MCP client, not as a shell command.

**Example**
Language: text
Description: Example agent intent.

```text
Authenticate the agent with Loops House using the auth_login MCP tool.
```

#### project_list
**Kind**
other

**Summary**
Representative MCP tool for listing projects from an agent client.

**Definition**
Language: text
Source: npm README for `loopshouse@0.1.1`

```text
project_list
```

**Guidance**
- Treat this as the MCP analogue of `loops project list`.
- Use it when the agent is operating through the MCP surface rather than shelling out.
- Keep output handling tied to project IDs for later tool calls.

**Example**
Language: text
Description: Example agent intent.

```text
List my current Loops House projects through the MCP server.
```

#### hackathon_submit
**Kind**
other

**Summary**
Representative MCP tool for submitting a project to a hackathon.

**Definition**
Language: text
Source: npm README for `loopshouse@0.1.1`

```text
hackathon_submit
```

**Guidance**
- Treat it as the MCP counterpart to `loops hackathon submit`.
- Keep the same phase and ID preconditions as the CLI workflow.
- Use it only after the agent has established the intended project and hackathon IDs.

**Example**
Language: text
Description: Example agent intent.

```text
Submit my selected project to the target hackathon through the MCP server.
```
