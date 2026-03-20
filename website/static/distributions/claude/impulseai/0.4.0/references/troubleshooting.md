# Impulse AI HTTP API Troubleshooting

### Fine-Tuned Model Never Appears
**Cause**
The workflow assumed model availability without waiting for the job to finish successfully.

**Fix**
Poll `fine_tuning.get_job` until `SUCCEEDED` before expecting the tuned model to appear in model listings.

### Calls Fail Unexpectedly Across The API
**Cause**
The `x-api-key` header is missing or incorrect.

**Fix**
Send the `x-api-key` header on every authenticated request and validate the environment configuration before retrying.
