# Redux Troubleshooting

### Reducer returns undefined
**Cause**
The reducer forgot its default state or does not return the current state for unknown actions.

**Fix**
- Return an initial state when `state` is `undefined`.
- Return the existing state for unknown actions.
- Re-run reducer tests with both initialization and unrelated-action inputs.

### Middleware swallows actions
**Cause**
The middleware never calls or returns `next(action)`, so downstream middleware and reducers never receive the action.

**Fix**
- Log before and after `next(action)` to confirm the chain.
- Return `next(action)` unless the middleware intentionally terminates the flow.
- Check enhancer and middleware composition order if the chain still behaves unexpectedly.

### Wrong library surface appears in the answer
**Cause**
The task was answered with Redux Toolkit or `react-redux` APIs even though the question was about the core `redux` package.

**Fix**
- Check whether the answer mentions `configureStore`, `createSlice`, `useSelector`, or `<Provider>`.
- Keep the answer limited to `redux` exports unless the task explicitly asks for companion-library behavior.
- If the task really targets modern application setup, move the answer to the correct companion package instead.
