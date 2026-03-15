import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemContent from '@theme/DocItem/Content';
import ContentVisibility from '@theme/ContentVisibility';

export default function DocItemLayout({children}) {
  const {metadata, frontMatter, toc} = useDoc();
  const hiddenToc = frontMatter.hide_table_of_contents;
  const mobileToc = !hiddenToc && toc.length > 0 ? <DocItemTOCMobile /> : undefined;

  return (
    <div className="docs-article-shell">
      <ContentVisibility metadata={metadata} />
      <DocVersionBanner />
      <article>
        <DocVersionBadge />
        {mobileToc}
        <DocItemContent>{children}</DocItemContent>
        <DocItemFooter />
      </article>
      <DocItemPaginator />
    </div>
  );
}
