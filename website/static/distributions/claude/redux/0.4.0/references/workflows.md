# Redux Workflows

### Maintain an existing core Redux store safely
1. Confirm whether the codebase intentionally uses the core `redux` package instead of Redux Toolkit.
2. Inspect whether store creation uses `createStore` or `legacy_createStore`.
3. Verify reducer initialization and unknown-action fallback before changing middleware or enhancers.
4. Keep companion-library APIs out of the answer unless the task explicitly crosses that boundary.
5. Change middleware or enhancer ordering only when the runtime behavior is understood.

```ts
import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";

const rootReducer = combineReducers({
  counter: (state = 0, action: { type: string }) =>
    action.type === "counter/increment" ? state + 1 : state,
});

const logger = () => (next: (action: unknown) => unknown) => (action: unknown) => {
  console.log("action", action);
  return next(action);
};

const store = createStore(rootReducer, applyMiddleware(logger));
```

### Guard unknown input before dispatch
1. Validate that the value is an action-shaped plain object.
2. Validate any domain-specific payload fields separately.
3. Dispatch only after both checks pass.
4. Keep middleware requirements explicit if the input is not a plain object action.

```ts
import { isAction } from "redux";

function maybeDispatch(dispatch: (action: { type: string }) => void, value: unknown) {
  if (isAction(value)) {
    dispatch(value);
  }
}
```
