# Fluence API Troubleshooting

### VM Creation Returns Not Enough Offers
**Cause**
Filters are too narrow or storage requirements were specified inconsistently.

**Fix**
Relax country and hardware constraints, re-run `marketplace.offers.search`, then re-run `vms.estimate` before creating again.

### SSH Access Broke After Patching Ports
**Cause**
`PATCH /vms/v3` replaced the full `openPorts` list and port `22` was omitted.

**Fix**
Re-run `vms.patch` with the complete desired list, including `22` and any previously needed ports.
