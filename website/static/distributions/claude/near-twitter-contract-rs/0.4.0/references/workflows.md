# NEAR Twitter Contract RS Workflows

### Create And Inspect A Tweet
1. Initialize the contract after deployment with `new`.
2. Call `post_tweet` as the author account.
3. Fetch the result later with `get_tweet_by_id` or `get_all_tweets`.

### Handle Like And Delete Safely
1. Call `like_tweet` with a known ID and handle `None` if the tweet does not exist.
2. Call `delete_tweet` only from the author account.
3. Re-read the view methods to confirm the new state.
