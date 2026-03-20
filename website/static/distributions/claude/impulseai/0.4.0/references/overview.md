# Impulse AI HTTP API Overview

## Snapshot

- Spec name: impulse-ai/http
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: current-docs
- Primary language: http
- Homepage: https://github.com/impulse-ai
- Source set: `parse/impulseai-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/impulseai/0.2.0.md` for contract extraction and coverage audit

**Tags**
- llm
- fine-tuning
- http-api
- datasets
- billing

## Purpose

This pack teaches an agent to use the Impulse AI HTTP API at a senior-developer level: manage API keys, create and inspect datasets, launch and track fine-tuning jobs, distinguish models from jobs, and keep billing or usage data separate from training orchestration.

## Guiding Principles

- Always send the `x-api-key` header.
- Treat dataset creation, fine-tuning jobs, and model retrieval as separate stages.
- Poll job status until it reaches a terminal state.
- Keep billing and usage endpoints out of the critical training-control path unless the workflow explicitly needs them.
- Use stable resource names consistently across later reads and updates.

## Boundary Notes

- The old `0.2.0` pack already had the right grouping: API keys, datasets, fine-tuning, models, and billing. This `0.4.0` port preserves that grouping and makes the job-lifecycle model easier to retrieve from.
- The central operational boundary is dataset preparation → fine-tuning job → resulting model artifact.
- This pack relies on the prior extracted endpoint contracts and guidance from the earlier pack.

## FAQ

### Does creating a dataset start training?
No. Dataset creation is preparatory. Training starts only when you create a fine-tuning job.

### Are billing endpoints part of the training lifecycle?
No. They are accounting and usage surfaces, not job-control surfaces.

## External Resources

- Impulse AI organization: https://github.com/impulse-ai
