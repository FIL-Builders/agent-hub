# OpenServ Labs SDK Troubleshooting

### Agent Starts Without The Expected Capabilities
**Cause**
The runtime was started before bulk capability registration completed.

**Fix**
Register capabilities first, preferably with `Agent.addCapabilities`, and only then call `Agent.start`.

### Operators Cannot Tell What The Task Is Doing
**Cause**
The workflow updated neither task status nor task logs consistently.

**Fix**
Pair `Agent.updateTaskStatus` with `Agent.addLogToTask` throughout the task lifecycle.
