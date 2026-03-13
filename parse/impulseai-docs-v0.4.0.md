# Impulse AI HTTP API Documentation Pack

## Target
- Pack: `agents/impulseai/0.4.0.md`
- Target date: 2026-03-13

## Source Inventory
- `agents/impulseai/0.2.0.md` for contract extraction and coverage audit

## Decision Rules
- Always send the `x-api-key` header.
- Treat dataset and fine-tuning workflows as separate stages.
- Poll job status until it reaches a terminal state.
- Keep billing and usage endpoints separate from training control flow.

## Common Confusions
- Model listing is not the same as job status.
- Dataset creation does not start a fine-tuning job by itself.
- Billing endpoints are accounting surfaces, not execution surfaces.

## Failure Modes
- Mutating calls omit the API key header.
- Clients assume a fine-tuning job is ready without polling.
- Cost and credit endpoints get mixed into training orchestration.

## Coverage Map

### API Keys
- `api_keys.create_api_key`
- `api_keys.list_api_keys`

### Datasets And Fine Tuning
- `datasets.create_dataset`
- `datasets.list_datasets`
- `fine_tuning.create_job`
- `fine_tuning.get_job`

### Models And Billing
- `models.list_fine_tuned_models`
- `billing.get_credit_history`

## Must-Not-Regress Insights
- Preserve API-key-header guidance.
- Preserve poll-until-terminal guidance for fine-tuning jobs.
- Preserve dataset-vs-job-vs-model boundary.
