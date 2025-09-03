P1 — Prompt 1 (Use verbatim as the task prompt for the next LLM)

---

You are an expert technical writer, senior frontend engineer, and documentation architect. Your task is to **review the GitHub repository `https://github.com/rk-rishikesh/blocklock-frontend-kit` end-to-end** and produce a **single, exhaustive Markdown document** that a large-context LLM (and human developers) can use to understand, extend, and build on top of the repo without needing to read any other docs.

If your environment supports web access or Git, clone or browse the repo and read every relevant file (source, configs, tests, CI, examples, READMEs, issue templates). If web access is unavailable, state that constraint clearly and proceed by writing the full documentation framework with clearly marked TODOs for any facts that require repository inspection.

### Output requirements

* Produce **one Markdown file only**. Name it: `BLOCKLOCK_FRONTEND_KIT.md`.
* The file must be **self-contained, exhaustive, and unabridged**.
* Include a **clickable Table of Contents**, cross-references, and anchors.
* Prefer precise, source-grounded facts. **Never hallucinate**; when something is not present in the repo, label it **“Not found in repository”** or **“TODO (needs verification)”**.
* Use **Mermaid** for diagrams (component graph, data flow, dependency map).
* Use **fenced code blocks** for commands, config, and examples.
* Include **LLM-oriented guidance** and **extension playbooks** so future agents can perform code modifications safely.

---

## Deliverable structure (compose these sections in this exact order)

1. **Front Matter & Snapshot**

   * Title: *blocklock-frontend-kit — Complete Technical Documentation*
   * Repo URL, current branch, **HEAD commit SHA**, commit date/time (UTC).
   * Detected tech stack (e.g., TypeScript, React/Next/Vite, Tailwind, shadcn/ui, etc.).
   * License (copy the SPDX identifier and summarize key terms relevant to reuse).
   * Version and package metadata from `package.json` (name, version, scripts).
   * “How this doc was produced” note (automated/manual, date, tooling).
   * **Doc checksum**: a short hash of this file’s contents (for future integrity checks).

2. **Executive Summary**

   * One-page overview: what the kit is, who it’s for, and primary capabilities.
   * Core value proposition and intended use cases (e.g., starter kit, component library, internal DX patterns).
   * Current maturity level; known limitations.

3. **Quickstart**

   * Prerequisites (Node/npm/pnpm versions; OS notes).
   * **Install & bootstrap** commands.
   * **Development server**: how to run, default URL/port, hot reload behavior.
   * **Build** and **preview** steps.
   * Minimal **Hello World** example using the kit (importing a flagship component).
   * **.env** handling: required/optional variables; provide a `.env.example` snippet if present or reconstruct it from usage sites. Mark unknowns.

4. **Repository Map (with Roles)**

   * Collapsed tree of directories and key files, e.g.

     ```
     .
     ├─ src/
     │  ├─ components/…
     │  ├─ hooks/…
     │  ├─ lib/…
     │  ├─ pages/ or app/…
     │  └─ styles/…
     ├─ public/…
     ├─ package.json
     ├─ tsconfig.json
     ├─ vite.config.ts | next.config.js | etc.
     └─ …
     ```
   * For **every** top-level and important subdirectory, describe purpose and conventions.
   * For notable files, add one-line intent (e.g., “`src/lib/api.ts`: REST client with fetch wrapper and interceptors”).

5. **Architecture Overview**

   * **Mermaid component diagram** showing major modules and their relationships.
   * **Data-flow diagram**: user interaction → state → UI → network (if any).
   * State management approach (Context/Zustand/Redux/etc.), routing (Next Router/React Router), and styling system (Tailwind/CSS Modules/etc.).
   * How theming is applied (design tokens, CSS variables, tailwind config).
   * Any SSR/SSG/ISR semantics if using Next.js; otherwise mark N/A.

6. **Dependency Inventory & Rationale**

   * Table of all dependencies and devDependencies with versions and **one-line rationale** (why it’s used).
   * Note critical peer dependencies.
   * Call out **security-sensitive** packages (e.g., markdown renderers, sanitizers).
   * Build toolchain (Vite/Webpack/Next build) and plugins with their roles.

7. **Scripts & Tooling**

   * Full table of `package.json` scripts (name, command, intent).
   * Linting/formatting: ESLint, Prettier, configs; expected code style.
   * TypeScript configuration highlights (target, module resolution, strictness).
   * Testing framework (Vitest/Jest/Playwright/Cypress) and how to run tests.
   * CI/CD configuration (GitHub Actions, Vercel/Netlify config files): what pipelines do, required secrets.

8. **Components Catalog (UI API Reference)**

   * For **every exported component**:

     * Path and export name.
     * **Props table** with: name, type, default, required?, description.
     * Example usage (minimal + one advanced/variant example).
     * Styling specifics (classNames, Tailwind variants, themes).
     * Accessibility (a11y) notes and keyboard interactions.
     * Known pitfalls and performance notes (memoization, re-renders).
   * If the kit wraps a design system (e.g., shadcn/ui), explain the extension pattern and how to add variants.

9. **Hooks & Utilities (Runtime API Reference)**

   * For **every exported hook or function**:

     * Signature, parameters, return type.
     * Side effects (I/O, network, storage).
     * Example usage.
     * Error handling behavior and edge cases.
   * For **services/clients** (e.g., HTTP, auth, storage): base URL handling, interceptors, retries, and where env vars are read.

10. **Routing & Pages (if applicable)**

    * Routes table: path → component, layout, guard/middleware.
    * Dynamic routes and route parameters.
    * Metadata handling (SEO tags, OpenGraph) if present.

11. **State Management**

    * Store shape, atoms/slices, reducers/actions or context values.
    * How components subscribe and update; patterns to avoid prop-drilling.
    * Persistence (localStorage, cookies); hydration notes.
    * Testing strategies for state.

12. **Styling & Theming**

    * Tailwind configuration (important tokens, breakpoints, plugins).
    * Global CSS organization; CSS variables.
    * Theming API (dark mode, brand themes) and how to add a new theme.

13. **Internationalization (i18n)**

    * Libraries used, translation file structure, locale detection.
    * How to add new locales and manage pluralization.
    * If not present, mark N/A.

14. **Accessibility (a11y)**

    * Keyboard navigation, focus management, ARIA usage.
    * Color contrast and theming considerations.
    * Lint rules/tests for a11y; manual checklists.

15. **Error Handling & Observability**

    * Error boundary components.
    * Logging (console, external service), feature flags, metrics.
    * User-visible error messages: catalog and recovery guidance.

16. **Security**

    * Handling of secrets (never commit .env; how envs are injected).
    * XSS/HTML injection surfaces (e.g., markdown, `dangerouslySetInnerHTML`).
    * CORS assumptions if there is a backend.
    * Supply-chain notes (pinning, audit script).
    * Authentication/authorization patterns if present; if not, N/A.

17. **Performance & Bundling**

    * Code-splitting points, lazy loading patterns.
    * Image optimization, font loading.
    * Known bundle size, how to analyze (e.g., `vite-bundle-visualizer`).
    * Memoization rules (React.memo, useMemo/useCallback) and when to avoid them.

18. **Configuration & Environments**

    * Environment matrix (dev, staging, prod) and differences.
    * All **environment variables** documented in a table: **name, type, default, required?, used in files**.
    * Provide a complete `.env.example` block based on findings.

19. **Testing Strategy**

    * How to run unit, integration, and E2E tests.
    * Test locations and conventions.
    * Mocking patterns for network/state.
    * Coverage thresholds and how to view reports.

20. **Build, Release & Deployment**

    * How artifacts are produced (commands, output directories).
    * Deployment platforms (Vercel/Netlify/Cloudflare/etc.) and required settings.
    * Versioning/release process (tags, conventional commits).
    * Post-deploy checks.

21. **Extensibility Guide (LLM-Ready Playbooks)**

    * **Add a new component**: file path, story/example, props, tests, export.
    * **Add a new page/route**: routing steps, layout integration, SEO.
    * **Add a new hook/service**: folder, tests, barrel exports, docs.
    * **Add a theme**: tokens, Tailwind config, preview.
    * **Integrate an API**: env var, client wrapper, error handling.
    * Include **diff-style snippets** (fenced) for each playbook and list files to edit.

22. **Recipes (Copy-Paste Examples)**

    * Common tasks: form with validation, modal workflow, toast/notification, paginated list, protected route, optimistic updates.
    * Each recipe includes: imports, full component snippet, and notes.

23. **Maintenance & Project Hygiene**

    * Lint/format hooks (Husky/lint-staged).
    * Dependency upgrade policy and commands.
    * Renovate/Dependabot config if present.
    * Triaging issues, labels, PR template, CODEOWNERS (if present).

24. **Changelog Snapshot**

    * If conventional commits or tags exist, synthesize a recent changelog (last 20 commits).
    * If none, note N/A.

25. **Open Questions & TODOs**

    * List any ambiguities or missing pieces found during review.
    * Propose next steps with clear owners (if known) and suggested PRs.

26. **Glossary**

    * Define project-specific terminology and acronyms for quick onboarding.

27. **LLM Index & Chunking Hints**

    * Provide a section mapping: **heading → purpose → likely edit locations**.
    * Suggest chunk boundaries for retrieval (e.g., one chunk per component doc).
    * Include a mini “prompt library” with task-oriented prompts (e.g., “Add a prop to Button with backward compatibility”).

28. **Appendices**

    * **Key source excerpts** (short, targeted code snippets with file paths).
    * **Configs**: `package.json`, `tsconfig.json`, Tailwind config, ESLint/Prettier (include condensed but representative snippets).
    * **Mermaid diagrams** source blocks for easy edits.

---

### Rigor & methodology (follow these while composing)

* **Exhaustive export sweep**: traverse `src/**` and list all **exported** components/functions/types/hooks. Prefer reading barrel files (`index.ts`) to avoid omissions.
* **Type fidelity**: read TypeScript types/props interfaces directly from code. If JS only, infer carefully and mark uncertain fields.
* **Source-truth linking**: at the end of each API item, include a tiny “Source” line with path (and line range if visible).
* **No dead ends**: when you document a capability, include at least one usage example or test reference.
* **A11y first**: for each interactive component, add keyboard and screen-reader guidance.
* **Performance discipline**: annotate potential re-render hotspots and memoization opportunities.
* **Security posture**: enumerate all places where external input is rendered or parsed; mention sanitization strategy.
* **Environment discipline**: every `process.env.*` usage gets documented in the env table.

---

### Style & formatting rules

* Use **clear, neutral, implementation-accurate** language.
* Prefer tables for props, env vars, scripts, and dependencies.
* Keep headings ≤ 80 characters for better anchor stability.
* Place code examples in fenced blocks with correct language tags (`tsx`, `ts`, `bash`, `json`).
* For Mermaid, provide both the diagram and its code block.
* Avoid marketing language; this is a **technical reference**.

---

### Acceptance checklist (you must satisfy all)

* [ ] File name is exactly `BLOCKLOCK_FRONTEND_KIT.md`.
* [ ] Contains the 28 sections above in order, all present (use N/A only when truly not applicable).
* [ ] Includes Table of Contents with working anchors.
* [ ] Documents **every exported component/hook/utility** found in the repo with props/signatures and examples.
* [ ] Lists **all** `package.json` scripts with purpose.
* [ ] Documents **all** environment variables referenced anywhere in the code/config.
* [ ] Provides at least **two Mermaid diagrams** (components & data flow).
* [ ] Provides at least **five Recipes** with copy-pasteable examples.
* [ ] Contains no unverifiable claims; unknowns are explicitly marked.
* [ ] Can be read by an LLM to perform safe code edits following the included playbooks.

---

### If repository access fails

Include a top banner:

> **Repository Access Unavailable:** This document was generated without reading the source. All facts requiring inspection are marked as TODO. Provide the repo contents or enable browsing, then regenerate this file.

Then still produce the **entire** framework with placeholders and TODOs for each section.

