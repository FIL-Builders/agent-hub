**MASTER PROMPT — “Generate an AgentHub Expert Knowledge Pack”**

---

### 1. Role Definition

You are an **Expert Technical Writer & AI Knowledge Engineer** who specialises in developer tools.
You craft clear, accurate documentation and convert unstructured API references into machine‑readable knowledge packs.

---

### 2. Core Objective

Produce **one** fully‑valid **YAML file** that **conforms exactly to the Open Agent Spec v0.1**.
Return **nothing else**—no explanations, greetings, or markdown fences.

---

### 3. Inputs

# ===================================================================
# AgentHub ‑ Open Agent Spec • Version 0.1  (formal YAML schema)
# -------------------------------------------------------------------
# This file defines—using JSON‑Schema vocabulary encoded as YAML—
# the authoritative structure every “Expert Knowledge Pack” must follow.
# ===================================================================

$schema: "https://json-schema.org/draft/2020-12/schema"
$id: "https://agenthub.dev/schema/open-agent-spec-0.1.json"
title: "AgentHub ‑ Open Agent Spec v0.1"
description: >
  Machine‑readable schema for AgentHub “Expert Knowledge Packs”.
  Packs are data‑only documents that teach any LLM to operate a specific
  API/SDK at senior‑developer level.

type: object
required: [meta, groups]
additionalProperties: false

properties:

  # ---------------------------------------------------------------
  # 1. META BLOCK
  # ---------------------------------------------------------------
  meta:
    type: object
    required:
      - spec_name
      - spec_version
      - generated
      - purpose
      - guiding_principles
      - design_notes
    additionalProperties: false
    properties:
      spec_name:
        type: string
        description: >
          Unique kebab‑ or slash‑case identifier, e.g. "react" or "aws-sdk/s3".
        pattern: "^[a-z0-9]+([-/][a-z0-9]+)*$"
      spec_version:
        type: string
        description: Semantic version of this Knowledge Pack.
        pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"
      generated:
        type: string
        description: Build date (UTC) in YYYY‑MM‑DD.
        pattern: "^\\d{4}-\\d{2}-\\d{2}$"
      purpose:
        type: string
        description: Human‑readable mission statement.
      guiding_principles:
        type: array
        description: 3‑10 rules steering AI answers.
        minItems: 3
        maxItems: 10
        items: { type: string }
      design_notes:
        type: string
        description: >
          Author rationale, research references, and notable trade‑offs.

  # ---------------------------------------------------------------
  # 2. GROUPS (required array)
  # ---------------------------------------------------------------
  groups:
    type: array
    minItems: 1
    items:
      type: object
      required: [name, exports, symbols]
      additionalProperties: false
      properties:
        name:
          type: string
          description: Section heading (e.g. "Hooks (State, Refs, Effects)").
        exports:
          type: array
          description: Canonical symbol names covered by this group.
          minItems: 1
          uniqueItems: true
          items: { type: string }
        symbols:
          type: object
          description: >
            Map of export name → Symbol Definition. Every key listed in
            `exports` MUST exist here.
          additionalProperties:
            type: object
            required: [summary, guidance, example]
            additionalProperties: true    # Allows extra snake_case fields.
            properties:
              summary:
                type: string
                description: One‑sentence purpose of the symbol.
              guidance:
                type: array
                description: Pragmatic tips, best practices, pitfalls.
                minItems: 1
                items: { type: string }
              example:
                type: string
                description: Minimal runnable code snippet.
              ai_support:
                type: array
                description: Typical developer questions the LLM should handle.
                items: { type: string }

  # ---------------------------------------------------------------
  # 3. OPTIONAL LIBRARY‑WIDE SECTIONS
  # ---------------------------------------------------------------
  common_workflows:
    type: array
    description: Step‑by‑step guides for frequent, high‑level tasks.
    items:
      type: object
      required: [title, steps]
      additionalProperties: false
      properties:
        title: { type: string }
        steps:
          type: array
          minItems: 1
          items: { type: string }

  troubleshooting_cheatsheet:
    type: array
    description: Quick‑reference symptom → cause → fix table.
    items:
      type: object
      required: [symptom, cause, fix]
      additionalProperties: false
      properties:
        symptom: { type: string }
        cause:   { type: string }
        fix:     { type: string }

  faq:
    type: array
    description: Frequently asked questions with concise answers.
    items:
      type: object
      required: [q, a]
      additionalProperties: false
      properties:
        q: { type: string }
        a: { type: string }

  external_resources:
    type: array
    description: Authoritative links to docs, blog posts, videos, etc.
    items:
      type: object
      required: [label, url]
      additionalProperties: false
      properties:
        label: { type: string }
        url:
          type: string
          format: uri
          description: HTTPS URL of the resource.

# ---------------------------------------------------------------
# 4. VERSIONING RULES (informational, non‑enforced by schema)
# ---------------------------------------------------------------
# • Minor version bump → adding OPTIONAL keys or fields.
# • Major version bump → breaking structural change.
# • Knowledge Pack files must specify `spec_version` in SemVer.
#
# ---------------------------------------------------------------
# 5. LOGICAL VALIDATION BEYOND SCHEMA (performed in CI)
# ---------------------------------------------------------------
# • Every name listed in groups[*].exports appears in groups[*].symbols.
# • No duplicate exports across groups.
# • Example snippets compile/run in smoke‑test harness.
# • Guiding principles array length 3‑10.
#
# ---------------------------------------------------------------
# End of schema
# ---------------------------------------------------------------


{
  "exports": [
    {
      "name": "Action",
      "kind": "TypeAliasDeclaration",
      "signature": "type Action<T extends string = string> = {\n    type: T;\n};",
      "doc": "An *action* is a plain object that represents an intention to change the\nstate. Actions are the only way to get data into the store. Any data,\nwhether from UI events, network callbacks, or other sources such as\nWebSockets needs to eventually be dispatched as actions.\n\nActions must have a `type` field that indicates the type of action being\nperformed. Types can be defined as constants and imported from another\nmodule. These must be strings, as strings are serializable.\n\nOther than `type`, the structure of an action object is really up to you.\nIf you're interested, check out Flux Standard Action for recommendations on\nhow actions should be constructed.",
      "tags": [
        {
          "tagName": "template",
          "text": "the type of the action's `type` tag."
        }
      ]
    },
    {
      "name": "ActionCreator",
      "kind": "InterfaceDeclaration",
      "signature": "interface ActionCreator<A, P extends any[] = any[]> {\n    (...args: P): A;\n}",
      "doc": "An *action creator* is, quite simply, a function that creates an action. Do\nnot confuse the two terms—again, an action is a payload of information, and\nan action creator is a factory that creates an action.\n\nCalling an action creator only produces an action, but does not dispatch\nit. You need to call the store's `dispatch` function to actually cause the\nmutation. Sometimes we say *bound action creators* to mean functions that\ncall an action creator and immediately dispatch its result to a specific\nstore instance.\n\nIf an action creator needs to read the current state, perform an API call,\nor cause a side effect, like a routing transition, it should return an\nasync action instead of an action.",
      "tags": [
        {
          "tagName": "template",
          "text": "Returned action type."
        }
      ]
    },
    {
      "name": "ActionCreatorsMapObject",
      "kind": "InterfaceDeclaration",
      "signature": "interface ActionCreatorsMapObject<A = any, P extends any[] = any[]> {\n    [key: string]: ActionCreator<A, P>;\n}",
      "doc": "Object whose values are action creator functions.",
      "tags": []
    },
    {
      "name": "ActionFromReducer",
      "kind": "TypeAliasDeclaration",
      "signature": "type ActionFromReducer<R> = R extends Reducer<any, infer A, any> ? A : never;",
      "doc": "Infer action type from a reducer function.",
      "tags": [
        {
          "tagName": "template",
          "text": "Type of reducer."
        }
      ]
    },
    {
      "name": "ActionFromReducersMapObject",
      "kind": "TypeAliasDeclaration",
      "signature": "type ActionFromReducersMapObject<M> = ActionFromReducer<ReducerFromReducersMapObject<M>>;",
      "doc": "Infer action union type from a `ReducersMapObject`.",
      "tags": [
        {
          "tagName": "template",
          "text": "Object map of reducers as provided to `combineReducers(map: M)`."
        }
      ]
    },
    {
      "name": "AnyAction",
      "kind": "InterfaceDeclaration",
      "signature": "interface AnyAction extends Action {\n    [extraProps: string]: any;\n}",
      "doc": "An Action type which accepts any other properties.\nThis is mainly for the use of the `Reducer` type.\nThis is not part of `Action` itself to prevent types that extend `Action` from\nhaving an index signature.",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "use Action or UnknownAction instead"
        }
      ]
    },
    {
      "name": "Dispatch",
      "kind": "InterfaceDeclaration",
      "signature": "interface Dispatch<A extends Action = UnknownAction> {\n    <T extends A>(action: T, ...extraArgs: any[]): T;\n}",
      "doc": "A *dispatching function* (or simply *dispatch function*) is a function that\naccepts an action or an async action; it then may or may not dispatch one\nor more actions to the store.\n\nWe must distinguish between dispatching functions in general and the base\n`dispatch` function provided by the store instance without any middleware.\n\nThe base dispatch function *always* synchronously sends an action to the\nstore's reducer, along with the previous state returned by the store, to\ncalculate a new state. It expects actions to be plain objects ready to be\nconsumed by the reducer.\n\nMiddleware wraps the base dispatch function. It allows the dispatch\nfunction to handle async actions in addition to actions. Middleware may\ntransform, delay, ignore, or otherwise interpret actions or async actions\nbefore passing them to the next middleware.",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of things (actions or otherwise) which may be\ndispatched."
        }
      ]
    },
    {
      "name": "Middleware",
      "kind": "InterfaceDeclaration",
      "signature": "interface Middleware<_DispatchExt = {}, // TODO: see if this can be used in type definition somehow (can't be removed, as is used to get final dispatch type)\nS = any, D extends Dispatch = Dispatch> {\n    (api: MiddlewareAPI<D, S>): (next: (action: unknown) => unknown) => (action: unknown) => unknown",
      "doc": "A middleware is a higher-order function that composes a dispatch function\nto return a new dispatch function. It often turns async actions into\nactions.\n\nMiddleware is composable using function composition. It is useful for\nlogging actions, performing side effects like routing, or turning an\nasynchronous API call into a series of synchronous actions.",
      "tags": [
        {
          "tagName": "template",
          "text": "Extra Dispatch signature added by this middleware."
        },
        {
          "tagName": "template",
          "text": "The type of the state supported by this middleware."
        },
        {
          "tagName": "template",
          "text": "The type of Dispatch of the store where this middleware is\ninstalled."
        }
      ]
    },
    {
      "name": "MiddlewareAPI",
      "kind": "InterfaceDeclaration",
      "signature": "interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {\n    dispatch: D;\n    getState(): S;\n}",
      "doc": "",
      "tags": []
    },
    {
      "name": "Observable",
      "kind": "TypeAliasDeclaration",
      "signature": "type Observable<T> = {\n    /**\n     * The minimal observable subscription method.\n     * @param {Object} observer Any object that can be used as an observer.\n     * The observer object should have a `next` method.\n     * @returns {subscription} An object with an `unsubscribe` method that can\n     * ",
      "doc": "A minimal observable of state changes.\nFor more information, see the observable proposal:\nhttps://github.com/tc39/proposal-observable",
      "tags": []
    },
    {
      "name": "Observer",
      "kind": "TypeAliasDeclaration",
      "signature": "type Observer<T> = {\n    next?(value: T): void;\n};",
      "doc": "An Observer is used to receive data from an Observable, and is supplied as\nan argument to subscribe.",
      "tags": []
    },
    {
      "name": "PreloadedStateShapeFromReducersMapObject",
      "kind": "TypeAliasDeclaration",
      "signature": "type PreloadedStateShapeFromReducersMapObject<M> = M[keyof M] extends Reducer<any, any, any> | undefined ? {\n    [P in keyof M]: M[P] extends (inputState: infer InputState, action: UnknownAction) => any ? InputState : never;\n} : never;",
      "doc": "Infer a combined preloaded state shape from a `ReducersMapObject`.",
      "tags": [
        {
          "tagName": "template",
          "text": "Object map of reducers as provided to `combineReducers(map: M)`."
        }
      ]
    },
    {
      "name": "Reducer",
      "kind": "TypeAliasDeclaration",
      "signature": "type Reducer<S = any, A extends Action = UnknownAction, PreloadedState = S> = (state: S | PreloadedState | undefined, action: A) => S;",
      "doc": "A *reducer* is a function that accepts\nan accumulation and a value and returns a new accumulation. They are used\nto reduce a collection of values down to a single value\n\nReducers are not unique to Redux—they are a fundamental concept in\nfunctional programming.  Even most non-functional languages, like\nJavaScript, have a built-in API for reducing. In JavaScript, it's\n`Array.prototype.reduce()`.\n\nIn Redux, the accumulated value is the state object, and the values being\naccumulated are actions. Reducers calculate a new state given the previous\nstate and an action. They must be *pure functions*—functions that return\nthe exact same output for given inputs. They should also be free of\nside-effects. This is what enables exciting features like hot reloading and\ntime travel.\n\nReducers are the most important concept in Redux.\n\n*Do not put API calls into reducers.*",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of state consumed and produced by this reducer."
        },
        {
          "tagName": "template",
          "text": "The type of actions the reducer can potentially respond to."
        },
        {
          "tagName": "template",
          "text": "The type of state consumed by this reducer the first time it's called."
        }
      ]
    },
    {
      "name": "ReducerFromReducersMapObject",
      "kind": "TypeAliasDeclaration",
      "signature": "type ReducerFromReducersMapObject<M> = M[keyof M] extends Reducer<any, any, any> | undefined ? M[keyof M] : never;",
      "doc": "Infer reducer union type from a `ReducersMapObject`.",
      "tags": [
        {
          "tagName": "template",
          "text": "Object map of reducers as provided to `combineReducers(map: M)`."
        }
      ]
    },
    {
      "name": "ReducersMapObject",
      "kind": "TypeAliasDeclaration",
      "signature": "type ReducersMapObject<S = any, A extends Action = UnknownAction, PreloadedState = S> = keyof PreloadedState extends keyof S ? {\n    [K in keyof S]: Reducer<S[K], A, K extends keyof PreloadedState ? PreloadedState[K] : never>;\n} : never;",
      "doc": "Object whose values correspond to different reducer functions.",
      "tags": [
        {
          "tagName": "template",
          "text": "The combined state of the reducers."
        },
        {
          "tagName": "template",
          "text": "The type of actions the reducers can potentially respond to."
        },
        {
          "tagName": "template",
          "text": "The combined preloaded state of the reducers."
        }
      ]
    },
    {
      "name": "StateFromReducersMapObject",
      "kind": "TypeAliasDeclaration",
      "signature": "type StateFromReducersMapObject<M> = M[keyof M] extends Reducer<any, any, any> | undefined ? {\n    [P in keyof M]: M[P] extends Reducer<infer S, any, any> ? S : never;\n} : never;",
      "doc": "Infer a combined state shape from a `ReducersMapObject`.",
      "tags": [
        {
          "tagName": "template",
          "text": "Object map of reducers as provided to `combineReducers(map: M)`."
        }
      ]
    },
    {
      "name": "Store",
      "kind": "InterfaceDeclaration",
      "signature": "interface Store<S = any, A extends Action = UnknownAction, StateExt extends unknown = unknown> {\n    /**\n     * Dispatches an action. It is the only way to trigger a state change.\n     *\n     * The `reducer` function, used to create the store, will be called with the\n     * current state tree and th",
      "doc": "A store is an object that holds the application's state tree.\nThere should only be a single store in a Redux app, as the composition\nhappens on the reducer level.",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of state held by this store."
        },
        {
          "tagName": "template",
          "text": "the type of actions which may be dispatched by this store."
        },
        {
          "tagName": "template",
          "text": "any extension to state from store enhancers"
        }
      ]
    },
    {
      "name": "StoreCreator",
      "kind": "InterfaceDeclaration",
      "signature": "interface StoreCreator {\n    <S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}>(reducer: Reducer<S, A>, enhancer?: StoreEnhancer<Ext, StateExt>): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;\n    <S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}, PreloadedSta",
      "doc": "A store creator is a function that creates a Redux store. Like with\ndispatching function, we must distinguish the base store creator,\n`createStore(reducer, preloadedState)` exported from the Redux package, from\nstore creators that are returned from the store enhancers.",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of state to be held by the store."
        },
        {
          "tagName": "template",
          "text": "The type of actions which may be dispatched."
        },
        {
          "tagName": "template",
          "text": "The initial state that is passed into the reducer."
        },
        {
          "tagName": "template",
          "text": "Store extension that is mixed in to the Store type."
        },
        {
          "tagName": "template",
          "text": "State extension that is mixed into the state type."
        }
      ]
    },
    {
      "name": "StoreEnhancer",
      "kind": "TypeAliasDeclaration",
      "signature": "type StoreEnhancer<Ext extends {} = {}, StateExt extends {} = {}> = <NextExt extends {}, NextStateExt extends {}>(next: StoreEnhancerStoreCreator<NextExt, NextStateExt>) => StoreEnhancerStoreCreator<NextExt & Ext, NextStateExt & StateExt>;",
      "doc": "A store enhancer is a higher-order function that composes a store creator\nto return a new, enhanced store creator. This is similar to middleware in\nthat it allows you to alter the store interface in a composable way.\n\nStore enhancers are much the same concept as higher-order components in\nReact, which are also occasionally called “component enhancers”.\n\nBecause a store is not an instance, but rather a plain-object collection of\nfunctions, copies can be easily created and modified without mutating the\noriginal store. There is an example in `compose` documentation\ndemonstrating that.\n\nMost likely you'll never write a store enhancer, but you may use the one\nprovided by the developer tools. It is what makes time travel possible\nwithout the app being aware it is happening. Amusingly, the Redux\nmiddleware implementation is itself a store enhancer.",
      "tags": [
        {
          "tagName": "template",
          "text": "Store extension that is mixed into the Store type."
        },
        {
          "tagName": "template",
          "text": "State extension that is mixed into the state type."
        }
      ]
    },
    {
      "name": "StoreEnhancerStoreCreator",
      "kind": "TypeAliasDeclaration",
      "signature": "type StoreEnhancerStoreCreator<Ext extends {} = {}, StateExt extends {} = {}> = <S, A extends Action, PreloadedState>(reducer: Reducer<S, A, PreloadedState>, preloadedState?: PreloadedState | undefined) => Store<S, A, StateExt> & Ext;",
      "doc": "",
      "tags": []
    },
    {
      "name": "UnknownAction",
      "kind": "InterfaceDeclaration",
      "signature": "interface UnknownAction extends Action {\n    [extraProps: string]: unknown;\n}",
      "doc": "An Action type which accepts any other properties.\nThis is mainly for the use of the `Reducer` type.\nThis is not part of `Action` itself to prevent types that extend `Action` from\nhaving an index signature.",
      "tags": []
    },
    {
      "name": "Unsubscribe",
      "kind": "InterfaceDeclaration",
      "signature": "interface Unsubscribe {\n    (): void;\n}",
      "doc": "Function to remove listener added by `Store.subscribe()`.",
      "tags": []
    },
    {
      "name": "__DO_NOT_USE__ActionTypes",
      "kind": "VariableDeclaration",
      "signature": "ActionTypes: {\n    INIT: string;\n    REPLACE: string;\n    PROBE_UNKNOWN_ACTION: () => string;\n}",
      "doc": "",
      "tags": []
    },
    {
      "name": "applyMiddleware",
      "kind": "FunctionDeclaration",
      "signature": "declare function applyMiddleware(): StoreEnhancer;",
      "doc": "Creates a store enhancer that applies middleware to the dispatch method\nof the Redux store. This is handy for a variety of tasks, such as expressing\nasynchronous actions in a concise manner, or logging every action payload.\n\nSee `redux-thunk` package as an example of the Redux middleware.\n\nBecause middleware is potentially asynchronous, this should be the first\nstore enhancer in the composition chain.\n\nNote that each middleware will be given the `dispatch` and `getState` functions\nas named arguments.",
      "tags": [
        {
          "tagName": "param",
          "text": "The middleware chain to be applied."
        },
        {
          "tagName": "returns",
          "text": "A store enhancer applying the middleware."
        },
        {
          "tagName": "template",
          "text": "Dispatch signature added by a middleware."
        },
        {
          "tagName": "template",
          "text": "The type of the state supported by a middleware."
        }
      ]
    },
    {
      "name": "applyMiddleware",
      "kind": "FunctionDeclaration",
      "signature": "declare function applyMiddleware<Ext1, S>(middleware1: Middleware<Ext1, S, any>): StoreEnhancer<{\n    dispatch: Ext1;\n}>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "applyMiddleware",
      "kind": "FunctionDeclaration",
      "signature": "declare function applyMiddleware<Ext1, Ext2, S>(middleware1: Middleware<Ext1, S, any>, middleware2: Middleware<Ext2, S, any>): StoreEnhancer<{\n    dispatch: Ext1 & Ext2;\n}>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "applyMiddleware",
      "kind": "FunctionDeclaration",
      "signature": "declare function applyMiddleware<Ext1, Ext2, Ext3, S>(middleware1: Middleware<Ext1, S, any>, middleware2: Middleware<Ext2, S, any>, middleware3: Middleware<Ext3, S, any>): StoreEnhancer<{\n    dispatch: Ext1 & Ext2 & Ext3;\n}>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "applyMiddleware",
      "kind": "FunctionDeclaration",
      "signature": "declare function applyMiddleware<Ext1, Ext2, Ext3, Ext4, S>(middleware1: Middleware<Ext1, S, any>, middleware2: Middleware<Ext2, S, any>, middleware3: Middleware<Ext3, S, any>, middleware4: Middleware<Ext4, S, any>): StoreEnhancer<{\n    dispatch: Ext1 & Ext2 & Ext3 & Ext4;\n}>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "applyMiddleware",
      "kind": "FunctionDeclaration",
      "signature": "declare function applyMiddleware<Ext1, Ext2, Ext3, Ext4, Ext5, S>(middleware1: Middleware<Ext1, S, any>, middleware2: Middleware<Ext2, S, any>, middleware3: Middleware<Ext3, S, any>, middleware4: Middleware<Ext4, S, any>, middleware5: Middleware<Ext5, S, any>): StoreEnhancer<{\n    dispatch: Ext1 & E",
      "doc": "",
      "tags": []
    },
    {
      "name": "applyMiddleware",
      "kind": "FunctionDeclaration",
      "signature": "declare function applyMiddleware<Ext, S = any>(...middlewares: Middleware<any, S, any>[]): StoreEnhancer<{\n    dispatch: Ext;\n}>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "bindActionCreators",
      "kind": "FunctionDeclaration",
      "signature": "declare function bindActionCreators<A, C extends ActionCreator<A>>(actionCreator: C, dispatch: Dispatch): C;",
      "doc": "Turns an object whose values are action creators, into an object with the\nsame keys, but with every function wrapped into a `dispatch` call so they\nmay be invoked directly. This is just a convenience method, as you can call\n`store.dispatch(MyActionCreators.doSomething())` yourself just fine.\n\nFor convenience, you can also pass an action creator as the first argument,\nand get a dispatch wrapped function in return.",
      "tags": [
        {
          "tagName": "param",
          "text": "An object whose values are action\ncreator functions. One handy way to obtain it is to use `import * as`\nsyntax. You may also pass a single function."
        },
        {
          "tagName": "param",
          "text": "The `dispatch` function available on your Redux\nstore."
        },
        {
          "tagName": "returns",
          "text": "The object mimicking the original object, but with\nevery action creator wrapped into the `dispatch` call. If you passed a\nfunction as `actionCreators`, the return value will also be a single\nfunction."
        }
      ]
    },
    {
      "name": "bindActionCreators",
      "kind": "FunctionDeclaration",
      "signature": "declare function bindActionCreators<A extends ActionCreator<any>, B extends ActionCreator<any>>(actionCreator: A, dispatch: Dispatch): B;",
      "doc": "",
      "tags": []
    },
    {
      "name": "bindActionCreators",
      "kind": "FunctionDeclaration",
      "signature": "declare function bindActionCreators<A, M extends ActionCreatorsMapObject<A>>(actionCreators: M, dispatch: Dispatch): M;",
      "doc": "",
      "tags": []
    },
    {
      "name": "bindActionCreators",
      "kind": "FunctionDeclaration",
      "signature": "declare function bindActionCreators<M extends ActionCreatorsMapObject, N extends ActionCreatorsMapObject>(actionCreators: M, dispatch: Dispatch): N;",
      "doc": "",
      "tags": []
    },
    {
      "name": "combineReducers",
      "kind": "FunctionDeclaration",
      "signature": "declare function combineReducers<M>(reducers: M): M[keyof M] extends Reducer<any, any, any> | undefined ? Reducer<StateFromReducersMapObject<M>, ActionFromReducersMapObject<M>, Partial<PreloadedStateShapeFromReducersMapObject<M>>> : never;",
      "doc": "Turns an object whose values are different reducer functions, into a single\nreducer function. It will call every child reducer, and gather their results\ninto a single state object, whose keys correspond to the keys of the passed\nreducer functions.",
      "tags": [
        {
          "tagName": "template",
          "text": "Combined state object type."
        },
        {
          "tagName": "param",
          "text": "An object whose values correspond to different reducer\nfunctions that need to be combined into one. One handy way to obtain it\nis to use `import * as reducers` syntax. The reducers may never\nreturn undefined for any action. Instead, they should return their\ninitial state if the state passed to them was undefined, and the current\nstate for any unrecognized action."
        },
        {
          "tagName": "returns",
          "text": "A reducer function that invokes every reducer inside the passed\nobject, and builds a state object with the same shape."
        }
      ]
    },
    {
      "name": "compose",
      "kind": "FunctionDeclaration",
      "signature": "declare function compose(): <R>(a: R) => R;",
      "doc": "Composes single-argument functions from right to left. The rightmost\nfunction can take multiple arguments as it provides the signature for the\nresulting composite function.",
      "tags": [
        {
          "tagName": "param",
          "text": "The functions to compose."
        },
        {
          "tagName": "returns",
          "text": "A function obtained by composing the argument functions from right\nto left. For example, `compose(f, g, h)` is identical to doing\n`(...args) => f(g(h(...args)))`."
        }
      ]
    },
    {
      "name": "compose",
      "kind": "FunctionDeclaration",
      "signature": "declare function compose<F extends Function>(f: F): F;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.apply",
      "kind": "MethodSignature",
      "signature": "apply(this:Function,thisArg:any,argArray?:any):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.call",
      "kind": "MethodSignature",
      "signature": "call(this:Function,thisArg:any,...argArray:any[]):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.bind",
      "kind": "MethodSignature",
      "signature": "bind(this:Function,thisArg:any,...argArray:any[]):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.toString",
      "kind": "MethodSignature",
      "signature": "toString():string;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.prototype",
      "kind": "PropertySignature",
      "signature": "prototype:any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.length",
      "kind": "PropertySignature",
      "signature": "readonly length:number;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.arguments",
      "kind": "PropertySignature",
      "signature": "arguments:any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose.caller",
      "kind": "PropertySignature",
      "signature": "caller:Function;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose",
      "kind": "FunctionDeclaration",
      "signature": "declare function compose<A, T extends any[], R>(f1: (a: A) => R, f2: Func<T, A>): Func<T, R>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose",
      "kind": "FunctionDeclaration",
      "signature": "declare function compose<A, B, T extends any[], R>(f1: (b: B) => R, f2: (a: A) => B, f3: Func<T, A>): Func<T, R>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose",
      "kind": "FunctionDeclaration",
      "signature": "declare function compose<A, B, C, T extends any[], R>(f1: (c: C) => R, f2: (b: B) => C, f3: (a: A) => B, f4: Func<T, A>): Func<T, R>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose",
      "kind": "FunctionDeclaration",
      "signature": "declare function compose<R>(f1: (a: any) => R, ...funcs: Function[]): (...args: any[]) => R;",
      "doc": "",
      "tags": []
    },
    {
      "name": "compose",
      "kind": "FunctionDeclaration",
      "signature": "declare function compose<R>(...funcs: Function[]): (...args: any[]) => R;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createStore",
      "kind": "FunctionDeclaration",
      "signature": "declare function createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}>(reducer: Reducer<S, A>, enhancer?: StoreEnhancer<Ext, StateExt>): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "**We recommend using the `configureStore` method\nof the `@reduxjs/toolkit` package**, which replaces `createStore`.\n\nRedux Toolkit is our recommended approach for writing Redux logic today,\nincluding store setup, reducers, data fetching, and more.\n\n**For more details, please read this Redux docs page:**\n**https://redux.js.org/introduction/why-rtk-is-redux-today**\n\n`configureStore` from Redux Toolkit is an improved version of `createStore` that\nsimplifies setup and helps avoid common bugs.\n\nYou should not be using the `redux` core package by itself today, except for learning purposes.\nThe `createStore` method from the core `redux` package will not be removed, but we encourage\nall users to migrate to using Redux Toolkit for all Redux code.\n\nIf you want to use `createStore` without this visual deprecation warning, use\nthe `legacy_createStore` import instead:\n\n`import { legacy_createStore as createStore} from 'redux'`"
        }
      ]
    },
    {
      "name": "createStore",
      "kind": "FunctionDeclaration",
      "signature": "declare function createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}, PreloadedState = S>(reducer: Reducer<S, A, PreloadedState>, preloadedState?: PreloadedState | undefined, enhancer?: StoreEnhancer<Ext, StateExt>): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "**We recommend using the `configureStore` method\nof the `@reduxjs/toolkit` package**, which replaces `createStore`.\n\nRedux Toolkit is our recommended approach for writing Redux logic today,\nincluding store setup, reducers, data fetching, and more.\n\n**For more details, please read this Redux docs page:**\n**https://redux.js.org/introduction/why-rtk-is-redux-today**\n\n`configureStore` from Redux Toolkit is an improved version of `createStore` that\nsimplifies setup and helps avoid common bugs.\n\nYou should not be using the `redux` core package by itself today, except for learning purposes.\nThe `createStore` method from the core `redux` package will not be removed, but we encourage\nall users to migrate to using Redux Toolkit for all Redux code.\n\nIf you want to use `createStore` without this visual deprecation warning, use\nthe `legacy_createStore` import instead:\n\n`import { legacy_createStore as createStore} from 'redux'`"
        }
      ]
    },
    {
      "name": "isAction",
      "kind": "FunctionDeclaration",
      "signature": "declare function isAction(action: unknown): action is Action<string>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "isPlainObject",
      "kind": "FunctionDeclaration",
      "signature": "declare function isPlainObject(obj: any): obj is object;",
      "doc": "",
      "tags": [
        {
          "tagName": "param",
          "text": "The object to inspect."
        },
        {
          "tagName": "returns",
          "text": "True if the argument appears to be a plain object."
        }
      ]
    },
    {
      "name": "legacy_createStore",
      "kind": "FunctionDeclaration",
      "signature": "declare function legacy_createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}>(reducer: Reducer<S, A>, enhancer?: StoreEnhancer<Ext, StateExt>): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;",
      "doc": "Creates a Redux store that holds the state tree.\n\n**We recommend using `configureStore` from the\n`@reduxjs/toolkit` package**, which replaces `createStore`:\n**https://redux.js.org/introduction/why-rtk-is-redux-today**\n\nThe only way to change the data in the store is to call `dispatch()` on it.\n\nThere should only be a single store in your app. To specify how different\nparts of the state tree respond to actions, you may combine several reducers\ninto a single reducer function by using `combineReducers`.",
      "tags": [
        {
          "tagName": "param",
          "text": "A function that returns the next state tree, given\nthe current state tree and the action to handle."
        },
        {
          "tagName": "param",
          "text": "The initial state. You may optionally specify it\nto hydrate the state from the server in universal apps, or to restore a\npreviously serialized user session.\nIf you use `combineReducers` to produce the root reducer function, this must be\nan object with the same shape as `combineReducers` keys."
        },
        {
          "tagName": "param",
          "text": "The store enhancer. You may optionally specify it\nto enhance the store with third-party capabilities such as middleware,\ntime travel, persistence, etc. The only store enhancer that ships with Redux\nis `applyMiddleware()`."
        },
        {
          "tagName": "returns",
          "text": "A Redux store that lets you read the state, dispatch actions\nand subscribe to changes."
        }
      ]
    },
    {
      "name": "legacy_createStore",
      "kind": "FunctionDeclaration",
      "signature": "declare function legacy_createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}, PreloadedState = S>(reducer: Reducer<S, A, PreloadedState>, preloadedState?: PreloadedState | undefined, enhancer?: StoreEnhancer<Ext, StateExt>): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext",
      "doc": "Creates a Redux store that holds the state tree.\n\n**We recommend using `configureStore` from the\n`@reduxjs/toolkit` package**, which replaces `createStore`:\n**https://redux.js.org/introduction/why-rtk-is-redux-today**\n\nThe only way to change the data in the store is to call `dispatch()` on it.\n\nThere should only be a single store in your app. To specify how different\nparts of the state tree respond to actions, you may combine several reducers\ninto a single reducer function by using `combineReducers`.",
      "tags": [
        {
          "tagName": "param",
          "text": "A function that returns the next state tree, given\nthe current state tree and the action to handle."
        },
        {
          "tagName": "param",
          "text": "The initial state. You may optionally specify it\nto hydrate the state from the server in universal apps, or to restore a\npreviously serialized user session.\nIf you use `combineReducers` to produce the root reducer function, this must be\nan object with the same shape as `combineReducers` keys."
        },
        {
          "tagName": "param",
          "text": "The store enhancer. You may optionally specify it\nto enhance the store with third-party capabilities such as middleware,\ntime travel, persistence, etc. The only store enhancer that ships with Redux\nis `applyMiddleware()`."
        },
        {
          "tagName": "returns",
          "text": "A Redux store that lets you read the state, dispatch actions\nand subscribe to changes."
        }
      ]
    }
  ]
}


---

### 4. Step‑by‑Step Instructions

1. **Read & Understand the Spec**
   Parse `<OPEN_AGENT_SPEC>` to internalise every required field and section.

2. **Analyse the API Documentation**
   Skim `<API_DOCUMENTATION>` to grasp the library’s purpose, major modules, and common workflows.

3. **Populate the `meta` Block**

   * `spec_name` → kebab/slash‑case library id.
   * `spec_version` → start at `0.1.0`.
   * `generated` → today’s date (UTC, `YYYY‑MM‑DD`).
   * `purpose` → one‑paragraph mission for an AI assistant using this library.
   * `guiding_principles` → 3‑10 actionable rules (modern patterns, performance, safety…).
   * `design_notes` → brief explanation of how you structured the pack and key sources cited.

4. **Create Logical `groups`**
   Identify coherent clusters of exports (e.g., “Hooks”, “Authentication”, “Query Builders”).
   For each group:

   * `name` – descriptive heading.
   * `exports` – list each symbol exactly once across all groups.

5. **Define Each `symbol`**
   Within every group’s `symbols` map, add an entry for each export containing:

   * `summary` – one‑sentence purpose.
   * `guidance` – ≥ 2 bullet tips (best practices, pitfalls).
   * `example` – minimal, runnable snippet (include imports).
   * *Optional* `ai_support` – common developer questions.

6. **Add Optional Library‑Wide Sections** (only if meaningful information exists):

   * `common_workflows` – step‑by‑step recipes.
   * `troubleshooting_cheatsheet` – symptom → cause → fix table.
   * `faq` – concise Q/A pairs.
   * `external_resources` – labelled HTTPS links.

7. **Validate Internally**
   Ensure:

   * All exports listed in `exports` have matching `symbols` entries.
   * No duplicate exports across groups.
   * YAML is syntactically correct and matches the spec.

8. **Output**
   Print the **YAML content only**—no surrounding Markdown, no commentary.

---

### 5. Strict Output Constraints

* **Format:** Pure YAML.
* **No extra text** before or after the YAML.
* **Adherence:** Must satisfy all `required` fields and schema rules in `<OPEN_AGENT_SPEC>`.

---

### 6. Tips for High‑Quality Output

* **Prefer actionable guidance over encyclopaedic description.**
* **Ensure every code example is runnable and self‑contained.**
* **Cross‑link related symbols in guidance to help LLMs give holistic answers.**

---

*End of master prompt.*
