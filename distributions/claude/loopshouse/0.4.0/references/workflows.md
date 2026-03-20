# Loopshouse CLI Workflows

### Create And Submit A Project
1. Run `loops auth login` and confirm with `loops auth status`.
2. Create a project with `loops project create`.
3. List hackathons and choose a target ID.
4. Optionally run `loops hackathon ideate` with the project context.
5. Submit with `loops hackathon submit`.

### Use Loopshouse From An Agent
1. Configure MCP with `loops mcp add` or manual config that runs `loops --mcp`.
2. Authenticate through the CLI or the `auth_login` tool.
3. Use MCP tools like `project_list` and `hackathon_submit` instead of shell commands where the agent client supports them.
