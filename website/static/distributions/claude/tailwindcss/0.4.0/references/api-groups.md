# Tailwind CSS API Groups

### Core Directives

**Exports**
- @import "tailwindcss"
- @theme
- @source
- @utility
- @apply

Primary directives for bringing Tailwind into a stylesheet, defining theme tokens, controlling source detection, authoring reusable utilities, and inlining utilities into authored CSS.

#### @import "tailwindcss"
**Kind**
other

**Summary**
Imports the Tailwind framework into the main stylesheet entry.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/functions-and-directives

```css
@import "tailwindcss";
```

**Guidance**
- Use this once in the stylesheet entry Tailwind should process.
- Keep it near other Tailwind directives so the entry remains readable and intentional.
- Do not scatter it across unrelated CSS files as if it were an ordinary utility library import.

**Example**
Language: css
Description: Minimal Tailwind v4 entry stylesheet.

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.7 0.18 250);
}
```

#### @theme
**Kind**
other

**Summary**
Defines Tailwind theme variables and design tokens in CSS.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/theme

```css
@theme {
  --color-brand-500: oklch(0.7 0.18 250);
  --font-display: "Satoshi", sans-serif;
}
```

**Guidance**
- Use this for shared design-system tokens that should participate in Tailwind styling.
- Name variables semantically so they remain stable as the UI evolves.
- Do not use it as a dumping ground for unrelated one-off values.

**Example**
Language: css
Description: Define brand and typography tokens for the project.

```css
@theme {
  --color-brand-500: oklch(0.7 0.18 250);
  --color-brand-700: oklch(0.58 0.18 250);
  --font-display: "Satoshi", sans-serif;
}
```

#### @source
**Kind**
other

**Summary**
Adds source paths that Tailwind should scan for class usage.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/detecting-classes-in-source-files

```css
@source "../src";
```

**Guidance**
- Use this when the default source-detection behavior does not cover the files that contain class names.
- Reach for it first when styles are missing because the framework never detected the classes.
- Keep paths tight enough to avoid unnecessary scanning overhead and noise.

**Example**
Language: css
Description: Extend class detection to a workspace package.

```css
@import "tailwindcss";
@source "../src";
@source "../packages/ui";
```

#### @utility
**Kind**
other

**Summary**
Defines a reusable custom utility inside Tailwind's utility system.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/adding-custom-styles

```css
@utility content-auto {
  content-visibility: auto;
}
```

**Guidance**
- Use this for styling patterns that recur across the codebase and belong in the utility layer.
- Prefer it over repeated ad hoc CSS when the same pattern appears in many places.
- Do not create custom utilities for one-off component quirks that are clearer as plain CSS.

**Example**
Language: css
Description: Define a reusable glass-panel utility.

```css
@utility glass-panel {
  backdrop-filter: blur(16px);
  background-color: color-mix(in oklab, white 18%, transparent);
  border-radius: 1rem;
}
```

#### @apply
**Kind**
other

**Summary**
Inlines existing Tailwind utilities into an authored CSS rule.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/functions-and-directives

```css
.btn {
  @apply inline-flex items-center gap-2 rounded-lg px-4 py-2;
}
```

**Guidance**
- Use it when a small semantic wrapper should reuse a stable group of utilities.
- Keep usage local and readable; avoid building an opaque component system entirely out of `@apply`.
- Remember that Tailwind's default mental model is still utility usage in markup.

**Example**
Language: css
Description: Define a reusable badge class from existing utilities.

```css
.badge {
  @apply inline-flex items-center rounded-full px-2 py-1 text-sm font-medium;
}
```

### Variants And Functions

**Exports**
- @variant
- @custom-variant
- --spacing()
- --alpha()
- @reference

Extension points for modifiers, custom variants, theme-aware authored CSS, and stylesheet references.

#### @variant
**Kind**
other

**Summary**
Applies an existing Tailwind variant to nested authored CSS.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/functions-and-directives

```css
@variant dark {
  .card {
    background: var(--color-slate-900);
  }
}
```

**Guidance**
- Use this when authored CSS should follow an existing Tailwind variant like `dark`.
- Keep the variant choice explicit so downstream behavior is easy to reason about.
- Do not nest variants unnecessarily when a utility-based solution is clearer.

**Example**
Language: css
Description: Adjust a docs shell border color in dark mode.

```css
@variant dark {
  .docs-shell {
    border-color: var(--color-slate-700);
  }
}
```

#### @custom-variant
**Kind**
other

**Summary**
Defines a reusable project-specific variant based on a selector contract.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/functions-and-directives

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

**Guidance**
- Use when the project needs a stable selector-driven variant beyond the built-in set.
- Keep selector contracts intentional because downstream utility usage depends on them.
- Avoid creating many custom variants unless they encode real design-system states.

**Example**
Language: css
Description: Define a project-specific theme variant.

```css
@custom-variant theme-brand (&:where([data-theme="brand"] *));
```

#### --spacing()
**Kind**
other

**Summary**
Computes spacing values from Tailwind's active spacing scale.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/functions-and-directives

```css
margin-top: --spacing(4);
```

**Guidance**
- Use this when authored CSS should stay aligned with the same spacing system as Tailwind utilities.
- Prefer it over hard-coded spacing magic numbers when the value belongs to the design system.
- Keep the use tied to meaningful spacing steps rather than arbitrary calculations.

**Example**
Language: css
Description: Space items in a vertical stack using the theme spacing scale.

```css
.stack > * + * {
  margin-top: --spacing(4);
}
```

#### --alpha()
**Kind**
other

**Summary**
Produces an alpha-adjusted color from a Tailwind theme variable.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/functions-and-directives

```css
background-color: --alpha(var(--color-blue-500) / 20%);
```

**Guidance**
- Use this when authored CSS needs translucent theme-driven colors without hard-coded rgba conversions.
- Prefer it when the source color should still trace back to the shared design tokens.
- Keep opacity choices tied to concrete UI states rather than arbitrary decoration.

**Example**
Language: css
Description: Create a subtle warning callout background from a theme token.

```css
.callout {
  background-color: --alpha(var(--color-amber-500) / 15%);
}
```

#### @reference
**Kind**
other

**Summary**
References another stylesheet so Tailwind-aware features can be used without duplicating output.

**Definition**
Language: css
Source: https://tailwindcss.com/docs/functions-and-directives

```css
@reference "../../app.css";
```

**Guidance**
- Use this in CSS modules or scoped stylesheets that need access to theme variables, utilities, or variants without re-importing the whole framework.
- Keep the referenced path stable and intentional because it becomes part of the styling build graph.
- Do not confuse this with importing Tailwind output multiple times.

**Example**
Language: css
Description: Make a CSS module aware of the main Tailwind entry stylesheet.

```css
@reference "../app.css";

.title {
  @apply text-2xl font-semibold;
}
```

### Compatibility And Workflow Boundaries

**Exports**
- Compatibility
- Dark Mode
- Source Detection Workflow
- CSS-first Workflow

Project-level Tailwind concepts that control how the rest of the system behaves.

#### Compatibility
**Kind**
other

**Summary**
Tailwind v4 has explicit browser and tooling expectations that shape which workflows are supported.

**Definition**
Language: text
Source: https://tailwindcss.com/docs/compatibility

```text
Tailwind CSS v4 is designed around modern CSS features and a CSS-first workflow.
```

**Guidance**
- Treat compatibility constraints as part of the design, not as a footnote after styles are written.
- Compare the project toolchain against the official compatibility guidance before forcing old preprocessors or legacy browser assumptions into the workflow.
- When a pipeline feels awkward, question the pipeline fit before inventing more Tailwind complexity.

**Example**
Language: text
Description: Decision rule for old CSS toolchains.

```text
If a project depends heavily on Sass/Less-era assumptions, validate the official compatibility guidance before trying to force a v4 Tailwind workflow into that pipeline.
```

#### Dark Mode
**Kind**
workflow

**Summary**
Dark mode behavior is driven by explicit variant and theme strategy rather than by ad hoc duplicate styles.

**Definition**
Language: text
Source: https://tailwindcss.com/docs/dark-mode

```text
Use the dark variant or a custom selector-driven variant intentionally.
```

**Guidance**
- Use Tailwind's dark-mode strategy deliberately instead of duplicating separate style systems.
- Keep selector-driven theme strategies explicit when customizing beyond the default dark mode behavior.
- Align dark-mode behavior with theme variables and variants instead of scattering one-off overrides.

**Example**
Language: css
Description: Apply custom dark-mode-aware CSS using an existing variant.

```css
@variant dark {
  .app-shell {
    background-color: var(--color-slate-950);
  }
}
```

#### Source Detection Workflow
**Kind**
workflow

**Summary**
Build-time workflow for making sure Tailwind scans the right files so expected utilities are generated.

**Definition**
Language: text
Source: https://tailwindcss.com/docs/detecting-classes-in-source-files

```text
Tailwind generates styles by scanning configured or detected source files for class usage.
```

**Guidance**
- Check source detection first when classes are missing from the output.
- Use `@source` deliberately when project structure or workspaces place class names outside the default scan set.
- Keep the scanned paths specific enough to avoid unnecessary overhead and debugging noise.

**Example**
Language: css
Description: Add explicit source paths for an app and a workspace package.

```css
@import "tailwindcss";
@source "../src";
@source "../packages/ui";
```

#### CSS-first Workflow
**Kind**
workflow

**Summary**
Tailwind v4 workflow that centers customization and composition in CSS using imports, theme variables, and directives.

**Definition**
Language: text
Source: https://tailwindcss.com/docs/compatibility

```text
Tailwind CSS v4 is designed around a CSS-first workflow using modern CSS features and Tailwind directives.
```

**Guidance**
- Start with the stylesheet entry, `@import`, `@theme`, and other directives before reaching for older config-heavy habits.
- Keep customization in the CSS layer unless a specific integration boundary requires something else.
- Avoid forcing Sass or Less-centric patterns into a workflow that is now designed around native CSS features.

**Example**
Language: css
Description: Minimal CSS-first Tailwind entry with theme tokens.

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.7 0.18 250);
  --font-display: "Satoshi", sans-serif;
}
```
