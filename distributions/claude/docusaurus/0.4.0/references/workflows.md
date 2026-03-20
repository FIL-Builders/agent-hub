# Docusaurus Workflows

### Add a runtime page feature without breaking `baseUrl`
1. Read `siteConfig` with `useDocusaurusContext()` only when runtime metadata is actually needed.
2. Resolve internal asset and route paths with `useBaseUrl(...)` or `Link`.
3. Put metadata changes in `Head`.
4. Guard browser-only behavior so SSR and hydration remain stable.

```jsx
import React from "react";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function ReleaseHero() {
  const {siteConfig} = useDocusaurusContext();
  const banner = useBaseUrl("/img/releases/banner.svg");

  return (
    <>
      <Head>
        <title>{siteConfig.title} · Releases</title>
      </Head>
      <img src={banner} alt="Release banner" />
      <Link to="/docs/intro">Get started</Link>
    </>
  );
}
```

### Generate routes from plugin content
1. Load or fetch serializable content in `loadContent`.
2. Convert that content into routes and data files in `contentLoaded`.
3. Keep page rendering in components and build-time generation in the plugin.

```js
export default function pagesPlugin() {
  return {
    name: "pages-plugin",
    async loadContent() {
      return [{slug: "welcome", title: "Welcome"}];
    },
    async contentLoaded({content, actions}) {
      const {createData, addRoute} = actions;
      for (const page of content) {
        const data = await createData(`${page.slug}.json`, page);
        addRoute({
          path: `/pages/${page.slug}`,
          component: "@site/src/components/Page.js",
          modules: {page: data},
        });
      }
    },
  };
}
```

### Choose configuration or swizzle intentionally
1. Check whether `themeConfig`, CSS, or a preset option already solves the problem.
2. Use swizzle only when the supported configuration surface is insufficient.
3. Treat the resulting swizzled files as local code that must be maintained across Docusaurus upgrades.

```bash
npx docusaurus swizzle @docusaurus/theme-classic Navbar
```
