---
name: near-twitter-contract-rs
description: Use for NEAR Twitter Contract RS tasks. Helps with work with the NEAR Twitter-like Rust contract at a senior-developer level: initialize state correctly, create and like tweets through write methods, enforce author-only deletion, and use paginated view methods without assuming indexed query performance.
---

# NEAR Twitter Contract RS

Use this skill when the task depends on NEAR Twitter Contract RS-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to work with the NEAR Twitter-like Rust contract at a senior-developer level: initialize state correctly, create and like tweets through write methods, enforce author-only deletion, and use paginated view methods without assuming indexed query performance.

## When to use this skill

- NEAR Twitter Contract RS setup and implementation work
- NEAR Twitter Contract RS API usage and configuration decisions
- NEAR Twitter Contract RS-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Distinguish paid write calls from free view methods.
- Treat `env::predecessor_account_id()` as the write-side identity source.
- Keep write methods simple and strongly typed.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
