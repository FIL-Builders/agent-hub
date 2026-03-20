# Tailwind CSS Workflows

### Set up a Tailwind v4 stylesheet entry
- When to use it:
  - starting a new Tailwind v4 project or migrating a stylesheet entry to the CSS-first workflow
- Steps:
  1. create the main stylesheet entry
  2. add `@import "tailwindcss"`
  3. define shared tokens in `@theme`
  4. add `@source` directives if source detection must include extra paths
  5. wire the stylesheet into the app build pipeline
- Example:

```css
@import "tailwindcss";
@source "../src";

@theme {
  --color-brand-500: oklch(0.7 0.18 250);
  --font-display: "Satoshi", sans-serif;
}
```

- Common failure points:
  - the stylesheet being edited is not the one Tailwind actually processes
  - source detection misses the real source files
  - older config habits are copied into a v4 project unnecessarily

### Extend the design system with custom utilities
- When to use it:
  - the project has repeated styling patterns that belong in the utility layer
- Steps:
  1. define durable tokens in `@theme`
  2. create a custom utility with `@utility`
  3. use `@variant` or `@custom-variant` only when a real modifier boundary exists
  4. verify the result stays simpler than plain CSS plus markup utilities
- Example:

```css
@theme {
  --color-brand-500: oklch(0.7 0.18 250);
}

@utility surface-brand {
  background-color: var(--color-brand-500);
  color: white;
}
```

- Common failure points:
  - overusing `@apply` until semantic classes replace the utility-first model
  - creating too many custom variants
  - mixing token, utility, and one-off component concerns in the same layer

### Debug missing styles in a v4 project
- When to use it:
  - utilities expected in the UI do not appear in the generated CSS
- Steps:
  1. confirm the correct stylesheet entry is processed
  2. inspect whether the relevant files are inside Tailwind's detected source set
  3. add or correct `@source` paths when necessary
  4. compare the toolchain against the official compatibility guidance
- Example:

```css
@import "tailwindcss";
@source "../src";
@source "../packages/ui";
```

- Common failure points:
  - blaming the framework integration before checking source detection
  - mixing unsupported preprocessors into the pipeline
  - assuming class generation is runtime behavior
