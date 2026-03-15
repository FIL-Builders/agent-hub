import React from 'react';
import {useLocation} from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';

export default function DocRootLayoutSidebar({sidebar}) {
  const {pathname} = useLocation();

  return (
    <aside className="theme-doc-sidebar-container docs-bloglike-sidebar">
      <DocSidebar sidebar={sidebar} path={pathname} />
    </aside>
  );
}
