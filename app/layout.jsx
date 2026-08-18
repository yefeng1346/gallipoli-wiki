import '../src/styles.css';
import '../src/locale-overrides.css';
import '../src/article-layout-fixes.css';

const SITE_URL = 'https://www.gallipoligame.wiki';

export const metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SKP8P4S15K" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SKP8P4S15K');`,
          }}
        />
        <link rel="preload" as="image" href="/images/gallipoli-steam-background.avif" type="image/avif" media="(min-width: 761px)" />
        <link rel="preload" as="image" href="/images/gallipoli-steam-background-mobile.avif" type="image/avif" media="(max-width: 760px)" />
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
