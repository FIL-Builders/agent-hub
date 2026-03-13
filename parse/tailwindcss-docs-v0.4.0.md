# Tailwind CSS Documentation Pack

## Snapshot
- library name: tailwindcss
- version or version range: ^4.2.1
- primary language: css
- homepage or canonical docs URL: https://tailwindcss.com/docs/compatibility
- short description: Tailwind CSS is a utility-first CSS framework centered on CSS-native directives, theme variables, utilities, variants, and build-time class detection.
- source set summary: `npm:tailwindcss@4.2.1` package contents, official Tailwind CSS v4.2 docs for compatibility, functions and directives, theme variables, adding custom styles, dark mode, and detecting classes in source files

## What This Library Is For
Tailwind CSS helps agents author and maintain utility-first styling systems that stay close to native CSS while using Tailwind's directives, theme variables, utilities, and variants. The highest-value tasks are installation and integration, theme customization, custom utilities, migration to v4-era workflow, and debugging class detection or compatibility problems.

Major use cases:
- building UI styles from utility classes
- defining design tokens with theme variables
- authoring custom utilities and variants
- integrating Tailwind into framework and bundler pipelines
- troubleshooting migration and compatibility issues

Scope and boundaries:
- this pack covers Tailwind CSS core workflow and authoring model
- this pack does not treat framework adapters as Tailwind core surface
- this pack does not treat Sass or Less preprocessors as part of the preferred v4 workflow
- this pack keeps native CSS features separate from Tailwind-specific directives and theme semantics

## Installation And Setup
- install commands:
  - `npm install tailwindcss @tailwindcss/postcss postcss`
- environment prerequisites:
  - a build pipeline that can process modern CSS imports and Tailwind's build step
  - browser targets that match Tailwind v4 compatibility requirements
- configuration prerequisites:
  - decide whether integration happens through the PostCSS plugin, a framework integration, or another supported build path
  - decide where the main stylesheet entry and theme customization live
- minimum setup example:

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.7 0.18 250);
}
```

## Core Concepts

### CSS-first workflow
- Tailwind v4 treats the stylesheet as the primary place for imports, theme variables, directives, and custom utilities.
- This matters because many older config-heavy habits are no longer the clearest default.
- Common confusion to avoid: assuming every customization starts in JavaScript config.

### Theme variables
- Theme tokens are expressed as CSS custom properties inside `@theme`.
- This matters because design tokens, utility generation, and arbitrary values all interact with the theme layer.
- Common confusion to avoid: treating theme variables as generic CSS variables without Tailwind semantics.

### Utilities and variants
- Tailwind utilities can be composed from built-ins and extended with `@utility`, `@variant`, and `@custom-variant`.
- This matters because the framework is still utility-first, but extension points are explicit and CSS-native.
- Common confusion to avoid: mixing utility authoring, component CSS, and arbitrary one-off rules without deciding which layer they belong to.

### Source detection
- Tailwind generates styles by scanning configured or detected source files for class usage.
- This matters because "missing styles" problems often come from source detection, not CSS syntax.
- Common confusion to avoid: blaming the build tool when the framework simply never saw the class names.

### Compatibility as design constraint
- Tailwind v4 has explicit compatibility expectations around browser features, build tooling, and preprocessor fit.
- This matters because not every old CSS pipeline is a good host for the new workflow.
- Common confusion to avoid: assuming Sass, Less, or legacy pipelines are natural companions.

## Version Delta Audit
- prior version or prior pack target: no prior Tailwind CSS pack exists in this repo
- current locked version: `^4.2.1`
- major changes that affect agent behavior:
  - Tailwind v4 uses a CSS-first workflow centered on `@import`, `@theme`, and other directives
  - compatibility and integration guidance matters more because old preprocessor-heavy habits no longer map cleanly
  - theme variables and directives are first-class customization primitives
- outdated assumptions that must not carry forward:
  - JavaScript-config-first customization is not always the preferred default
  - Sass or Less are not natural first-class companions for v4
  - `import.meta.env`, framework config, and Tailwind theme variables are different concerns
  - missing classes are often source-detection issues, not always framework or bundler issues

## Decision Rules
- Use `@theme` when the goal is shared design tokens.
- Use `@utility` when a reusable utility belongs in the Tailwind utility layer.
- Use custom CSS without extra Tailwind directives when the styling need is narrow and does not benefit from a reusable utility.
- Avoid preprocessors like Sass or Less when following the current v4 workflow.
- Choose framework-specific integration only when the project actually uses that framework; otherwise stay on the core Tailwind integration path.
- Debug source detection before blaming the build pipeline when expected utilities are missing.

## Ecosystem Boundaries
- what belongs to the core surface:
  - `@import "tailwindcss"`
  - `@theme`
  - `@source`
  - `@utility`
  - `@variant`
  - `@custom-variant`
  - `@apply`
  - `@reference`
  - theme variables and utility usage
- what belongs to first-party plugins, adapters, or companion packages:
  - build-tool integration packages such as PostCSS or framework-specific adapters
  - migration tooling and upgrade paths
- what belongs to third-party ecosystem integrations:
  - component libraries, design systems, and framework wrappers
  - extra plugins unrelated to core Tailwind semantics
- which adjacent surfaces are intentionally out of scope for this pack:
  - framework-specific component conventions
  - third-party plugin ecosystems
  - Sass, Less, and Stylus authoring as if they were Tailwind-first workflows

## Preconditions And Invariants
- The build pipeline must process Tailwind input CSS before the app is served.
- Theme customization should happen in the stylesheet entry or clearly related CSS modules, not as scattered ad hoc hacks.
- Client-visible utility output depends on correct source detection.
- Browser and tooling compatibility limits are part of the design, not an afterthought.
- Tailwind directives are build-time constructs, not runtime browser features.

## Public Surface Area

### Core directives

#### @import "tailwindcss"
**Kind:** other

**Summary:** Imports Tailwind's core framework styles into the stylesheet entry.

**Definition**
```css
@import "tailwindcss";
```

**Guidance**
- Use this once in the main stylesheet entry that Tailwind should process.
- Treat it as the root of the Tailwind stylesheet, not as a generic CSS import habit to scatter around.
- Keep this near `@theme` and other Tailwind directives so the entry remains readable.

**Example**
```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.7 0.18 250);
}
```

**Source Notes**
- Source: https://tailwindcss.com/docs/installation and https://tailwindcss.com/docs/functions-and-directives
- Exact syntax from official docs

#### @theme
**Kind:** other

**Summary:** Defines Tailwind theme variables and tokens in CSS.

**Definition**
```css
@theme {
  --color-brand-500: oklch(0.7 0.18 250);
}
```

**Guidance**
- Use for shared design tokens that should influence generated utilities.
- Keep token naming consistent and semantic instead of encoding one-off UI decisions.
- Do not treat this as arbitrary random CSS variable storage without considering how it affects the design system.

**Example**
```css
@theme {
  --font-display: "Satoshi", sans-serif;
  --color-brand-500: oklch(0.7 0.18 250);
  --radius-card: 1rem;
}
```

**Source Notes**
- Source: https://tailwindcss.com/docs/theme
- Condensed from official theme variable guidance

#### @source
**Kind:** other

**Summary:** Adds source paths that Tailwind should scan for class usage.

**Definition**
```css
@source "../src";
```

**Guidance**
- Use when default detection does not cover the files that actually contain class names.
- Reach for this when styles are missing because the framework never saw the classes.
- Keep sources narrow enough to avoid unnecessary scanning noise.

**Example**
```css
@import "tailwindcss";
@source "../src";
@source "../packages/ui";
```

**Source Notes**
- Source: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Exact directive form from the source-detection docs

#### @utility
**Kind:** other

**Summary:** Defines a reusable custom utility inside Tailwind's utility system.

**Definition**
```css
@utility content-auto {
  content-visibility: auto;
}
```

**Guidance**
- Use for reusable utility behavior that belongs alongside other utilities.
- Prefer this over ad hoc repeated custom CSS when the styling pattern recurs across the codebase.
- Do not create custom utilities for one-off component quirks that are better expressed directly in CSS.

**Example**
```css
@utility glass-panel {
  backdrop-filter: blur(16px);
  background-color: color-mix(in oklab, white 18%, transparent);
}
```

**Source Notes**
- Source: https://tailwindcss.com/docs/adding-custom-styles
- Condensed from the custom utility guidance

#### @apply
**Kind:** other

**Summary:** Inlines existing utility classes into a CSS rule.

**Definition**
```css
.btn {
  @apply inline-flex items-center gap-2 rounded-lg px-4 py-2;
}
```

**Guidance**
- Use when a small semantic class should reuse an existing group of utilities.
- Keep it local and readable; avoid building opaque component systems entirely out of `@apply`.
- Remember that utility usage in markup is still the main Tailwind mental model.

**Example**
```css
.badge {
  @apply inline-flex items-center rounded-full px-2 py-1 text-sm font-medium;
}
```

**Source Notes**
- Source: https://tailwindcss.com/docs/functions-and-directives
- Exact directive name from official docs

### Variants and modifiers

#### @variant
**Kind:** other

**Summary:** Applies an existing variant to nested rules in authored CSS.

**Definition**
```css
@variant dark {
  .card {
    background: var(--color-slate-900);
  }
}
```

**Guidance**
- Use when authored CSS must track an existing Tailwind variant like `dark`.
- Keep the variant choice explicit so the resulting CSS behavior is obvious.
- Do not overuse variant nesting when a utility-based solution is simpler.

**Example**
```css
@variant dark {
  .docs-shell {
    border-color: var(--color-slate-700);
  }
}
```

**Source Notes**
- Source: https://tailwindcss.com/docs/functions-and-directives
- Condensed from official variant directive guidance

#### @custom-variant
**Kind:** other

**Summary:** Defines a reusable custom variant for a project-specific selector pattern.

**Definition**
```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

**Guidance**
- Use when the project needs a stable selector-driven variant beyond the built-in set.
- Keep the selector contract intentional because downstream utility usage will depend on it.
- Avoid proliferating project-specific variants unless they encode a real design-system boundary.

**Example**
```css
@custom-variant theme-brand (&:where([data-theme="brand"] *));
```

**Source Notes**
- Source: https://tailwindcss.com/docs/functions-and-directives
- Exact directive shape condensed from official docs

### Functions and theme access

#### --spacing()
**Kind:** other

**Summary:** Computes spacing values from the active Tailwind spacing scale.

**Definition**
```css
margin: --spacing(4);
```

**Guidance**
- Use when authored CSS should stay aligned with the same spacing system as utilities.
- Prefer it over hard-coded magic numbers when the spacing value should participate in the design system.
- Keep the usage tied to meaningful spacing choices rather than arbitrary calculations.

**Example**
```css
.stack > * + * {
  margin-top: --spacing(4);
}
```

**Source Notes**
- Source: https://tailwindcss.com/docs/functions-and-directives
- Function form taken from the official docs

#### --alpha()
**Kind:** other

**Summary:** Produces an alpha-adjusted color from a Tailwind theme variable.

**Definition**
```css
background-color: --alpha(var(--color-blue-500) / 20%);
```

**Guidance**
- Use when authored CSS needs a translucent version of a theme-driven color.
- Prefer it over ad hoc hard-coded rgba conversions when the source color comes from the Tailwind theme.
- Keep the alpha usage readable and tied to actual UI states.

**Example**
```css
.callout {
  background-color: --alpha(var(--color-amber-500) / 15%);
}
```

**Source Notes**
- Source: https://tailwindcss.com/docs/functions-and-directives
- Function form condensed from official docs

## Common Workflows

### Set up a Tailwind v4 entry stylesheet
- when to use it:
  - starting a new project or migrating to the CSS-first workflow
- ordered steps:
  - create the main stylesheet entry
  - add `@import "tailwindcss"`
  - add `@theme` tokens that define brand values
  - wire the stylesheet into the app build pipeline
  - verify classes are detected from the real source directories
- example:

```css
@import "tailwindcss";
@source "../src";

@theme {
  --color-brand-500: oklch(0.7 0.18 250);
  --font-display: "Satoshi", sans-serif;
}
```

- common failure points:
  - stylesheet is not actually the one processed by the Tailwind build
  - source detection misses the app files
  - older config expectations are copied into a v4 project unnecessarily

### Add reusable design-system styling
- when to use it:
  - the project has recurring design tokens or semantic styling primitives
- ordered steps:
  - put tokens in `@theme`
  - define reusable utilities with `@utility` when needed
  - use `@apply` sparingly for semantic wrappers
  - verify dark mode or custom variants with explicit selectors
- example:

```css
@theme {
  --color-brand-500: oklch(0.7 0.18 250);
}

@utility btn-surface {
  border-radius: 0.75rem;
  background-color: var(--color-brand-500);
  color: white;
}
```

- common failure points:
  - overusing `@apply` until semantic classes replace the utility-first model
  - inventing too many custom variants
  - storing unrelated tokens without a coherent naming scheme

## Common Confusions
- theme variables vs ordinary CSS variables:
  - Tailwind theme variables drive framework-aware styling decisions; not every arbitrary variable should live there
- `@source` vs build-tool file inclusion:
  - build inclusion and class detection are related but not identical problems
- v4 CSS-first workflow vs older config-heavy habits:
  - many older answers are technically possible but no longer the clearest default
- native CSS nesting vs preprocessor habits:
  - Tailwind v4 is not designed around Sass/Less-centric authoring

## Deprecated And Compatibility Surface
- compatibility-only patterns:
  - older config-first customization patterns may still appear in migrated codebases
  - preprocessor-heavy pipelines may exist in legacy systems but are not the preferred v4 path
- what to use in new code instead:
  - CSS-first entrypoints, `@theme`, directives, and official integration guidance
- migration traps from older versions:
  - assuming the old configuration and layering mental model is still the best explanation
  - trying to combine Tailwind v4 with Sass/Less habits as if that were the intended design

## Pitfalls And Troubleshooting

### Classes do not appear in output
- likely cause:
  - Tailwind never saw the classes because source detection missed the files
- how to verify:
  - inspect the actual app and package paths containing class usage
  - confirm the stylesheet entry includes the right `@source` directives when needed
- fix:
  - add or correct `@source` paths and rerun the build

### Build pipeline behaves strangely with preprocessors
- likely cause:
  - the project is forcing Sass, Less, or Stylus expectations onto a Tailwind v4 workflow
- how to verify:
  - review the CSS toolchain and compare it against the official compatibility guidance
- fix:
  - simplify toward the supported CSS-first workflow and remove unnecessary preprocessors

### Theme customization feels inconsistent
- likely cause:
  - token definitions, one-off CSS, and utility usage are mixed without clear layering
- how to verify:
  - inspect whether tokens belong in `@theme`, reusable rules in `@utility`, and isolated styling in plain CSS
- fix:
  - separate token, utility, and component-level concerns explicitly

## Best Practices
- keep the stylesheet entry small and intentional
- use `@theme` for real design tokens, not every ad hoc variable
- prefer custom utilities only when reuse is clear
- debug source detection before blaming the framework integration
- treat compatibility constraints as first-class design input

## References
- https://tailwindcss.com/docs/compatibility
- https://tailwindcss.com/docs/functions-and-directives
- https://tailwindcss.com/docs/theme
- https://tailwindcss.com/docs/adding-custom-styles
- https://tailwindcss.com/docs/detecting-classes-in-source-files
- https://tailwindcss.com/docs/dark-mode
- `npm:tailwindcss@4.2.1`

## Open Questions
- none for the current core pack
