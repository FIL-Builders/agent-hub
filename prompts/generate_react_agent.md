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
      "name": "createElement",
      "kind": "FunctionDeclaration",
      "signature": "function createElement(\n        type: \"input\",\n        props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null,\n        ...children: ReactNode[]\n    ): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.type",
      "kind": "PropertySignature",
      "signature": "type: HTMLElementType;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "createElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement",
      "kind": "FunctionDeclaration",
      "signature": "function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(\n        type: HTMLElementType,\n        props?: ClassAttributes<T> & P | null,\n        ...children: ReactNode[]\n    ): DetailedReactHTMLElement<P, T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.type",
      "kind": "PropertySignature",
      "signature": "type: HTMLElementType;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "createElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement",
      "kind": "FunctionDeclaration",
      "signature": "function createElement<P extends SVGAttributes<T>, T extends SVGElement>(\n        type: SVGElementType,\n        props?: ClassAttributes<T> & P | null,\n        ...children: ReactNode[]\n    ): ReactSVGElement;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.type",
      "kind": "PropertySignature",
      "signature": "type: SVGElementType;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "createElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement",
      "kind": "FunctionDeclaration",
      "signature": "function createElement<P extends DOMAttributes<T>, T extends Element>(\n        type: string,\n        props?: ClassAttributes<T> & P | null,\n        ...children: ReactNode[]\n    ): DOMElement<P, T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "createElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement",
      "kind": "FunctionDeclaration",
      "signature": "function createElement<P extends {}>(\n        type: FunctionComponent<P>,\n        props?: Attributes & P | null,\n        ...children: ReactNode[]\n    ): FunctionComponentElement<P>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.ref",
      "kind": "PropertySignature",
      "signature": "ref?: (\"ref\" extends keyof P ? P extends { ref?: infer R | undefined } ? R : never : never) | undefined;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "createElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement",
      "kind": "FunctionDeclaration",
      "signature": "function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(\n        type: ClassType<P, T, C>,\n        props?: ClassAttributes<T> & P | null,\n        ...children: ReactNode[]\n    ): CElement<P, T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.ref",
      "kind": "PropertySignature",
      "signature": "ref?: Ref<T> | undefined;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "createElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement",
      "kind": "FunctionDeclaration",
      "signature": "function createElement<P extends {}>(\n        type: FunctionComponent<P> | ComponentClass<P> | string,\n        props?: Attributes & P | null,\n        ...children: ReactNode[]\n    ): ReactElement<P>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement",
      "kind": "FunctionDeclaration",
      "signature": "function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(\n        element: DetailedReactHTMLElement<P, T>,\n        props?: P,\n        ...children: ReactNode[]\n    ): DetailedReactHTMLElement<P, T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.type",
      "kind": "PropertySignature",
      "signature": "type: HTMLElementType;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "cloneElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement",
      "kind": "FunctionDeclaration",
      "signature": "function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(\n        element: ReactHTMLElement<T>,\n        props?: P,\n        ...children: ReactNode[]\n    ): ReactHTMLElement<T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.type",
      "kind": "PropertySignature",
      "signature": "type: HTMLElementType;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "cloneElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement",
      "kind": "FunctionDeclaration",
      "signature": "function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(\n        element: ReactSVGElement,\n        props?: P,\n        ...children: ReactNode[]\n    ): ReactSVGElement;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.type",
      "kind": "PropertySignature",
      "signature": "type: SVGElementType;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "cloneElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement",
      "kind": "FunctionDeclaration",
      "signature": "function cloneElement<P extends DOMAttributes<T>, T extends Element>(\n        element: DOMElement<P, T>,\n        props?: DOMAttributes<T> & P,\n        ...children: ReactNode[]\n    ): DOMElement<P, T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.ref",
      "kind": "PropertySignature",
      "signature": "ref: Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "cloneElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement",
      "kind": "FunctionDeclaration",
      "signature": "function cloneElement<P>(\n        element: FunctionComponentElement<P>,\n        props?: Partial<P> & Attributes,\n        ...children: ReactNode[]\n    ): FunctionComponentElement<P>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.ref",
      "kind": "PropertySignature",
      "signature": "ref?: (\"ref\" extends keyof P ? P extends { ref?: infer R | undefined } ? R : never : never) | undefined;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "cloneElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement",
      "kind": "FunctionDeclaration",
      "signature": "function cloneElement<P, T extends Component<P, ComponentState>>(\n        element: CElement<P, T>,\n        props?: Partial<P> & ClassAttributes<T>,\n        ...children: ReactNode[]\n    ): CElement<P, T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.ref",
      "kind": "PropertySignature",
      "signature": "ref?: Ref<T> | undefined;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `element.props.ref` instead."
        }
      ]
    },
    {
      "name": "cloneElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement",
      "kind": "FunctionDeclaration",
      "signature": "function cloneElement<P>(\n        element: ReactElement<P>,\n        props?: Partial<P> & Attributes,\n        ...children: ReactNode[]\n    ): ReactElement<P>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.type",
      "kind": "PropertySignature",
      "signature": "type: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.props",
      "kind": "PropertySignature",
      "signature": "props: P;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cloneElement.key",
      "kind": "PropertySignature",
      "signature": "key: string | null;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createContext",
      "kind": "FunctionDeclaration",
      "signature": "function createContext<T>(\n        // If you thought this should be optional, see\n        // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106\n        defaultValue: T,\n    ): Context<T>;",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "param",
          "text": "The value you want the context to have when there is no matching\n{@link Provider} in the tree above the component reading the context. This is meant\nas a \"last resort\" fallback."
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/createContext#reference React Docs}"
        },
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "example",
          "text": "```tsx\nimport { createContext } from 'react';\n\nconst ThemeContext = createContext('light');\nfunction App() {\n  return (\n    <ThemeContext value=\"dark\">\n      <Toolbar />\n    </ThemeContext>\n  );\n}\n```"
        }
      ]
    },
    {
      "name": "createContext.Provider",
      "kind": "PropertySignature",
      "signature": "Provider: Provider<T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createContext.Consumer",
      "kind": "PropertySignature",
      "signature": "Consumer: Consumer<T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createContext.displayName",
      "kind": "PropertySignature",
      "signature": "displayName?: string | undefined;",
      "doc": "Used in debugging messages. You might want to set it\nexplicitly if you want to display a different name for\ndebugging purposes.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}"
        }
      ]
    },
    {
      "name": "createContext.$$typeof",
      "kind": "PropertySignature",
      "signature": "readonly $$typeof: symbol;",
      "doc": "",
      "tags": []
    },
    {
      "name": "isValidElement",
      "kind": "FunctionDeclaration",
      "signature": "function isValidElement<P>(object: {} | null | undefined): object is ReactElement<P>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createRef",
      "kind": "FunctionDeclaration",
      "signature": "function createRef<T>(): RefObject<T | null>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "createRef.current",
      "kind": "PropertySignature",
      "signature": "current: T;",
      "doc": "The current value of the ref.",
      "tags": []
    },
    {
      "name": "forwardRef",
      "kind": "FunctionDeclaration",
      "signature": "function forwardRef<T, P = {}>(\n        render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>,\n    ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;",
      "doc": "Lets your component expose a DOM node to a parent component\nusing a ref.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/forwardRef React Docs}"
        },
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "param",
          "text": "See the {@link ForwardRefRenderFunction}."
        },
        {
          "tagName": "template",
          "text": "The type of the DOM node."
        },
        {
          "tagName": "template",
          "text": "The props the component accepts, if any."
        },
        {
          "tagName": "example",
          "text": "```tsx\ninterface Props {\n  children?: ReactNode;\n  type: \"submit\" | \"button\";\n}\n\nexport const FancyButton = forwardRef<HTMLButtonElement, Props>((props, ref) => (\n  <button ref={ref} className=\"MyClassName\" type={props.type}>\n    {props.children}\n  </button>\n));\n```"
        }
      ]
    },
    {
      "name": "forwardRef.propTypes",
      "kind": "PropertySignature",
      "signature": "propTypes?: any;",
      "doc": "Ignored by React.",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Only kept in types for backwards compatibility. Will be removed in a future major release."
        }
      ]
    },
    {
      "name": "forwardRef.displayName",
      "kind": "PropertySignature",
      "signature": "displayName?: string | undefined;",
      "doc": "Used in debugging messages. You might want to set it\nexplicitly if you want to display a different name for\ndebugging purposes.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}"
        }
      ]
    },
    {
      "name": "forwardRef.$$typeof",
      "kind": "PropertySignature",
      "signature": "readonly $$typeof: symbol;",
      "doc": "",
      "tags": []
    },
    {
      "name": "memo",
      "kind": "FunctionDeclaration",
      "signature": "function memo<P extends object>(\n        Component: FunctionComponent<P>,\n        propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,\n    ): NamedExoticComponent<P>;",
      "doc": "Lets you skip re-rendering a component when its props are unchanged.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/memo React Docs}"
        },
        {
          "tagName": "param",
          "text": "The component to memoize."
        },
        {
          "tagName": "param",
          "text": "A function that will be used to determine if the props have changed."
        },
        {
          "tagName": "example",
          "text": "```tsx\nimport { memo } from 'react';\n\nconst SomeComponent = memo(function SomeComponent(props: { foo: string }) {\n  // ...\n});\n```"
        }
      ]
    },
    {
      "name": "memo.displayName",
      "kind": "PropertySignature",
      "signature": "displayName?: string | undefined;",
      "doc": "Used in debugging messages. You might want to set it\nexplicitly if you want to display a different name for\ndebugging purposes.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}"
        }
      ]
    },
    {
      "name": "memo.$$typeof",
      "kind": "PropertySignature",
      "signature": "readonly $$typeof: symbol;",
      "doc": "",
      "tags": []
    },
    {
      "name": "memo",
      "kind": "FunctionDeclaration",
      "signature": "function memo<T extends ComponentType<any>>(\n        Component: T,\n        propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean,\n    ): MemoExoticComponent<T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "lazy",
      "kind": "FunctionDeclaration",
      "signature": "function lazy<T extends ComponentType<any>>(\n        load: () => Promise<{ default: T }>,\n    ): LazyExoticComponent<T>;",
      "doc": "Lets you defer loading a component’s code until it is rendered for the first time.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/lazy React Docs}"
        },
        {
          "tagName": "param",
          "text": "A function that returns a `Promise` or another thenable (a `Promise`-like object with a\nthen method). React will not call `load` until the first time you attempt to render the returned\ncomponent. After React first calls load, it will wait for it to resolve, and then render the\nresolved value’s `.default` as a React component. Both the returned `Promise` and the `Promise`’s\nresolved value will be cached, so React will not call load more than once. If the `Promise` rejects,\nReact will throw the rejection reason for the nearest Error Boundary to handle."
        },
        {
          "tagName": "example",
          "text": "```tsx\nimport { lazy } from 'react';\n\nconst MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));\n```"
        }
      ]
    },
    {
      "name": "lazy._result",
      "kind": "PropertySignature",
      "signature": "readonly _result: T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "lazy.$$typeof",
      "kind": "PropertySignature",
      "signature": "readonly $$typeof: symbol;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useContext",
      "kind": "FunctionDeclaration",
      "signature": "function useContext<T>(context: Context<T> /*, (not public API) observedBits?: number|boolean */): T;",
      "doc": "Accepts a context object (the value returned from `React.createContext`) and returns the current\ncontext value, as given by the nearest context provider for the given context.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useContext}"
        }
      ]
    },
    {
      "name": "useState",
      "kind": "FunctionDeclaration",
      "signature": "function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];",
      "doc": "Returns a stateful value, and a function to update it.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useState}"
        }
      ]
    },
    {
      "name": "useState",
      "kind": "FunctionDeclaration",
      "signature": "function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];",
      "doc": "Returns a stateful value, and a function to update it.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useState}"
        }
      ]
    },
    {
      "name": "useReducer",
      "kind": "FunctionDeclaration",
      "signature": "function useReducer<S, A extends AnyActionArg>(\n        reducer: (prevState: S, ...args: A) => S,\n        initialState: S,\n    ): [S, ActionDispatch<A>];",
      "doc": "An alternative to `useState`.\n\n`useReducer` is usually preferable to `useState` when you have complex state logic that involves\nmultiple sub-values. It also lets you optimize performance for components that trigger deep\nupdates because you can pass `dispatch` down instead of callbacks.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useReducer}"
        }
      ]
    },
    {
      "name": "useReducer",
      "kind": "FunctionDeclaration",
      "signature": "function useReducer<S, I, A extends AnyActionArg>(\n        reducer: (prevState: S, ...args: A) => S,\n        initialArg: I,\n        init: (i: I) => S,\n    ): [S, ActionDispatch<A>];",
      "doc": "An alternative to `useState`.\n\n`useReducer` is usually preferable to `useState` when you have complex state logic that involves\nmultiple sub-values. It also lets you optimize performance for components that trigger deep\nupdates because you can pass `dispatch` down instead of callbacks.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useReducer}"
        }
      ]
    },
    {
      "name": "useRef",
      "kind": "FunctionDeclaration",
      "signature": "function useRef<T>(initialValue: T): RefObject<T>;",
      "doc": "`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument\n(`initialValue`). The returned object will persist for the full lifetime of the component.\n\nNote that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable\nvalue around similar to how you’d use instance fields in classes.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useRef}"
        }
      ]
    },
    {
      "name": "useRef.current",
      "kind": "PropertySignature",
      "signature": "current: T;",
      "doc": "The current value of the ref.",
      "tags": []
    },
    {
      "name": "useRef",
      "kind": "FunctionDeclaration",
      "signature": "function useRef<T>(initialValue: T | null): RefObject<T | null>;",
      "doc": "`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument\n(`initialValue`). The returned object will persist for the full lifetime of the component.\n\nNote that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable\nvalue around similar to how you’d use instance fields in classes.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useRef}"
        }
      ]
    },
    {
      "name": "useRef.current",
      "kind": "PropertySignature",
      "signature": "current: T;",
      "doc": "The current value of the ref.",
      "tags": []
    },
    {
      "name": "useRef",
      "kind": "FunctionDeclaration",
      "signature": "function useRef<T>(initialValue: T | undefined): RefObject<T | undefined>;",
      "doc": "`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument\n(`initialValue`). The returned object will persist for the full lifetime of the component.\n\nNote that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable\nvalue around similar to how you’d use instance fields in classes.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useRef}"
        }
      ]
    },
    {
      "name": "useRef.current",
      "kind": "PropertySignature",
      "signature": "current: T;",
      "doc": "The current value of the ref.",
      "tags": []
    },
    {
      "name": "useLayoutEffect",
      "kind": "FunctionDeclaration",
      "signature": "function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;",
      "doc": "The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.\nUse this to read layout from the DOM and synchronously re-render. Updates scheduled inside\n`useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.\n\nPrefer the standard `useEffect` when possible to avoid blocking visual updates.\n\nIf you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as\n`componentDidMount` and `componentDidUpdate`.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useLayoutEffect}"
        }
      ]
    },
    {
      "name": "useEffect",
      "kind": "FunctionDeclaration",
      "signature": "function useEffect(effect: EffectCallback, deps?: DependencyList): void;",
      "doc": "Accepts a function that contains imperative, possibly effectful code.",
      "tags": [
        {
          "tagName": "param",
          "text": "Imperative function that can return a cleanup function"
        },
        {
          "tagName": "param",
          "text": "If present, effect will only activate if the values in the list change."
        },
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useEffect}"
        }
      ]
    },
    {
      "name": "useImperativeHandle",
      "kind": "FunctionDeclaration",
      "signature": "function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;",
      "doc": "`useImperativeHandle` customizes the instance value that is exposed to parent components when using\n`ref`. As always, imperative code using refs should be avoided in most cases.\n\n`useImperativeHandle` should be used with `React.forwardRef`.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useImperativeHandle}"
        }
      ]
    },
    {
      "name": "useCallback",
      "kind": "FunctionDeclaration",
      "signature": "function useCallback<T extends Function>(callback: T, deps: DependencyList): T;",
      "doc": "`useCallback` will return a memoized version of the callback that only changes if one of the `inputs`\nhas changed.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useCallback}"
        }
      ]
    },
    {
      "name": "useCallback.apply",
      "kind": "MethodSignature",
      "signature": "apply(this:Function,thisArg:any,argArray?:any):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useCallback.call",
      "kind": "MethodSignature",
      "signature": "call(this:Function,thisArg:any,...argArray:any[]):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useCallback.bind",
      "kind": "MethodSignature",
      "signature": "bind(this:Function,thisArg:any,...argArray:any[]):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useCallback.toString",
      "kind": "MethodSignature",
      "signature": "toString():string;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useCallback.prototype",
      "kind": "PropertySignature",
      "signature": "prototype:any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useCallback.length",
      "kind": "PropertySignature",
      "signature": "readonly length:number;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useCallback.arguments",
      "kind": "PropertySignature",
      "signature": "arguments:any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useCallback.caller",
      "kind": "PropertySignature",
      "signature": "caller:Function;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useMemo",
      "kind": "FunctionDeclaration",
      "signature": "function useMemo<T>(factory: () => T, deps: DependencyList): T;",
      "doc": "`useMemo` will only recompute the memoized value when one of the `deps` has changed.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useMemo}"
        }
      ]
    },
    {
      "name": "useDebugValue",
      "kind": "FunctionDeclaration",
      "signature": "function useDebugValue<T>(value: T, format?: (value: T) => any): void;",
      "doc": "`useDebugValue` can be used to display a label for custom hooks in React DevTools.\n\nNOTE: We don’t recommend adding debug values to every custom hook.\nIt’s most valuable for custom hooks that are part of shared libraries.",
      "tags": [
        {
          "tagName": "version",
          "text": "16.8.0"
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useDebugValue}"
        }
      ]
    },
    {
      "name": "useDeferredValue",
      "kind": "FunctionDeclaration",
      "signature": "export function useDeferredValue<T>(value: T, initialValue?: T): T;",
      "doc": "Returns a deferred version of the value that may “lag behind” it.\n\nThis is commonly used to keep the interface responsive when you have something that renders immediately\nbased on user input and something that needs to wait for a data fetch.\n\nA good example of this is a text input.",
      "tags": [
        {
          "tagName": "param",
          "text": "The value that is going to be deferred"
        },
        {
          "tagName": "param",
          "text": "A value to use during the initial render of a component. If this option is omitted, `useDeferredValue` will not defer during the initial render, because there’s no previous version of `value` that it can render instead."
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useDeferredValue}"
        }
      ]
    },
    {
      "name": "useTransition",
      "kind": "FunctionDeclaration",
      "signature": "export function useTransition(): [boolean, TransitionStartFunction];",
      "doc": "Allows components to avoid undesirable loading states by waiting for content to load\nbefore transitioning to the next screen. It also allows components to defer slower,\ndata fetching updates until subsequent renders so that more crucial updates can be\nrendered immediately.\n\nThe `useTransition` hook returns two values in an array.\n\nThe first is a boolean, React’s way of informing us whether we’re waiting for the transition to finish.\nThe second is a function that takes a callback. We can use it to tell React which state we want to defer.\n\n**If some state update causes a component to suspend, that state update should be wrapped in a transition.**",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/useTransition}"
        }
      ]
    },
    {
      "name": "startTransition",
      "kind": "FunctionDeclaration",
      "signature": "export function startTransition(scope: TransitionFunction): void;",
      "doc": "Similar to `useTransition` but allows uses where hooks are not available.",
      "tags": [
        {
          "tagName": "param",
          "text": "A function which causes state updates that can be deferred."
        }
      ]
    },
    {
      "name": "act",
      "kind": "FunctionDeclaration",
      "signature": "export function act(callback: () => VoidOrUndefinedOnly): void;",
      "doc": "Wrap any code rendering and triggering updates to your components into `act()` calls.\n\nEnsures that the behavior in your tests matches what happens in the browser\nmore closely by executing pending `useEffect`s before returning. This also\nreduces the amount of re-renders done.",
      "tags": [
        {
          "tagName": "param",
          "text": "A synchronous, void callback that will execute as a single, complete React commit."
        },
        {
          "tagName": "see",
          "text": "://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks"
        }
      ]
    },
    {
      "name": "act",
      "kind": "FunctionDeclaration",
      "signature": "export function act<T>(callback: () => T | Promise<T>): Promise<T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "act.then",
      "kind": "MethodSignature",
      "signature": "then<TResult1=T,TResult2=never>(onfulfilled?:((value:T)=>TResult1|PromiseLike<TResult1>)|undefined|null,onrejected?:((reason:any)=>TResult2|PromiseLike<TResult2>)|undefined|null):Promise<TResult1|TResult2>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "act.catch",
      "kind": "MethodSignature",
      "signature": "catch<TResult=never>(onrejected?:((reason:any)=>TResult|PromiseLike<TResult>)|undefined|null):Promise<T|TResult>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useId",
      "kind": "FunctionDeclaration",
      "signature": "export function useId(): string;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useInsertionEffect",
      "kind": "FunctionDeclaration",
      "signature": "export function useInsertionEffect(effect: EffectCallback, deps?: DependencyList): void;",
      "doc": "",
      "tags": [
        {
          "tagName": "param",
          "text": "Imperative function that can return a cleanup function"
        },
        {
          "tagName": "param",
          "text": "If present, effect will only activate if the values in the list change."
        },
        {
          "tagName": "see",
          "text": "{@link https://github.com/facebook/react/pull/21913}"
        }
      ]
    },
    {
      "name": "useSyncExternalStore",
      "kind": "FunctionDeclaration",
      "signature": "export function useSyncExternalStore<Snapshot>(\n        subscribe: (onStoreChange: () => void) => () => void,\n        getSnapshot: () => Snapshot,\n        getServerSnapshot?: () => Snapshot,\n    ): Snapshot;",
      "doc": "",
      "tags": [
        {
          "tagName": "param",
          "text": ""
        },
        {
          "tagName": "param",
          "text": ""
        },
        {
          "tagName": "see",
          "text": "{@link https://github.com/reactwg/react-18/discussions/86}"
        }
      ]
    },
    {
      "name": "useOptimistic",
      "kind": "FunctionDeclaration",
      "signature": "export function useOptimistic<State>(\n        passthrough: State,\n    ): [State, (action: State | ((pendingState: State) => State)) => void];",
      "doc": "",
      "tags": []
    },
    {
      "name": "useOptimistic",
      "kind": "FunctionDeclaration",
      "signature": "export function useOptimistic<State, Action>(\n        passthrough: State,\n        reducer: (state: State, action: Action) => State,\n    ): [State, (action: Action) => void];",
      "doc": "",
      "tags": []
    },
    {
      "name": "use",
      "kind": "FunctionDeclaration",
      "signature": "export function use<T>(usable: Usable<T>): T;",
      "doc": "",
      "tags": []
    },
    {
      "name": "useActionState",
      "kind": "FunctionDeclaration",
      "signature": "export function useActionState<State>(\n        action: (state: Awaited<State>) => State | Promise<State>,\n        initialState: Awaited<State>,\n        permalink?: string,\n    ): [state: Awaited<State>, dispatch: () => void, isPending: boolean];",
      "doc": "",
      "tags": []
    },
    {
      "name": "useActionState",
      "kind": "FunctionDeclaration",
      "signature": "export function useActionState<State, Payload>(\n        action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,\n        initialState: Awaited<State>,\n        permalink?: string,\n    ): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean];",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache",
      "kind": "FunctionDeclaration",
      "signature": "export function cache<CachedFunction extends Function>(fn: CachedFunction): CachedFunction;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.apply",
      "kind": "MethodSignature",
      "signature": "apply(this:Function,thisArg:any,argArray?:any):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.call",
      "kind": "MethodSignature",
      "signature": "call(this:Function,thisArg:any,...argArray:any[]):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.bind",
      "kind": "MethodSignature",
      "signature": "bind(this:Function,thisArg:any,...argArray:any[]):any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.toString",
      "kind": "MethodSignature",
      "signature": "toString():string;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.prototype",
      "kind": "PropertySignature",
      "signature": "prototype:any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.length",
      "kind": "PropertySignature",
      "signature": "readonly length:number;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.arguments",
      "kind": "PropertySignature",
      "signature": "arguments:any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "cache.caller",
      "kind": "PropertySignature",
      "signature": "caller:Function;",
      "doc": "",
      "tags": []
    },
    {
      "name": "captureOwnerStack",
      "kind": "FunctionDeclaration",
      "signature": "function captureOwnerStack(): string | null;",
      "doc": "Warning: Only available in development builds.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/captureOwnerStack Reference docs}"
        }
      ]
    },
    {
      "name": "ElementType",
      "kind": "TypeAliasDeclaration",
      "signature": "type ElementType<P = any, Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements> =\n        | { [K in Tag]: P extends JSX.IntrinsicElements[K] ? K : never }[Tag]\n        | ComponentType<P>;",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The props to match against. If not passed, defaults to any."
        },
        {
          "tagName": "template",
          "text": "An optional tag to match against. If not passed, attempts to match against all possible tags."
        },
        {
          "tagName": "example",
          "text": "```tsx\n// All components and tags (img, embed etc.)\n// which accept `src`\ntype SrcComponents = ElementType<{ src: any }>;\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// All components\ntype AllComponents = ElementType;\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// All custom components which match `src`, and tags which\n// match `src`, narrowed down to just `audio` and `embed`\ntype SrcComponents = ElementType<{ src: any }, 'audio' | 'embed'>;\n```"
        }
      ]
    },
    {
      "name": "ComponentType",
      "kind": "TypeAliasDeclaration",
      "signature": "type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        },
        {
          "tagName": "see",
          "text": "{@link ComponentClass}"
        },
        {
          "tagName": "see",
          "text": "{@link FunctionComponent}"
        }
      ]
    },
    {
      "name": "JSXElementConstructor",
      "kind": "TypeAliasDeclaration",
      "signature": "type JSXElementConstructor<P> =\n        | ((\n            props: P,\n        ) => ReactNode | Promise<ReactNode>)\n        // constructor signature must match React.Component\n        | (new(props: P, context: any) => Component<any, any>);",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        }
      ]
    },
    {
      "name": "RefObject",
      "kind": "InterfaceDeclaration",
      "signature": "interface RefObject<T> {\n        /**\n         * The current value of the ref.\n         */\n        current: T;\n    }",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of the ref's value."
        },
        {
          "tagName": "example",
          "text": "```tsx\nconst ref = createRef<HTMLDivElement>();\n\nref.current = document.createElement('div'); // Error\n```"
        }
      ]
    },
    {
      "name": "DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES",
      "kind": "InterfaceDeclaration",
      "signature": "interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES {\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "RefCallback",
      "kind": "TypeAliasDeclaration",
      "signature": "type RefCallback<T> = {\n        bivarianceHack(\n            instance: T | null,\n        ):\n            | void\n            | (() => VoidOrUndefinedOnly)\n            | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[\n                keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_",
      "doc": "A callback fired whenever the ref's value changes.",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of the ref's value."
        },
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react-dom/components/common#ref-callback React Docs}"
        },
        {
          "tagName": "example",
          "text": "```tsx\n<div ref={(node) => console.log(node)} />\n```"
        }
      ]
    },
    {
      "name": "Ref",
      "kind": "TypeAliasDeclaration",
      "signature": "type Ref<T> = RefCallback<T> | RefObject<T | null> | null;",
      "doc": "A union type of all possible shapes for React refs.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link RefCallback}"
        },
        {
          "tagName": "see",
          "text": "{@link RefObject}"
        }
      ]
    },
    {
      "name": "LegacyRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type LegacyRef<T> = Ref<T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `Ref` instead. String refs are no longer supported.\nIf you're typing a library with support for React versions with string refs, use `RefAttributes<T>['ref']` instead."
        }
      ]
    },
    {
      "name": "ElementRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type ElementRef<\n        C extends\n            | ForwardRefExoticComponent<any>\n            | { new(props: any, context: any): Component<any> }\n            | ((props: any) => ReactNode)\n            | keyof JSX.IntrinsicElements,\n    > = ComponentRef<C>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `ComponentRef<T>` instead\n\nRetrieves the type of the 'ref' prop for a given component type or tag name."
        },
        {
          "tagName": "template",
          "text": "The component type."
        },
        {
          "tagName": "example",
          "text": "```tsx\ntype MyComponentRef = React.ElementRef<typeof MyComponent>;\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\ntype DivRef = React.ElementRef<'div'>;\n```"
        }
      ]
    },
    {
      "name": "ComponentState",
      "kind": "TypeAliasDeclaration",
      "signature": "type ComponentState = any;",
      "doc": "",
      "tags": []
    },
    {
      "name": "Key",
      "kind": "TypeAliasDeclaration",
      "signature": "type Key = string | number | bigint;",
      "doc": "A value which uniquely identifies a node among items in an array.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key React Docs}"
        }
      ]
    },
    {
      "name": "Attributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface Attributes {\n        key?: Key | null | undefined;\n    }",
      "doc": "",
      "tags": [
        {
          "tagName": "internal",
          "text": "The props any component can receive.\nYou don't have to add this type. All components automatically accept these props.\n```tsx\nconst Component = () => <div />;\n<Component key=\"one\" />\n```\n\nWARNING: The implementation of a component will never have access to these attributes.\nThe following example would be incorrect usage because {@link Component} would never have access to `key`:\n```tsx\nconst Component = (props: React.Attributes) => props.key;\n```"
        }
      ]
    },
    {
      "name": "RefAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface RefAttributes<T> extends Attributes {\n        /**\n         * Allows getting a ref to the component instance.\n         * Once the component unmounts, React will set `ref.current` to `null`\n         * (or call the ref with `null` if you passed a callback ref).\n         *\n         * @see {@li",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": []
    },
    {
      "name": "ClassAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ClassAttributes<T> extends RefAttributes<T> {\n    }",
      "doc": "Represents the built-in attributes available to class components.",
      "tags": []
    },
    {
      "name": "ReactElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface ReactElement<\n        P = unknown,\n        T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,\n    > {\n        type: T;\n        props: P;\n        key: string | null;\n    }",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of the props object"
        },
        {
          "tagName": "template",
          "text": "The type of the component or tag"
        },
        {
          "tagName": "example",
          "text": "```tsx\nconst element: ReactElement = <div />;\n```"
        }
      ]
    },
    {
      "name": "ReactComponentElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface ReactComponentElement<\n        T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,\n        P = Pick<ComponentProps<T>, Exclude<keyof ComponentProps<T>, \"key\" | \"ref\">>,\n    > extends ReactElement<P, Exclude<T, number>> {}",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": ""
        }
      ]
    },
    {
      "name": "FunctionComponentElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface FunctionComponentElement<P> extends ReactElement<P, FunctionComponent<P>> {\n        /**\n         * @deprecated Use `element.props.ref` instead.\n         */\n        ref?: (\"ref\" extends keyof P ? P extends { ref?: infer R | undefined } ? R : never : never) | undefined;\n    }",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `ReactElement<P, React.FunctionComponent<P>>`"
        }
      ]
    },
    {
      "name": "CElement",
      "kind": "TypeAliasDeclaration",
      "signature": "type CElement<P, T extends Component<P, ComponentState>> = ComponentElement<P, T>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `ReactElement<P, React.ComponentClass<P>>`"
        }
      ]
    },
    {
      "name": "ComponentElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface ComponentElement<P, T extends Component<P, ComponentState>> extends ReactElement<P, ComponentClass<P>> {\n        /**\n         * @deprecated Use `element.props.ref` instead.\n         */\n        ref?: Ref<T> | undefined;\n    }",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `ReactElement<P, React.ComponentClass<P>>`"
        }
      ]
    },
    {
      "name": "ClassicElement",
      "kind": "TypeAliasDeclaration",
      "signature": "type ClassicElement<P> = CElement<P, ClassicComponent<P, ComponentState>>;",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use {@link ComponentElement} instead."
        }
      ]
    },
    {
      "name": "DOMElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element>\n        extends ReactElement<P, string>\n    {\n        /**\n         * @deprecated Use `element.props.ref` instead.\n         */\n        ref: Ref<T>;\n    }",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `ReactElement<P, string>`"
        }
      ]
    },
    {
      "name": "ReactHTMLElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface ReactHTMLElement<T extends HTMLElement> extends DetailedReactHTMLElement<AllHTMLAttributes<T>, T> {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "DetailedReactHTMLElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface DetailedReactHTMLElement<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMElement<P, T> {\n        type: HTMLElementType;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ReactSVGElement",
      "kind": "InterfaceDeclaration",
      "signature": "interface ReactSVGElement extends DOMElement<SVGAttributes<SVGElement>, SVGElement> {\n        type: SVGElementType;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ReactPortal",
      "kind": "InterfaceDeclaration",
      "signature": "interface ReactPortal extends ReactElement {\n        children: ReactNode;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES",
      "kind": "InterfaceDeclaration",
      "signature": "interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES {}",
      "doc": "Different release channels declare additional types of ReactNode this particular release channel accepts.\nApp or library types should never augment this interface.",
      "tags": []
    },
    {
      "name": "ReactNode",
      "kind": "TypeAliasDeclaration",
      "signature": "type ReactNode =\n        | ReactElement\n        | string\n        | number\n        | bigint\n        | Iterable<ReactNode>\n        | ReactPortal\n        | boolean\n        | null\n        | undefined\n        | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[\n            keyof DO_NOT_USE_OR_YOU_",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/react-types/reactnode/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// Typing children\ntype Props = { children: ReactNode }\n\nconst Component = ({ children }: Props) => <div>{children}</div>\n\n<Component>hello</Component>\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// Typing a custom element\ntype Props = { customElement: ReactNode }\n\nconst Component = ({ customElement }: Props) => <div>{customElement}</div>\n\n<Component customElement={<div>hello</div>} />\n```"
        }
      ]
    },
    {
      "name": "ProviderProps",
      "kind": "InterfaceDeclaration",
      "signature": "interface ProviderProps<T> {\n        value: T;\n        children?: ReactNode | undefined;\n    }",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of the value the context provides."
        }
      ]
    },
    {
      "name": "ConsumerProps",
      "kind": "InterfaceDeclaration",
      "signature": "interface ConsumerProps<T> {\n        children: (value: T) => ReactNode;\n    }",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of the value the context provides."
        }
      ]
    },
    {
      "name": "ExoticComponent",
      "kind": "InterfaceDeclaration",
      "signature": "interface ExoticComponent<P = {}> {\n        (props: P): ReactNode;\n        readonly $$typeof: symbol;\n    }",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        }
      ]
    },
    {
      "name": "NamedExoticComponent",
      "kind": "InterfaceDeclaration",
      "signature": "interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {\n        /**\n         * Used in debugging messages. You might want to set it\n         * explicitly if you want to display a different name for\n         * debugging purposes.\n         *\n         * @see {@link https://legacy.reactjs.or",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        }
      ]
    },
    {
      "name": "ProviderExoticComponent",
      "kind": "InterfaceDeclaration",
      "signature": "interface ProviderExoticComponent<P> extends ExoticComponent<P> {\n    }",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        }
      ]
    },
    {
      "name": "ContextType",
      "kind": "TypeAliasDeclaration",
      "signature": "type ContextType<C extends Context<any>> = C extends Context<infer T> ? T : never;",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The context object."
        },
        {
          "tagName": "example",
          "text": "```tsx\nimport { createContext } from 'react';\n\nconst MyContext = createContext({ foo: 'bar' });\n\ntype ContextType = ContextType<typeof MyContext>;\n// ContextType = { foo: string }\n```"
        }
      ]
    },
    {
      "name": "Provider",
      "kind": "TypeAliasDeclaration",
      "signature": "type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;",
      "doc": "Wraps your components to specify the value of this context for all components inside.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/createContext#provider React Docs}"
        },
        {
          "tagName": "example",
          "text": "```tsx\nimport { createContext } from 'react';\n\nconst ThemeContext = createContext('light');\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <Toolbar />\n    </ThemeContext.Provider>\n  );\n}\n```"
        }
      ]
    },
    {
      "name": "Consumer",
      "kind": "TypeAliasDeclaration",
      "signature": "type Consumer<T> = ExoticComponent<ConsumerProps<T>>;",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/createContext#consumer React Docs}"
        },
        {
          "tagName": "example",
          "text": "```tsx\nimport { UserContext } from './user-context';\n\nfunction Avatar() {\n  return (\n    <UserContext.Consumer>\n      {user => <img src={user.profileImage} alt={user.name} />}\n    </UserContext.Consumer>\n  );\n}\n```"
        }
      ]
    },
    {
      "name": "Context",
      "kind": "InterfaceDeclaration",
      "signature": "interface Context<T> extends Provider<T> {\n        Provider: Provider<T>;\n        Consumer: Consumer<T>;\n        /**\n         * Used in debugging messages. You might want to set it\n         * explicitly if you want to display a different name for\n         * debugging purposes.\n         *\n         * ",
      "doc": "[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/learn/passing-data-deeply-with-context React Docs}"
        },
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "example",
          "text": "```tsx\nimport { createContext } from 'react';\n\nconst ThemeContext = createContext('light');\n```"
        }
      ]
    },
    {
      "name": "Children",
      "kind": "VariableDeclaration",
      "signature": "Children: {\n        map<T, C>(\n            children: C | readonly C[],\n            fn: (child: C, index: number) => T,\n        ): C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>>;\n        forEach<C>(children: C | readonly C[], fn: (child: C, index: number) => void): voi",
      "doc": "",
      "tags": []
    },
    {
      "name": "FragmentProps",
      "kind": "InterfaceDeclaration",
      "signature": "export interface FragmentProps {\n        children?: React.ReactNode;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "Fragment",
      "kind": "VariableDeclaration",
      "signature": "Fragment: ExoticComponent<FragmentProps>",
      "doc": "",
      "tags": []
    },
    {
      "name": "StrictMode",
      "kind": "VariableDeclaration",
      "signature": "StrictMode: ExoticComponent<{ children?: ReactNode | undefined }>",
      "doc": "",
      "tags": []
    },
    {
      "name": "SuspenseProps",
      "kind": "InterfaceDeclaration",
      "signature": "interface SuspenseProps {\n        children?: ReactNode | undefined;\n\n        /** A fallback react tree to show when a Suspense child (like React.lazy) suspends */\n        fallback?: ReactNode;\n\n        /**\n         * A name for this Suspense boundary for instrumentation purposes.\n         * The name",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/Suspense React Docs}"
        }
      ]
    },
    {
      "name": "Suspense",
      "kind": "VariableDeclaration",
      "signature": "Suspense: ExoticComponent<SuspenseProps>",
      "doc": "",
      "tags": []
    },
    {
      "name": "version",
      "kind": "VariableDeclaration",
      "signature": "version: string",
      "doc": "",
      "tags": []
    },
    {
      "name": "ProfilerOnRenderCallback",
      "kind": "TypeAliasDeclaration",
      "signature": "type ProfilerOnRenderCallback = (\n        /**\n         * The string id prop of the {@link Profiler} tree that has just committed. This lets\n         * you identify which part of the tree was committed if you are using multiple\n         * profilers.\n         *\n         * @see {@link https://react.dev",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}"
        }
      ]
    },
    {
      "name": "ProfilerProps",
      "kind": "InterfaceDeclaration",
      "signature": "interface ProfilerProps {\n        children?: ReactNode | undefined;\n        id: string;\n        onRender: ProfilerOnRenderCallback;\n    }",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react.dev/reference/react/Profiler React Docs}"
        }
      ]
    },
    {
      "name": "Profiler",
      "kind": "VariableDeclaration",
      "signature": "Profiler: ExoticComponent<ProfilerProps>",
      "doc": "",
      "tags": []
    },
    {
      "name": "ReactInstance",
      "kind": "TypeAliasDeclaration",
      "signature": "type ReactInstance = Component<any> | Element;",
      "doc": "",
      "tags": []
    },
    {
      "name": "Component",
      "kind": "InterfaceDeclaration",
      "signature": "interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "Component",
      "kind": "ClassDeclaration",
      "signature": "class Component<P, S> {\n        /**\n         * If set, `this.context` will be set at runtime to the current value of the given Context.\n         *\n         * @example\n         *\n         * ```ts\n         * type MyContext = number\n         * const Ctx = React.createContext<MyContext>(0)\n         *\n  ",
      "doc": "",
      "tags": []
    },
    {
      "name": "PureComponent",
      "kind": "ClassDeclaration",
      "signature": "class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "ClassicComponent",
      "kind": "InterfaceDeclaration",
      "signature": "interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {\n        replaceState(nextState: S, callback?: () => void): void;\n        isMounted(): boolean;\n        getInitialState?(): S;\n    }",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `ClassicComponent` from `create-react-class`"
        },
        {
          "tagName": "see",
          "text": "{@link https://legacy.reactjs.org/docs/react-without-es6.html Legacy React Docs}"
        },
        {
          "tagName": "see",
          "text": "{@link https://www.npmjs.com/package/create-react-class `create-react-class` on npm}"
        }
      ]
    },
    {
      "name": "FC",
      "kind": "TypeAliasDeclaration",
      "signature": "type FC<P = {}> = FunctionComponent<P>;",
      "doc": "Represents the type of a function component. Can optionally\nreceive a type argument that represents the props the component\nreceives.",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        },
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components React TypeScript Cheatsheet}"
        },
        {
          "tagName": "alias",
          "text": "for {@link FunctionComponent}"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// With props:\ntype Props = { name: string }\n\nconst MyComponent: FC<Props> = (props) => {\n return <div>{props.name}</div>\n}\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// Without props:\nconst MyComponentWithoutProps: FC = () => {\n  return <div>MyComponentWithoutProps</div>\n}\n```"
        }
      ]
    },
    {
      "name": "FunctionComponent",
      "kind": "InterfaceDeclaration",
      "signature": "interface FunctionComponent<P = {}> {\n        (props: P): ReactNode | Promise<ReactNode>;\n        /**\n         * Ignored by React.\n         * @deprecated Only kept in types for backwards compatibility. Will be removed in a future major release.\n         */\n        propTypes?: any;\n        /**\n      ",
      "doc": "Represents the type of a function component. Can optionally\nreceive a type argument that represents the props the component\naccepts.",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        },
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components React TypeScript Cheatsheet}"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// With props:\ntype Props = { name: string }\n\nconst MyComponent: FunctionComponent<Props> = (props) => {\n return <div>{props.name}</div>\n}\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// Without props:\nconst MyComponentWithoutProps: FunctionComponent = () => {\n  return <div>MyComponentWithoutProps</div>\n}\n```"
        }
      ]
    },
    {
      "name": "ForwardedRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type ForwardedRef<T> = ((instance: T | null) => void) | RefObject<T | null> | null;",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link ForwardRefRenderFunction}"
        }
      ]
    },
    {
      "name": "ForwardRefRenderFunction",
      "kind": "InterfaceDeclaration",
      "signature": "interface ForwardRefRenderFunction<T, P = {}> {\n        (props: P, ref: ForwardedRef<T>): ReactNode;\n        /**\n         * Used in debugging messages. You might want to set it\n         * explicitly if you want to display a different name for\n         * debugging purposes.\n         *\n         * Will",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "param",
          "text": "Props passed to the component, if any."
        },
        {
          "tagName": "param",
          "text": "A ref forwarded to the component of type {@link ForwardedRef}."
        },
        {
          "tagName": "template",
          "text": "The type of the forwarded ref."
        },
        {
          "tagName": "template",
          "text": "The type of the props the component accepts."
        },
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "see",
          "text": "{@link forwardRef}"
        }
      ]
    },
    {
      "name": "ComponentClass",
      "kind": "InterfaceDeclaration",
      "signature": "interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {\n        // constructor signature must match React.Component\n        new(\n            props: P,\n            /**\n             * Value of the parent {@link https://react.dev/reference/react/Component#context Context} s",
      "doc": "Represents a component class in React.",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts."
        },
        {
          "tagName": "template",
          "text": "The internal state of the component."
        }
      ]
    },
    {
      "name": "ClassicComponentClass",
      "kind": "InterfaceDeclaration",
      "signature": "interface ClassicComponentClass<P = {}> extends ComponentClass<P> {\n        new(props: P): ClassicComponent<P, ComponentState>;\n        getDefaultProps?(): P;\n    }",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `ClassicComponentClass` from `create-react-class`"
        },
        {
          "tagName": "see",
          "text": "{@link https://legacy.reactjs.org/docs/react-without-es6.html Legacy React Docs}"
        },
        {
          "tagName": "see",
          "text": "{@link https://www.npmjs.com/package/create-react-class `create-react-class` on npm}"
        }
      ]
    },
    {
      "name": "ClassType",
      "kind": "TypeAliasDeclaration",
      "signature": "type ClassType<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>> =\n        & C\n        & (new(props: P, context: any) => T);",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": []
    },
    {
      "name": "ComponentLifecycle",
      "kind": "InterfaceDeclaration",
      "signature": "interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {\n        /**\n         * Called immediately after a component is mounted. Setting state here will trigger re-rendering.\n         */\n        componentDidMount?(): void;\n        /**\n         * Called",
      "doc": "",
      "tags": []
    },
    {
      "name": "StaticLifecycle",
      "kind": "InterfaceDeclaration",
      "signature": "interface StaticLifecycle<P, S> {\n        getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | undefined;\n        getDerivedStateFromError?: GetDerivedStateFromError<P, S> | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "GetDerivedStateFromProps",
      "kind": "TypeAliasDeclaration",
      "signature": "type GetDerivedStateFromProps<P, S> =\n        /**\n         * Returns an update to a component's state based on its new props and old state.\n         *\n         * Note: its presence prevents any of the deprecated lifecycle methods from being invoked\n         */\n        (nextProps: Readonly<P>, prevSt",
      "doc": "",
      "tags": []
    },
    {
      "name": "GetDerivedStateFromError",
      "kind": "TypeAliasDeclaration",
      "signature": "type GetDerivedStateFromError<P, S> =\n        /**\n         * This lifecycle is invoked after an error has been thrown by a descendant component.\n         * It receives the error that was thrown as a parameter and should return a value to update state.\n         *\n         * Note: its presence prevent",
      "doc": "",
      "tags": []
    },
    {
      "name": "NewLifecycle",
      "kind": "InterfaceDeclaration",
      "signature": "interface NewLifecycle<P, S, SS> {\n        /**\n         * Runs before React applies the result of {@link Component.render render} to the document, and\n         * returns an object to be given to {@link componentDidUpdate}. Useful for saving\n         * things such as scroll position before {@link Com",
      "doc": "",
      "tags": []
    },
    {
      "name": "DeprecatedLifecycle",
      "kind": "InterfaceDeclaration",
      "signature": "interface DeprecatedLifecycle<P, S> {\n        /**\n         * Called immediately before mounting occurs, and before {@link Component.render}.\n         * Avoid introducing any side-effects or subscriptions in this method.\n         *\n         * Note: the presence of {@link NewLifecycle.getSnapshotBefor",
      "doc": "",
      "tags": []
    },
    {
      "name": "ForwardRefExoticComponent",
      "kind": "InterfaceDeclaration",
      "signature": "interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {\n        /**\n         * Ignored by React.\n         * @deprecated Only kept in types for backwards compatibility. Will be removed in a future major release.\n         */\n        propTypes?: any;\n    }",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The props the component accepts, if any."
        },
        {
          "tagName": "see",
          "text": "{@link ExoticComponent}"
        }
      ]
    },
    {
      "name": "PropsWithoutRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type PropsWithoutRef<Props> =\n        // Omit would not be sufficient for this. We'd like to avoid unnecessary mapping and need a distributive conditional to support unions.\n        // see: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types\n        /",
      "doc": "Omits the 'ref' attribute from the given props object.",
      "tags": [
        {
          "tagName": "template",
          "text": "The props object type."
        }
      ]
    },
    {
      "name": "PropsWithRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type PropsWithRef<Props> = Props;",
      "doc": "Ensures that the props do not include string ref, which cannot be forwarded",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `Props` directly. `PropsWithRef<Props>` is just an alias for `Props`"
        }
      ]
    },
    {
      "name": "PropsWithChildren",
      "kind": "TypeAliasDeclaration",
      "signature": "type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };",
      "doc": "",
      "tags": []
    },
    {
      "name": "ComponentProps",
      "kind": "TypeAliasDeclaration",
      "signature": "type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = T extends\n        JSXElementConstructor<infer Props> ? Props\n        : T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T]\n        : {};",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// Retrieves the props an 'input' element accepts\ntype InputProps = React.ComponentProps<'input'>;\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\nconst MyComponent = (props: { foo: number, bar: string }) => <div />;\n\n// Retrieves the props 'MyComponent' accepts\ntype MyComponentProps = React.ComponentProps<typeof MyComponent>;\n```"
        }
      ]
    },
    {
      "name": "ComponentPropsWithRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type ComponentPropsWithRef<T extends ElementType> = T extends JSXElementConstructor<infer Props>\n        // If it's a class i.e. newable we're dealing with a class component\n        ? T extends abstract new(args: any) => any ? PropsWithoutRef<Props> & RefAttributes<InstanceType<T>>\n        : Props\n ",
      "doc": "Used to retrieve the props a component accepts with its ref. Can either be\npassed a string, indicating a DOM element (e.g. 'div', 'span', etc.) or the\ntype of a React component.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// Retrieves the props an 'input' element accepts\ntype InputProps = React.ComponentPropsWithRef<'input'>;\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\nconst MyComponent = (props: { foo: number, bar: string }) => <div />;\n\n// Retrieves the props 'MyComponent' accepts\ntype MyComponentPropsWithRef = React.ComponentPropsWithRef<typeof MyComponent>;\n```"
        }
      ]
    },
    {
      "name": "CustomComponentPropsWithRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type CustomComponentPropsWithRef<T extends ComponentType> = T extends JSXElementConstructor<infer Props>\n        // If it's a class i.e. newable we're dealing with a class component\n        ? T extends abstract new(args: any) => any ? PropsWithoutRef<Props> & RefAttributes<InstanceType<T>>\n        :",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "example",
          "text": "```tsx\nconst MyComponent = (props: { foo: number, bar: string }) => <div />;\n\n// Retrieves the props 'MyComponent' accepts\ntype MyComponentPropsWithRef = React.CustomComponentPropsWithRef<typeof MyComponent>;\n```"
        }
      ]
    },
    {
      "name": "ComponentPropsWithoutRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type ComponentPropsWithoutRef<T extends ElementType> = PropsWithoutRef<ComponentProps<T>>;",
      "doc": "Used to retrieve the props a component accepts without its ref. Can either be\npassed a string, indicating a DOM element (e.g. 'div', 'span', etc.) or the\ntype of a React component.",
      "tags": [
        {
          "tagName": "see",
          "text": "{@link https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/ React TypeScript Cheatsheet}"
        },
        {
          "tagName": "example",
          "text": "```tsx\n// Retrieves the props an 'input' element accepts\ntype InputProps = React.ComponentPropsWithoutRef<'input'>;\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\nconst MyComponent = (props: { foo: number, bar: string }) => <div />;\n\n// Retrieves the props 'MyComponent' accepts\ntype MyComponentPropsWithoutRef = React.ComponentPropsWithoutRef<typeof MyComponent>;\n```"
        }
      ]
    },
    {
      "name": "ComponentRef",
      "kind": "TypeAliasDeclaration",
      "signature": "type ComponentRef<T extends ElementType> = ComponentPropsWithRef<T> extends RefAttributes<infer Method> ? Method\n        : never;",
      "doc": "Retrieves the type of the 'ref' prop for a given component type or tag name.",
      "tags": [
        {
          "tagName": "template",
          "text": "The component type."
        },
        {
          "tagName": "example",
          "text": "```tsx\ntype MyComponentRef = React.ComponentRef<typeof MyComponent>;\n```"
        },
        {
          "tagName": "example",
          "text": "```tsx\ntype DivRef = React.ComponentRef<'div'>;\n```"
        }
      ]
    },
    {
      "name": "MemoExoticComponent",
      "kind": "TypeAliasDeclaration",
      "signature": "type MemoExoticComponent<T extends ComponentType<any>> = NamedExoticComponent<CustomComponentPropsWithRef<T>> & {\n        readonly type: T;\n    };",
      "doc": "",
      "tags": []
    },
    {
      "name": "LazyExoticComponent",
      "kind": "InterfaceDeclaration",
      "signature": "interface LazyExoticComponent<T extends ComponentType<any>>\n        extends ExoticComponent<CustomComponentPropsWithRef<T>>\n    {\n        readonly _result: T;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "SetStateAction",
      "kind": "TypeAliasDeclaration",
      "signature": "type SetStateAction<S> = S | ((prevState: S) => S);",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": [
        {
          "tagName": "template",
          "text": "The type of the state."
        },
        {
          "tagName": "example",
          "text": "```tsx\n// This return type correctly represents the type of\n// `setCount` in the example below.\nconst useCustomState = (): Dispatch<SetStateAction<number>> => {\n  const [count, setCount] = useState(0);\n\n  return setCount;\n}\n```"
        }
      ]
    },
    {
      "name": "Dispatch",
      "kind": "TypeAliasDeclaration",
      "signature": "type Dispatch<A> = (value: A) => void;",
      "doc": "[object Object],[object Object],[object Object],[object Object],[object Object]",
      "tags": []
    },
    {
      "name": "DispatchWithoutAction",
      "kind": "TypeAliasDeclaration",
      "signature": "type DispatchWithoutAction = () => void;",
      "doc": "[object Object],[object Object],[object Object]",
      "tags": []
    },
    {
      "name": "AnyActionArg",
      "kind": "TypeAliasDeclaration",
      "signature": "type AnyActionArg = [] | [any];",
      "doc": "",
      "tags": []
    },
    {
      "name": "ActionDispatch",
      "kind": "TypeAliasDeclaration",
      "signature": "type ActionDispatch<ActionArg extends AnyActionArg> = (...args: ActionArg) => void;",
      "doc": "",
      "tags": []
    },
    {
      "name": "Reducer",
      "kind": "TypeAliasDeclaration",
      "signature": "type Reducer<S, A> = (prevState: S, action: A) => S;",
      "doc": "",
      "tags": []
    },
    {
      "name": "ReducerWithoutAction",
      "kind": "TypeAliasDeclaration",
      "signature": "type ReducerWithoutAction<S> = (prevState: S) => S;",
      "doc": "",
      "tags": []
    },
    {
      "name": "ReducerState",
      "kind": "TypeAliasDeclaration",
      "signature": "type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;",
      "doc": "",
      "tags": []
    },
    {
      "name": "DependencyList",
      "kind": "TypeAliasDeclaration",
      "signature": "type DependencyList = readonly unknown[];",
      "doc": "",
      "tags": []
    },
    {
      "name": "EffectCallback",
      "kind": "TypeAliasDeclaration",
      "signature": "type EffectCallback = () => void | Destructor;",
      "doc": "",
      "tags": []
    },
    {
      "name": "MutableRefObject",
      "kind": "InterfaceDeclaration",
      "signature": "interface MutableRefObject<T> {\n        current: T;\n    }",
      "doc": "",
      "tags": [
        {
          "tagName": "deprecated",
          "text": "Use `RefObject` instead."
        }
      ]
    },
    {
      "name": "TransitionFunction",
      "kind": "TypeAliasDeclaration",
      "signature": "export type TransitionFunction = () => VoidOrUndefinedOnly | Promise<VoidOrUndefinedOnly>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "TransitionStartFunction",
      "kind": "InterfaceDeclaration",
      "signature": "export interface TransitionStartFunction {\n        /**\n         * State updates caused inside the callback are allowed to be deferred.\n         *\n         * **If some state update causes a component to suspend, that state update should be wrapped in a transition.**\n         *\n         * @param callb",
      "doc": "",
      "tags": []
    },
    {
      "name": "Usable",
      "kind": "TypeAliasDeclaration",
      "signature": "export type Usable<T> = PromiseLike<T> | Context<T>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "BaseSyntheticEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface BaseSyntheticEvent<E = object, C = any, T = any> {\n        nativeEvent: E;\n        currentTarget: C;\n        target: T;\n        bubbles: boolean;\n        cancelable: boolean;\n        defaultPrevented: boolean;\n        eventPhase: number;\n        isTrusted: boolean;\n        preventDefault()",
      "doc": "",
      "tags": []
    },
    {
      "name": "SyntheticEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}",
      "doc": "currentTarget - a reference to the element on which the event listener is registered.\n\ntarget - a reference to the element from which the event was originally dispatched.\nThis might be a child element to the element on which the event listener is registered.\nIf you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682",
      "tags": []
    },
    {
      "name": "ClipboardEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface ClipboardEvent<T = Element> extends SyntheticEvent<T, NativeClipboardEvent> {\n        clipboardData: DataTransfer;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "CompositionEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface CompositionEvent<T = Element> extends SyntheticEvent<T, NativeCompositionEvent> {\n        data: string;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DragEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {\n        dataTransfer: DataTransfer;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "PointerEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface PointerEvent<T = Element> extends MouseEvent<T, NativePointerEvent> {\n        pointerId: number;\n        pressure: number;\n        tangentialPressure: number;\n        tiltX: number;\n        tiltY: number;\n        twist: number;\n        width: number;\n        height: number;\n        pointer",
      "doc": "",
      "tags": []
    },
    {
      "name": "FocusEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface FocusEvent<Target = Element, RelatedTarget = Element> extends SyntheticEvent<Target, NativeFocusEvent> {\n        relatedTarget: (EventTarget & RelatedTarget) | null;\n        target: EventTarget & Target;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "FormEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface FormEvent<T = Element> extends SyntheticEvent<T> {\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "InvalidEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface InvalidEvent<T = Element> extends SyntheticEvent<T> {\n        target: EventTarget & T;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ChangeEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface ChangeEvent<T = Element> extends SyntheticEvent<T> {\n        target: EventTarget & T;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "InputEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface InputEvent<T = Element> extends SyntheticEvent<T, NativeInputEvent> {\n        data: string;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ModifierKey",
      "kind": "TypeAliasDeclaration",
      "signature": "export type ModifierKey =\n        | \"Alt\"\n        | \"AltGraph\"\n        | \"CapsLock\"\n        | \"Control\"\n        | \"Fn\"\n        | \"FnLock\"\n        | \"Hyper\"\n        | \"Meta\"\n        | \"NumLock\"\n        | \"ScrollLock\"\n        | \"Shift\"\n        | \"Super\"\n        | \"Symbol\"\n        | \"SymbolLock\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "KeyboardEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {\n        altKey: boolean;\n        /** @deprecated */\n        charCode: number;\n        ctrlKey: boolean;\n        code: string;\n        /**\n         * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-m",
      "doc": "",
      "tags": []
    },
    {
      "name": "MouseEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {\n        altKey: boolean;\n        button: number;\n        buttons: number;\n        clientX: number;\n        clientY: number;\n        ctrlKey: boolean;\n        /**\n         * See [DOM Level 3 Events spec](https://www.w3.or",
      "doc": "",
      "tags": []
    },
    {
      "name": "TouchEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface TouchEvent<T = Element> extends UIEvent<T, NativeTouchEvent> {\n        altKey: boolean;\n        changedTouches: TouchList;\n        ctrlKey: boolean;\n        /**\n         * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive)",
      "doc": "",
      "tags": []
    },
    {
      "name": "UIEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface UIEvent<T = Element, E = NativeUIEvent> extends SyntheticEvent<T, E> {\n        detail: number;\n        view: AbstractView;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "WheelEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {\n        deltaMode: number;\n        deltaX: number;\n        deltaY: number;\n        deltaZ: number;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "AnimationEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface AnimationEvent<T = Element> extends SyntheticEvent<T, NativeAnimationEvent> {\n        animationName: string;\n        elapsedTime: number;\n        pseudoElement: string;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ToggleEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface ToggleEvent<T = Element> extends SyntheticEvent<T, NativeToggleEvent> {\n        oldState: \"closed\" | \"open\";\n        newState: \"closed\" | \"open\";\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "TransitionEvent",
      "kind": "InterfaceDeclaration",
      "signature": "interface TransitionEvent<T = Element> extends SyntheticEvent<T, NativeTransitionEvent> {\n        elapsedTime: number;\n        propertyName: string;\n        pseudoElement: string;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "EventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }[\"bivarianceHack\"];",
      "doc": "",
      "tags": []
    },
    {
      "name": "ReactEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "ClipboardEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "CompositionEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "DragEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "FocusEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "FormEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "ChangeEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "InputEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type InputEventHandler<T = Element> = EventHandler<InputEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "KeyboardEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "MouseEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "TouchEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "PointerEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "UIEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "WheelEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "AnimationEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "ToggleEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type ToggleEventHandler<T = Element> = EventHandler<ToggleEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "TransitionEventHandler",
      "kind": "TypeAliasDeclaration",
      "signature": "type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;",
      "doc": "",
      "tags": []
    },
    {
      "name": "HTMLProps",
      "kind": "InterfaceDeclaration",
      "signature": "interface HTMLProps<T> extends AllHTMLAttributes<T>, ClassAttributes<T> {\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DetailedHTMLProps",
      "kind": "TypeAliasDeclaration",
      "signature": "type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> & E;",
      "doc": "",
      "tags": []
    },
    {
      "name": "SVGProps",
      "kind": "InterfaceDeclaration",
      "signature": "interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "SVGLineElementAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface SVGLineElementAttributes<T> extends SVGProps<T> {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "SVGTextElementAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface SVGTextElementAttributes<T> extends SVGProps<T> {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "DOMAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface DOMAttributes<T> {\n        children?: ReactNode | undefined;\n        dangerouslySetInnerHTML?: {\n            // Should be InnerHTML['innerHTML'].\n            // But unfortunately we're mixing renderer-specific type declarations.\n            __html: string | TrustedHTML;\n        } | undefin",
      "doc": "",
      "tags": []
    },
    {
      "name": "CSSProperties",
      "kind": "InterfaceDeclaration",
      "signature": "export interface CSSProperties extends CSS.Properties<string | number> {\n        /**\n         * The index signature was removed to enable closed typing for style\n         * using CSSType. You're able to use type assertion or module augmentation\n         * to add properties or an index signature of y",
      "doc": "",
      "tags": []
    },
    {
      "name": "AriaAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface AriaAttributes {\n        /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */\n        \"aria-activedescendant\"?: string | undefined;\n        /** Indicates whether assistive technologies will present all, or only parts of, th",
      "doc": "",
      "tags": []
    },
    {
      "name": "AriaRole",
      "kind": "TypeAliasDeclaration",
      "signature": "type AriaRole =\n        | \"alert\"\n        | \"alertdialog\"\n        | \"application\"\n        | \"article\"\n        | \"banner\"\n        | \"button\"\n        | \"cell\"\n        | \"checkbox\"\n        | \"columnheader\"\n        | \"combobox\"\n        | \"complementary\"\n        | \"contentinfo\"\n        | \"definition\"\n   ",
      "doc": "",
      "tags": []
    },
    {
      "name": "HTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {\n        // React-specific Attributes\n        defaultChecked?: boolean | undefined;\n        defaultValue?: string | number | readonly string[] | undefined;\n        suppressContentEditableWarning?: boolean | undefined;\n        supp",
      "doc": "",
      "tags": []
    },
    {
      "name": "DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS",
      "kind": "InterfaceDeclaration",
      "signature": "interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS {}",
      "doc": "For internal usage only.\nDifferent release channels declare additional types of ReactNode this particular release channel accepts.\nApp or library types should never augment this interface.",
      "tags": []
    },
    {
      "name": "AllHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface AllHTMLAttributes<T> extends HTMLAttributes<T> {\n        // Standard HTML Attributes\n        accept?: string | undefined;\n        acceptCharset?: string | undefined;\n        action?:\n            | string\n            | undefined\n            | ((formData: FormData) => void | Promise<void>)\n ",
      "doc": "",
      "tags": []
    },
    {
      "name": "HTMLAttributeReferrerPolicy",
      "kind": "TypeAliasDeclaration",
      "signature": "type HTMLAttributeReferrerPolicy =\n        | \"\"\n        | \"no-referrer\"\n        | \"no-referrer-when-downgrade\"\n        | \"origin\"\n        | \"origin-when-cross-origin\"\n        | \"same-origin\"\n        | \"strict-origin\"\n        | \"strict-origin-when-cross-origin\"\n        | \"unsafe-url\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "HTMLAttributeAnchorTarget",
      "kind": "TypeAliasDeclaration",
      "signature": "type HTMLAttributeAnchorTarget =\n        | \"_self\"\n        | \"_blank\"\n        | \"_parent\"\n        | \"_top\"\n        | (string & {});",
      "doc": "",
      "tags": []
    },
    {
      "name": "AnchorHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {\n        download?: any;\n        href?: string | undefined;\n        hrefLang?: string | undefined;\n        media?: string | undefined;\n        ping?: string | undefined;\n        target?: HTMLAttributeAnchorTarget | undefined;\n        type?",
      "doc": "",
      "tags": []
    },
    {
      "name": "AudioHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "AreaHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {\n        alt?: string | undefined;\n        coords?: string | undefined;\n        download?: any;\n        href?: string | undefined;\n        hrefLang?: string | undefined;\n        media?: string | undefined;\n        referrerPolicy?: HTMLAttrib",
      "doc": "",
      "tags": []
    },
    {
      "name": "BaseHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {\n        href?: string | undefined;\n        target?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "BlockquoteHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {\n        cite?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ButtonHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {\n        disabled?: boolean | undefined;\n        form?: string | undefined;\n        formAction?:\n            | string\n            | ((formData: FormData) => void | Promise<void>)\n            | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_F",
      "doc": "",
      "tags": []
    },
    {
      "name": "CanvasHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {\n        height?: number | string | undefined;\n        width?: number | string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ColHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ColHTMLAttributes<T> extends HTMLAttributes<T> {\n        span?: number | undefined;\n        width?: number | string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ColgroupHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {\n        span?: number | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DataHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface DataHTMLAttributes<T> extends HTMLAttributes<T> {\n        value?: string | readonly string[] | number | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DetailsHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {\n        open?: boolean | undefined;\n        name?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DelHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface DelHTMLAttributes<T> extends HTMLAttributes<T> {\n        cite?: string | undefined;\n        dateTime?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DialogHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {\n        onCancel?: ReactEventHandler<T> | undefined;\n        onClose?: ReactEventHandler<T> | undefined;\n        open?: boolean | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "EmbedHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {\n        height?: number | string | undefined;\n        src?: string | undefined;\n        type?: string | undefined;\n        width?: number | string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "FieldsetHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {\n        disabled?: boolean | undefined;\n        form?: string | undefined;\n        name?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "FormHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface FormHTMLAttributes<T> extends HTMLAttributes<T> {\n        acceptCharset?: string | undefined;\n        action?:\n            | string\n            | undefined\n            | ((formData: FormData) => void | Promise<void>)\n            | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS[\n",
      "doc": "",
      "tags": []
    },
    {
      "name": "HtmlHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {\n        manifest?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "IframeHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {\n        allow?: string | undefined;\n        allowFullScreen?: boolean | undefined;\n        allowTransparency?: boolean | undefined;\n        /** @deprecated */\n        frameBorder?: number | string | undefined;\n        height?: number | st",
      "doc": "",
      "tags": []
    },
    {
      "name": "DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_IMG_SRC_TYPES",
      "kind": "InterfaceDeclaration",
      "signature": "interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_IMG_SRC_TYPES {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "ImgHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {\n        alt?: string | undefined;\n        crossOrigin?: CrossOrigin;\n        decoding?: \"async\" | \"auto\" | \"sync\" | undefined;\n        fetchPriority?: \"high\" | \"low\" | \"auto\";\n        height?: number | string | undefined;\n        loading?: \"",
      "doc": "",
      "tags": []
    },
    {
      "name": "InsHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface InsHTMLAttributes<T> extends HTMLAttributes<T> {\n        cite?: string | undefined;\n        dateTime?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "HTMLInputTypeAttribute",
      "kind": "TypeAliasDeclaration",
      "signature": "type HTMLInputTypeAttribute =\n        | \"button\"\n        | \"checkbox\"\n        | \"color\"\n        | \"date\"\n        | \"datetime-local\"\n        | \"email\"\n        | \"file\"\n        | \"hidden\"\n        | \"image\"\n        | \"month\"\n        | \"number\"\n        | \"password\"\n        | \"radio\"\n        | \"range\"\n  ",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillAddressKind",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillAddressKind = \"billing\" | \"shipping\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillBase",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillBase = \"\" | \"off\" | \"on\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillContactField",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillContactField =\n        | \"email\"\n        | \"tel\"\n        | \"tel-area-code\"\n        | \"tel-country-code\"\n        | \"tel-extension\"\n        | \"tel-local\"\n        | \"tel-local-prefix\"\n        | \"tel-local-suffix\"\n        | \"tel-national\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillContactKind",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillContactKind = \"home\" | \"mobile\" | \"work\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillCredentialField",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillCredentialField = \"webauthn\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillNormalField",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillNormalField =\n        | \"additional-name\"\n        | \"address-level1\"\n        | \"address-level2\"\n        | \"address-level3\"\n        | \"address-level4\"\n        | \"address-line1\"\n        | \"address-line2\"\n        | \"address-line3\"\n        | \"bday-day\"\n        | \"bday-month\"\n        | \"bday",
      "doc": "",
      "tags": []
    },
    {
      "name": "OptionalPrefixToken",
      "kind": "TypeAliasDeclaration",
      "signature": "type OptionalPrefixToken<T extends string> = `${T} ` | \"\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "OptionalPostfixToken",
      "kind": "TypeAliasDeclaration",
      "signature": "type OptionalPostfixToken<T extends string> = ` ${T}` | \"\";",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillField",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillField = AutoFillNormalField | `${OptionalPrefixToken<AutoFillContactKind>}${AutoFillContactField}`;",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFillSection",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFillSection = `section-${string}`;",
      "doc": "",
      "tags": []
    },
    {
      "name": "AutoFill",
      "kind": "TypeAliasDeclaration",
      "signature": "type AutoFill =\n        | AutoFillBase\n        | `${OptionalPrefixToken<AutoFillSection>}${OptionalPrefixToken<\n            AutoFillAddressKind\n        >}${AutoFillField}${OptionalPostfixToken<AutoFillCredentialField>}`;",
      "doc": "",
      "tags": []
    },
    {
      "name": "HTMLInputAutoCompleteAttribute",
      "kind": "TypeAliasDeclaration",
      "signature": "type HTMLInputAutoCompleteAttribute = AutoFill | (string & {});",
      "doc": "",
      "tags": []
    },
    {
      "name": "InputHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface InputHTMLAttributes<T> extends HTMLAttributes<T> {\n        accept?: string | undefined;\n        alt?: string | undefined;\n        autoComplete?: HTMLInputAutoCompleteAttribute | undefined;\n        capture?: boolean | \"user\" | \"environment\" | undefined; // https://www.w3.org/TR/html-media-c",
      "doc": "",
      "tags": []
    },
    {
      "name": "KeygenHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {\n        challenge?: string | undefined;\n        disabled?: boolean | undefined;\n        form?: string | undefined;\n        keyType?: string | undefined;\n        keyParams?: string | undefined;\n        name?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "LabelHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {\n        form?: string | undefined;\n        htmlFor?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "LiHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface LiHTMLAttributes<T> extends HTMLAttributes<T> {\n        value?: string | readonly string[] | number | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "LinkHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {\n        as?: string | undefined;\n        blocking?: \"render\" | (string & {}) | undefined;\n        crossOrigin?: CrossOrigin;\n        fetchPriority?: \"high\" | \"low\" | \"auto\";\n        href?: string | undefined;\n        hrefLang?: string | und",
      "doc": "",
      "tags": []
    },
    {
      "name": "MapHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface MapHTMLAttributes<T> extends HTMLAttributes<T> {\n        name?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "MenuHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {\n        type?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_MEDIA_SRC_TYPES",
      "kind": "InterfaceDeclaration",
      "signature": "interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_MEDIA_SRC_TYPES {}",
      "doc": "",
      "tags": []
    },
    {
      "name": "MediaHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {\n        autoPlay?: boolean | undefined;\n        controls?: boolean | undefined;\n        controlsList?: string | undefined;\n        crossOrigin?: CrossOrigin;\n        loop?: boolean | undefined;\n        mediaGroup?: string | undefined;\n    ",
      "doc": "",
      "tags": []
    },
    {
      "name": "MetaHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {\n        charSet?: string | undefined;\n        content?: string | undefined;\n        httpEquiv?: string | undefined;\n        media?: string | undefined;\n        name?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "MeterHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {\n        form?: string | undefined;\n        high?: number | undefined;\n        low?: number | undefined;\n        max?: number | string | undefined;\n        min?: number | string | undefined;\n        optimum?: number | undefined;\n        val",
      "doc": "",
      "tags": []
    },
    {
      "name": "QuoteHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {\n        cite?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ObjectHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {\n        classID?: string | undefined;\n        data?: string | undefined;\n        form?: string | undefined;\n        height?: number | string | undefined;\n        name?: string | undefined;\n        type?: string | undefined;\n        useMap",
      "doc": "",
      "tags": []
    },
    {
      "name": "OlHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface OlHTMLAttributes<T> extends HTMLAttributes<T> {\n        reversed?: boolean | undefined;\n        start?: number | undefined;\n        type?: \"1\" | \"a\" | \"A\" | \"i\" | \"I\" | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "OptgroupHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {\n        disabled?: boolean | undefined;\n        label?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "OptionHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {\n        disabled?: boolean | undefined;\n        label?: string | undefined;\n        selected?: boolean | undefined;\n        value?: string | readonly string[] | number | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "OutputHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {\n        form?: string | undefined;\n        htmlFor?: string | undefined;\n        name?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ParamHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {\n        name?: string | undefined;\n        value?: string | readonly string[] | number | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ProgressHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {\n        max?: number | string | undefined;\n        value?: string | readonly string[] | number | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "SlotHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {\n        name?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ScriptHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {\n        async?: boolean | undefined;\n        blocking?: \"render\" | (string & {}) | undefined;\n        /** @deprecated */\n        charSet?: string | undefined;\n        crossOrigin?: CrossOrigin;\n        defer?: boolean | undefined;\n       ",
      "doc": "",
      "tags": []
    },
    {
      "name": "SelectHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {\n        autoComplete?: string | undefined;\n        disabled?: boolean | undefined;\n        form?: string | undefined;\n        multiple?: boolean | undefined;\n        name?: string | undefined;\n        required?: boolean | undefined;\n     ",
      "doc": "",
      "tags": []
    },
    {
      "name": "SourceHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {\n        height?: number | string | undefined;\n        media?: string | undefined;\n        sizes?: string | undefined;\n        src?: string | undefined;\n        srcSet?: string | undefined;\n        type?: string | undefined;\n        width?",
      "doc": "",
      "tags": []
    },
    {
      "name": "StyleHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {\n        blocking?: \"render\" | (string & {}) | undefined;\n        media?: string | undefined;\n        scoped?: boolean | undefined;\n        type?: string | undefined;\n\n        // React props\n        href?: string | undefined;\n        preced",
      "doc": "",
      "tags": []
    },
    {
      "name": "TableHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface TableHTMLAttributes<T> extends HTMLAttributes<T> {\n        align?: \"left\" | \"center\" | \"right\" | undefined;\n        bgcolor?: string | undefined;\n        border?: number | undefined;\n        cellPadding?: number | string | undefined;\n        cellSpacing?: number | string | undefined;\n     ",
      "doc": "",
      "tags": []
    },
    {
      "name": "TextareaHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {\n        autoComplete?: string | undefined;\n        cols?: number | undefined;\n        dirName?: string | undefined;\n        disabled?: boolean | undefined;\n        form?: string | undefined;\n        maxLength?: number | undefined;\n     ",
      "doc": "",
      "tags": []
    },
    {
      "name": "TdHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface TdHTMLAttributes<T> extends HTMLAttributes<T> {\n        align?: \"left\" | \"center\" | \"right\" | \"justify\" | \"char\" | undefined;\n        colSpan?: number | undefined;\n        headers?: string | undefined;\n        rowSpan?: number | undefined;\n        scope?: string | undefined;\n        abbr?:",
      "doc": "",
      "tags": []
    },
    {
      "name": "ThHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface ThHTMLAttributes<T> extends HTMLAttributes<T> {\n        align?: \"left\" | \"center\" | \"right\" | \"justify\" | \"char\" | undefined;\n        colSpan?: number | undefined;\n        headers?: string | undefined;\n        rowSpan?: number | undefined;\n        scope?: string | undefined;\n        abbr?:",
      "doc": "",
      "tags": []
    },
    {
      "name": "TimeHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {\n        dateTime?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "TrackHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {\n        default?: boolean | undefined;\n        kind?: string | undefined;\n        label?: string | undefined;\n        src?: string | undefined;\n        srcLang?: string | undefined;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "VideoHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {\n        height?: number | string | undefined;\n        playsInline?: boolean | undefined;\n        poster?: string | undefined;\n        width?: number | string | undefined;\n        disablePictureInPicture?: boolean | undefined;\n        ",
      "doc": "",
      "tags": []
    },
    {
      "name": "SVGAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {\n        // React-specific Attributes\n        suppressHydrationWarning?: boolean | undefined;\n\n        // Attributes which also defined in HTMLAttributes\n        // See comment in SVGDOMPropertyConfig.js\n        className?: string ",
      "doc": "",
      "tags": []
    },
    {
      "name": "WebViewHTMLAttributes",
      "kind": "InterfaceDeclaration",
      "signature": "interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {\n        allowFullScreen?: boolean | undefined;\n        allowpopups?: boolean | undefined;\n        autosize?: boolean | undefined;\n        blinkfeatures?: string | undefined;\n        disableblinkfeatures?: string | undefined;\n        disa",
      "doc": "",
      "tags": []
    },
    {
      "name": "HTMLElementType",
      "kind": "TypeAliasDeclaration",
      "signature": "type HTMLElementType =\n        | \"a\"\n        | \"abbr\"\n        | \"address\"\n        | \"area\"\n        | \"article\"\n        | \"aside\"\n        | \"audio\"\n        | \"b\"\n        | \"base\"\n        | \"bdi\"\n        | \"bdo\"\n        | \"big\"\n        | \"blockquote\"\n        | \"body\"\n        | \"br\"\n        | \"button\"\n",
      "doc": "",
      "tags": []
    },
    {
      "name": "SVGElementType",
      "kind": "TypeAliasDeclaration",
      "signature": "type SVGElementType =\n        | \"animate\"\n        | \"circle\"\n        | \"clipPath\"\n        | \"defs\"\n        | \"desc\"\n        | \"ellipse\"\n        | \"feBlend\"\n        | \"feColorMatrix\"\n        | \"feComponentTransfer\"\n        | \"feComposite\"\n        | \"feConvolveMatrix\"\n        | \"feDiffuseLighting\"\n   ",
      "doc": "",
      "tags": []
    },
    {
      "name": "AbstractView",
      "kind": "InterfaceDeclaration",
      "signature": "interface AbstractView {\n        styleMedia: StyleMedia;\n        document: Document;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "Touch",
      "kind": "InterfaceDeclaration",
      "signature": "interface Touch {\n        identifier: number;\n        target: EventTarget;\n        screenX: number;\n        screenY: number;\n        clientX: number;\n        clientY: number;\n        pageX: number;\n        pageY: number;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "TouchList",
      "kind": "InterfaceDeclaration",
      "signature": "interface TouchList {\n        [index: number]: Touch;\n        length: number;\n        item(index: number): Touch;\n        identifiedTouch(identifier: number): Touch;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "ErrorInfo",
      "kind": "InterfaceDeclaration",
      "signature": "interface ErrorInfo {\n        /**\n         * Captures which component contained the exception, and its ancestors.\n         */\n        componentStack?: string | null;\n        digest?: string | null;\n    }",
      "doc": "",
      "tags": []
    },
    {
      "name": "JSX",
      "kind": "ModuleDeclaration",
      "signature": "namespace JSX {\n        // We don't just alias React.ElementType because React.ElementType\n        // historically does more than we need it to.\n        // E.g. it also contains .propTypes and so TS also verifies the declared\n        // props type does match the declared .propTypes.\n        // But i",
      "doc": "",
      "tags": []
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
