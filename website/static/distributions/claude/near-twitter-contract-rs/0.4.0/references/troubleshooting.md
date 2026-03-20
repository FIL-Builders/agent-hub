# NEAR Twitter Contract RS Troubleshooting

### get_tweet_by_id Returns None
**Cause**
The requested tweet ID does not exist or was deleted earlier.

**Fix**
Treat this as a not-found case in the client and confirm the ID via paginated reads if needed.

### delete_tweet Works For One User But Not Another
**Cause**
Deletion is authorization-sensitive and depends on predecessor account identity.

**Fix**
Call `delete_tweet` from the tweet author’s account and keep authorization errors explicit in logs or UI.
