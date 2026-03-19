# Helia Workflows

### Add and retrieve UnixFS content
1. Create a Helia node with `createHelia()`.
2. Create a UnixFS facade with `unixfs(helia)`.
3. Add content with `addBytes` for simple bytes or `addAll` for path-aware imports.
4. Persist or communicate the resulting CID.
5. Retrieve with `cat`, optionally using `path`, timeouts, or provider hints.

### Customize a node without rebuilding defaults by hand
1. Start from `heliaDefaults()` or `libp2pDefaults()`.
2. Modify only the stores, routers, or services the environment requires.
3. Create the node with the adjusted config.
4. Verify retrieval still has the router capabilities it needs before diagnosing UnixFS code.

### Choose browser versus server persistence deliberately
1. Treat the default browser node as ephemeral unless you deliberately wire persistent stores.
2. Treat server-side nodes as the place for deliberate blockstore and datastore persistence choices.
3. Do not assume a CID added before a browser reload will still be locally retrievable afterward.
4. Document the persistence strategy separately from file-operation code.
