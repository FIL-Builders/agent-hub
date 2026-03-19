# Tailwind CSS Overview

## Snapshot

- Spec name: tailwindcss
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^4.2.1
- Primary language: css
- Homepage: https://tailwindcss.com/docs/compatibility
- Source set: npm:tailwindcss@4.2.1 package contents, official Tailwind CSS v4.2 docs for compatibility, functions and directives, theme variables, adding custom styles, source detection, dark mode, and parse/tailwindcss-docs-v0.4.0.md as the intermediate documentation pack

**Tags**
- tailwindcss
- css
- utility-first
- theme-variables
- directives
- layers
- compatibility
- migration

## Purpose

This pack teaches an agent to use Tailwind CSS 4.2.1 for CSS-first styling, theme customization, utilities, variants, directives, compatibility constraints, and migration work without collapsing Tailwind-specific behavior into generic CSS or framework advice.

## Guiding Principles

- Prefer the v4 CSS-first workflow over stale config-heavy habits when working in current Tailwind codebases.
- Distinguish Tailwind directives, theme variables, utility classes, and ordinary CSS rules instead of mixing them into one vague styling model.
- Treat `@source` and class detection as build-time concerns, not runtime CSS behavior.
- Use custom utilities and variants deliberately; do not replace the utility-first model with opaque abstractions.
- Keep framework integration behavior separate from Tailwind core semantics.
- Treat compatibility and browser/tooling constraints as first-class design inputs.

## Boundary Notes

- Primary contract sources are official Tailwind CSS v4.2 documentation pages for compatibility, functions and directives, theme variables, adding custom styles, detecting classes in source files, and dark mode.
- Coverage is centered on the highest-value Tailwind v4 surfaces: CSS-first entrypoints, `@theme`, `@source`, custom utilities and variants, build-time class detection, and migration pitfalls.
- This pack is organized by real task shape: core directives, variants and functions, theming, and compatibility workflows.
- This is a fresh pack, not a port from an older Tailwind agent file.
- The strongest boundaries in the pack are Tailwind vs native CSS, Tailwind vs framework integration behavior, and v4 workflow vs older config/preprocessor habits.

## FAQ

### Should I use Sass or Less with Tailwind v4?
- Not as the default recommendation.
- Tailwind v4 is designed around modern CSS and the CSS-first workflow described in the official compatibility docs.

### When should I create a custom utility instead of using plain utilities in markup?
- When the styling pattern is reused often enough that a project-level utility improves clarity.
- If it is truly one-off, plain CSS or direct utility usage is usually clearer.

## External Resources

- Compatibility: https://tailwindcss.com/docs/compatibility
- Functions and Directives: https://tailwindcss.com/docs/functions-and-directives
- Theme: https://tailwindcss.com/docs/theme
- Adding Custom Styles: https://tailwindcss.com/docs/adding-custom-styles
- Source Detection: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Dark Mode: https://tailwindcss.com/docs/dark-mode
