import React from 'react';
import Head from '@docusaurus/Head';

export default function QRRedirect() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use replace to avoid keeping /qr in history
      window.location.replace('/agents/');
    }
  }, []);

  return (
    <>
      <Head>
        {/* SSR-friendly immediate redirect */}
        <meta httpEquiv="refresh" content="0; url=/agents/" />
        <link rel="canonical" href="/agents/" />
      </Head>
      <main style={{ padding: '2rem' }}>
        <p>
          Redirecting to <a href="/agents/">/agents</a>…
        </p>
      </main>
    </>
  );
}

