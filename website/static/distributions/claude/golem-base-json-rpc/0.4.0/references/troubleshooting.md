# Golem Base JSON-RPC Troubleshooting

### Update Erased Existing Annotations
**Cause**
`UpdateObject` replaces the full annotation set rather than patching individual fields.

**Fix**
Resend the complete annotation set you want to preserve, or use `ExtendItem` if only TTL needed to change.

### Query Returned Unreadable Values
**Cause**
`golembase_queryEntities` returns payload values in Base64 form.

**Fix**
Decode the Base64 payload before interpreting it as text or bytes.
