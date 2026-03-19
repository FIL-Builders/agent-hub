# Impulse AI HTTP API Workflows

### Train A Fine-Tuned Model
1. Create a dataset with `datasets.create_dataset`.
2. Verify it exists through `datasets.list_datasets`.
3. Start a job with `fine_tuning.create_job`.
4. Poll `fine_tuning.get_job` until it reaches a terminal state.
5. Read the resulting model through `models.list_fine_tuned_models`.
