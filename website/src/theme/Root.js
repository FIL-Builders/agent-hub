import React, {useEffect} from 'react';
import {clarity} from 'react-microsoft-clarity';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Root({children}) {
  const {siteConfig} = useDocusaurusContext();
  const projectId = siteConfig?.customFields?.clarityProjectId;

  useEffect(() => {
    if (!projectId) return;
    try {
      clarity.init(projectId);
    } catch (err) {
      // Avoid breaking the app if Clarity fails to init
      console.error('Clarity init failed', err);
    }
  }, [projectId]);

  return <>{children}</>;
}

