# Impulse AI HTTP API API Groups

### API Keys
**Exports**
- api_keys.create_api_key
- api_keys.list_api_keys

Credential management for the Impulse API.

#### api_keys.create_api_key
**Kind**
endpoint

**Summary**
Create a new API key for the current user.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md coverage audit

```http
POST /v1/api-keys
x-api-key: <API_KEY>
Content-Type: application/json

{
  "name": "ci-bot",
  "expires_in_days": 30
}
```

**Guidance**
- Name keys descriptively so rotation and audit flows stay understandable.
- Store returned secrets immediately because they may not be retrievable later.
- Keep creation and later deletion flows explicit in operations tooling.

**Example**
Language: bash
Description: Create an API key.

```bash
curl -sS https://api.impulse.ai/v1/api-keys \
  -H "x-api-key: $IMPULSE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"ci-bot","expires_in_days":30}'
```

#### api_keys.list_api_keys
**Kind**
endpoint

**Summary**
List API keys belonging to the caller.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md coverage audit

```http
GET /v1/api-keys
x-api-key: <API_KEY>
```

**Guidance**
- Use this for rotation audits and cleanup workflows.
- Treat pagination parameters as part of operational hygiene for large accounts.
- Keep key inventory separate from dataset and training logic.

**Example**
Language: bash
Description: List API keys.

```bash
curl -sS https://api.impulse.ai/v1/api-keys \
  -H "x-api-key: $IMPULSE_API_KEY"
```

### Datasets And Fine Tuning
**Exports**
- datasets.create_dataset
- datasets.list_datasets
- fine_tuning.create_job
- fine_tuning.get_job

Prepare training data, launch jobs, and observe training state.

#### datasets.create_dataset
**Kind**
endpoint

**Summary**
Create a dataset resource used later by fine-tuning jobs.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md coverage audit

```http
POST /v1/datasets
x-api-key: <API_KEY>
Content-Type: application/json

{
  "dataset_name": "support-set",
  "format": "jsonl"
}
```

**Guidance**
- Treat dataset creation as a preparatory stage, not as training itself.
- Keep dataset names stable because later job creation often references them.
- Validate dataset format and size before launching downstream jobs.

**Example**
Language: bash
Description: Create a dataset.

```bash
curl -sS https://api.impulse.ai/v1/datasets \
  -H "x-api-key: $IMPULSE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"dataset_name":"support-set","format":"jsonl"}'
```

#### datasets.list_datasets
**Kind**
endpoint

**Summary**
List datasets available to the caller.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md coverage audit

```http
GET /v1/datasets
x-api-key: <API_KEY>
```

**Guidance**
- Use this to confirm dataset presence before starting a job.
- Keep pagination explicit in larger accounts.
- Use dataset inspection to avoid accidentally re-uploading the same training set.

**Example**
Language: bash
Description: List datasets.

```bash
curl -sS https://api.impulse.ai/v1/datasets \
  -H "x-api-key: $IMPULSE_API_KEY"
```

#### fine_tuning.create_job
**Kind**
endpoint

**Summary**
Start a fine-tuning job against a base model and dataset.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md workflow guidance coverage

```http
POST /v1/fine-tuning/jobs
x-api-key: <API_KEY>
Content-Type: application/json

{
  "job_name": "support-tune",
  "base_model": "base-model-name",
  "dataset_name": "support-set"
}
```

**Guidance**
- Keep job names stable because later job reads often reference them directly.
- Do not assume the resulting tuned model exists until the job reaches a terminal success state.
- Pair job creation with explicit polling logic.

**Example**
Language: bash
Description: Start a fine-tuning job.

```bash
curl -sS https://api.impulse.ai/v1/fine-tuning/jobs \
  -H "x-api-key: $IMPULSE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"job_name":"support-tune","base_model":"base-model","dataset_name":"support-set"}'
```

#### fine_tuning.get_job
**Kind**
endpoint

**Summary**
Fetch one fine-tuning job and inspect its status.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md workflow guidance coverage

```http
GET /v1/fine-tuning/jobs/{job_name}
x-api-key: <API_KEY>
```

**Guidance**
- Poll this until the job reaches `SUCCEEDED` or `FAILED`.
- Keep job status handling explicit and do not conflate it with the existence of a model artifact.
- Use this as the authoritative job-state read path.

**Example**
Language: bash
Description: Fetch a fine-tuning job.

```bash
curl -sS https://api.impulse.ai/v1/fine-tuning/jobs/support-tune \
  -H "x-api-key: $IMPULSE_API_KEY"
```

### Models And Billing
**Exports**
- models.list_fine_tuned_models
- billing.get_credit_history

Read the outputs of successful jobs and inspect account-level billing state.

#### models.list_fine_tuned_models
**Kind**
endpoint

**Summary**
List the caller’s fine-tuned models.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md coverage audit

```http
GET /v1/models/fine-tuned
x-api-key: <API_KEY>
```

**Guidance**
- Use this after successful jobs to discover the resulting model artifacts.
- Do not treat model listing as a substitute for job-status polling.
- Keep base-model and tuned-model identity separate in your application state.

**Example**
Language: bash
Description: List fine-tuned models.

```bash
curl -sS https://api.impulse.ai/v1/models/fine-tuned \
  -H "x-api-key: $IMPULSE_API_KEY"
```

#### billing.get_credit_history
**Kind**
endpoint

**Summary**
Fetch account credit-history records.

**Definition**
Language: http
Source: agents/impulseai/0.2.0.md coverage audit

```http
GET /v1/billing/credit-history
x-api-key: <API_KEY>
```

**Guidance**
- Use this for accounting and operational review, not for training control flow.
- Keep billing reads out of hot request paths unless necessary.
- Correlate billing information with jobs after the fact rather than during submission.

**Example**
Language: bash
Description: Fetch billing credit history.

```bash
curl -sS https://api.impulse.ai/v1/billing/credit-history \
  -H "x-api-key: $IMPULSE_API_KEY"
```
