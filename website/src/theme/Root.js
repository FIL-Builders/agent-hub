import '@nil-store/cybergrid-theme/theme.css';
import React, {useEffect} from 'react';
import {clarity} from 'react-microsoft-clarity';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {LivingGrid} from '@nil-store/cybergrid-theme/react/living-grid';

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

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const root = document.documentElement;
    const syncDarkClass = () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.classList.toggle('dark', isDark);
    };

    syncDarkClass();

    const observer = new MutationObserver(syncDarkClass);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="agenthub-bg" aria-hidden="true">
        <div className="agenthub-bg__grid cyber-grid-layer" />
        <div className="agenthub-bg__living">
          <LivingGrid />
        </div>
        <div className="agenthub-bg__glow agenthub-bg__glow--primary" />
        <div className="agenthub-bg__glow agenthub-bg__glow--accent" />
      </div>
      <div className="agenthub-site-shell">{children}</div>
    </>
  );
}
