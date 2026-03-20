---
name: loopshouse
description: Use for Loopshouse CLI tasks. Helps with the `loopshouse` package at a senior-developer level: authenticate through the Loops House CLI, manage hackathon projects, browse and ideate against hackathons, submit projects at the right stage, and expose the same workflows as an MCP server for agent integration.
---

# Loopshouse CLI

Use this skill when the task depends on Loopshouse CLI-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the `loopshouse` package at a senior-developer level: authenticate through the Loops House CLI, manage hackathon projects, browse and ideate against hackathons, submit projects at the right stage, and expose the same workflows as an MCP server for agent integration.

## When to use this skill

- Loopshouse CLI setup and implementation work
- Loopshouse CLI API usage and configuration decisions
- Loopshouse CLI-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Authenticate first and verify session state before project or hackathon operations.
- Treat project IDs and hackathon IDs as the durable handles for later actions.
- Keep project-management flows separate from ideation and submission flows.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
