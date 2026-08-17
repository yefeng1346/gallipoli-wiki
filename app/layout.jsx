import '../src/styles.css';
import '../src/locale-overrides.css';
import '../src/article-layout-fixes.css';

export const metadata = {
  metadataBase: new URL('https://gallipoli.wiki'),
  title: 'Gallipoli Wiki — Guides, Classes & Weapons',
  description: 'Gallipoli Wiki — a practical field manual for classes, weapons, Expedition mode, platforms and release details.',
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico' },
      { url: '/favicon_io/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/favicon_io/apple-touch-icon.png',
  },
  openGraph: {
    siteName: 'Gallipoli Wiki',
    type: 'website',
    images: ['/images/gallipoli-steam-background.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/gallipoli-steam-background.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { const match = window.location.pathname.match(/^\\/(tr|de|fr)(?:\\/|$)/); document.documentElement.lang = match ? match[1] : 'en'; })();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
