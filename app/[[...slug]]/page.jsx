import SiteClient from '../../src/SiteClient.jsx';
import StructuredData from '../../src/StructuredData.jsx';
import { allRoutes } from '../../src/site-routes.js';
import { formatSeoTitle, pageForRoute, renderToString, seoForRoute } from '../../src/main.js';
import { localeConfig, normalizeLocale, routeWithLocale, supportedLocales } from '../../src/i18n.js';

const SITE_URL = 'https://www.gallipoligame.wiki';

function contextFromParams(params) {
  const segments = Array.isArray(params?.slug) ? [...params.slug] : [];
  const locale = normalizeLocale(supportedLocales.includes(segments[0]) ? segments.shift() : 'en');
  return { locale, route: segments.length ? segments.join('/') : 'home' };
}

function canonicalPath(route, locale = 'en') {
  return routeWithLocale(route, locale);
}

export function generateStaticParams() {
  const routes = [...new Set(allRoutes())];
  return supportedLocales.flatMap((locale) => routes.map((route) => ({ slug: locale === 'en' ? (route === 'home' ? [] : route.split('/')) : [locale, ...(route === 'home' ? [] : route.split('/'))] })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { route, locale } = contextFromParams(await params);
  const page = pageForRoute(route);
  const seo = seoForRoute(route, page, locale);
  const title = formatSeoTitle(route, seo.title, locale);
  const canonical = new URL(canonicalPath(route, locale), SITE_URL).toString();
  const languages = Object.fromEntries(
    supportedLocales.map((item) => [
      localeConfig[item].htmlLang,
      new URL(canonicalPath(route, item), SITE_URL).toString(),
    ]),
  );
  languages['x-default'] = new URL(canonicalPath(route, 'en'), SITE_URL).toString();
  const image = new URL(seo.image, SITE_URL).toString();
  return {
    title,
    description: seo.description,
    authors: [{ name: 'Gallipoli Wiki editorial team' }],
    creator: 'Gallipoli Wiki editorial team',
    publisher: 'Gallipoli Wiki',
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description: seo.description,
      url: canonical,
      type: seo.isArticle ? 'article' : 'website',
      images: [image],
    },
    twitter: {
      title,
      description: seo.description,
      images: [image],
    },
  };
}

export default async function Page({ params }) {
  const { route, locale } = contextFromParams(await params);
  const page = pageForRoute(route);
  const seo = seoForRoute(route, page, locale);
  const canonical = new URL(canonicalPath(route, locale), SITE_URL).toString();
  return (
    <>
      <StructuredData route={route} locale={locale} page={page} seo={seo} canonical={canonical} />
      <div id="app" dangerouslySetInnerHTML={{ __html: renderToString(route, locale) }} />
      <SiteClient />
    </>
  );
}
