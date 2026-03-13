# Loopshouse Documentation Pack

## Target
- Pack: `agents/loopshouse/0.4.0.md`
- Target date: 2026-03-13
- Package anchor: `loopshouse@0.1.1`

## Source Inventory
- `npm:loopshouse@0.1.1` package manifest
- npm README for `loopshouse@0.1.1`
- packaged `SKILL.md` from `loopshouse@0.1.1`

## Version Delta Audit
- This is a new package-specific pack, not a port of an earlier `0.3.0` agent file.
- Current published line is `0.1.1`.

## Ecosystem Boundaries

### CLI
- Authentication, projects, hackathons, submission, and MCP registration are CLI workflows.

### MCP Server
- `loops --mcp` exposes the tool server for agents.
- The MCP tool names are distinct from shell commands and should be documented separately.

### Platform
- Auth is browser-based OAuth and credentials are stored locally.
- Data commands talk to the Loops platform under user context.
- AI ideation calls a platform API route and can include project context.

## Decision Rules
- Authenticate first and verify session status before any project or hackathon workflow.
- Keep project management separate from hackathon ideation and submission.
- Use `loops mcp add` or `loops --mcp` when integrating with agent tooling instead of shelling out ad hoc commands from the agent runtime.
- Treat project ID and hackathon ID as the stable handles for later ideation and submission.

## Common Confusions
- `loops mcp add` registers MCP config; `loops --mcp` starts the stdio MCP server.
- Hackathon ideation is advisory and can optionally include project context; it does not submit anything.
- Project create and project update have overlapping but not identical required flags.

## Failure Modes
- Users skip auth and then treat downstream errors as command bugs.
- Agents confuse CLI commands with MCP tool names.
- Submission is attempted outside the building phase.

## Coverage Map

### Auth
- `loops auth login`
- `loops auth status`
- `loops auth logout`

### Projects
- `loops project list`
- `loops project create`
- `loops project update`

### Hackathons
- `loops hackathon list`
- `loops hackathon ideate`
- `loops hackathon submit`

### MCP
- `loops mcp add`
- `loops --mcp`
- `auth_login`
- `project_list`
- `hackathon_submit`

## Must-Not-Regress Insights
- Preserve the auth-first workflow.
- Preserve project-id and hackathon-id as stable handles.
- Preserve the CLI-vs-MCP distinction.
