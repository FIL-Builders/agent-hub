# Fluence API Workflows

### Deploy A VM Safely
1. List basic configurations or countries if you need guided filters.
2. Search marketplace offers with broad-enough constraints.
3. Call `vms.estimate` with the chosen shape to confirm budget and deposit.
4. Create or reuse an SSH key.
5. Call `vms.create` with the full desired open-port set.

### Update Exposed Ports Without Locking Yourself Out
1. Read the current desired port set from your deployment state.
2. Add the new port to the full list, preserving `22` if SSH is still needed.
3. Call `vms.patch` with the complete replacement array.
