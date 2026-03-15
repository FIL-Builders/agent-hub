import React from 'react';
import clsx from 'clsx';
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';

const GITHUB_REPO = 'https://github.com/FIL-Builders/agent-hub';

function useNavbarItems() {
  return useThemeConfig().navbar.items;
}

function NavbarItems({items}) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item) => item.type === 'search');

  return (
    <div className="navbar__inner agenthub-navbar-inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          'navbar__items agenthub-navbar-left',
        )}>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <div className="agenthub-navbar-brand-slot">
          <NavbarLogo />
        </div>
      </div>

      <div className="agenthub-navbar-center">
        <div className="agenthub-navbar-links">
          <NavbarItems items={leftItems} />
        </div>
      </div>

      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right agenthub-navbar-right',
        )}>
        <div className="agenthub-navbar-controls">
          <div className="agenthub-navbar-toggle-slot">
            <NavbarColorModeToggle />
          </div>
          <div className="agenthub-navbar-github-slot">
            <a
              className="agenthub-navbar-github-link"
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Agent Hub GitHub repository">
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.67 0 8.2c0 3.63 2.29 6.7 5.47 7.78.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.38-2.53-.5-2.69-.97-.09-.24-.48-.97-.82-1.17-.28-.15-.68-.52-.01-.53.63-.01 1.08.59 1.23.84.72 1.25 1.87.9 2.33.69.07-.54.28-.9.51-1.11-1.78-.21-3.64-.92-3.64-4.11 0-.91.31-1.66.82-2.24-.08-.21-.36-1.06.08-2.2 0 0 .67-.22 2.2.86A7.45 7.45 0 0 1 8 3.87c.68 0 1.37.09 2.01.27 1.53-1.08 2.2-.86 2.2-.86.44 1.14.16 1.99.08 2.2.51.58.82 1.32.82 2.24 0 3.2-1.87 3.9-3.65 4.11.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .22.15.49.55.4A8.23 8.23 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z"
                />
              </svg>
            </a>
          </div>
          <div className="agenthub-navbar-items-slot">
            <NavbarItems items={rightItems} />
          </div>
          {!searchBarItem && (
            <NavbarSearch>
              <SearchBar />
            </NavbarSearch>
          )}
        </div>
      </div>
    </div>
  );
}
