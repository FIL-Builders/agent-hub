# Walrus HTTP API Troubleshooting

### Upload Fails On The Chosen Endpoint
**Cause**
The request was sent to an aggregator-only endpoint instead of a publisher-capable one.

**Fix**
Route writes through a publisher or daemon and reserve aggregator endpoints for reads.

### Data Did Not Persist As Long As Expected
**Cause**
The requested `epochs` value was omitted or too small for the intended retention window.

**Fix**
Set `epochs` explicitly during `walrus.blobs.put` and treat the returned retention metadata as part of your planning logic.
