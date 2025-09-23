// @ts-check
// This configuration is a modified version of the original Agent Hub
// Docusaurus config.  It adds a custom `colorMode` section to make dark
// mode the default and keeps the theme switch enabled.  It also
// references our custom CSS file that overrides Infima variables to
// match the AI Templates design system.  The rest of the configuration
// mirrors the upstream file to preserve site behaviour.

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Agent Hub',
  tagline: 'LLMs are cool, smart LLMs are even cooler!',
  favicon: 'img/favicon-agent-hub.png',

  future: {
    v4: true,
  },

  url: 'https://agent-hub-1.netlify.app',
  baseUrl: '/',

  organizationName: 'fil-builders',
  projectName: 'agent-hub',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [require.resolve('./plugins/webpack-yaml-loader.js')],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */ (
        {
          docs: {
            sidebarPath: './sidebars.js',
            path: '../tutorials',
            routeBasePath: '/tutorials',
            editUrl: 'https://github.com/FIL-Builders/agent-hub/tree/main/tutorials/',
          },
          blog: {
            showReadingTime: true,
            path: '../blog',
            routeBasePath: '/blog',
            feedOptions: {
              type: ['rss', 'atom'],
              xslt: true,
            },
            editUrl: 'https://github.com/FIL-Builders/agent-hub/tree/main/blog/',
            onInlineTags: 'warn',
            onInlineAuthors: 'warn',
            onUntruncatedBlogPosts: 'warn',
          },
          theme: {
            customCss: './src/css/custom.css',
          },
        }
      ),
    ],
  ],

  // Custom fields for client code
  customFields: {
    clarityProjectId: 'tf6he9p70s',
  },

  // Microsoft Clarity analytics is initialized via NPM in `src/theme/Root.js`.

  themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */ ({
    image: 'img/agent-hub-logo.png',
    navbar: {
      title: 'Agent Hub',
      logo: {
        alt: 'Agent Hub Logo',
        src: 'img/agent-hub-logo.png',
        // Explicitly set width/height to make the logo much larger in the navbar
        width: 80,
        height: 80,
      },
      items: [
        { to: '/agents/', label: 'Agent Specs', position: 'left' },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/FIL-Builders/agent-hub/issues/new?template=request-new-agent.md',
          label: 'Suggest Agent',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/tutorials/getting-started-loading-your-first-agent-file',
            },
          ],
        },
        {
          title: 'Community',
          items: [
          /*
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          */
            {
              html:
                '<a class="button button--primary" href="https://x.com/germinalabs" target="_blank" rel="noopener noreferrer">Tag, Comment, Like @GerminaLabs on X</a>'
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/FIL-Builders/agent-hub',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Germina Labs`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Colour mode configuration: set dark as default and keep the switch.
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
  }),
};

export default config;
