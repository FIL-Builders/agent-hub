# Loopshouse CLI Overview

## Snapshot

- Spec name: loopshouse/cli
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: loopshouse^0.1.1
- Primary language: javascript
- Homepage: https://www.npmjs.com/package/loopshouse
- Source set: `npm:loopshouse@0.1.1` package manifest; npm README for `loopshouse@0.1.1`; packaged `SKILL.md`; and `parse/loopshouse-docs-v0.4.0.md` as the intermediate documentation pack

**Tags**
- loops
- hackathon
- cli
- mcp
- oauth
- projects

## Purpose

This pack teaches an agent to use the `loopshouse` package at a senior-developer level: authenticate through the Loops House CLI, manage hackathon projects, browse and ideate against hackathons, submit projects at the right stage, and expose the same workflows as an MCP server for agent integration.

## Guiding Principles

- Authenticate first and verify session state before project or hackathon operations.
- Treat project IDs and hackathon IDs as the durable handles for later actions.
- Keep project-management flows separate from ideation and submission flows.
- Distinguish MCP registration and MCP server mode from ordinary CLI usage.
- Keep local credential storage and platform-side operations explicit in troubleshooting and automation.

## Boundary Notes

- This is a new package-specific `0.4.0` pack based on the published npm package rather than a port of an earlier agent file.
- The package is primarily a CLI, but it also ships an MCP server mode and a skill document that clarifies intended agent usage.
- The current public surface is auth, projects, hackathons, and MCP integration, with browser-based OAuth and local credential persistence.

## FAQ

### Is hackathon ideation the same as submission?
No. Ideation is an advisory AI workflow. Submission is a separate, phase-gated action that requires both a hackathon ID and a project ID.

### Should an agent use shell commands or MCP tools?
Use MCP tools when the agent client supports the Loopshouse MCP server. Use shell commands only when the environment is explicitly CLI-driven.

## External Resources

- npm package: https://www.npmjs.com/package/loopshouse
- Loops House: https://loops.house
