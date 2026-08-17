import SiteClient from '../../src/SiteClient.jsx';
import { articlePages, hubPages, researchNotes } from '../../src/content.js';
import { pageForRoute, renderToString, seoForRoute } from '../../src/main.js';
import { localeConfig, normalizeLocale, routeWithLocale, supportedLocales } from '../../src/i18n.js';

const guideKinds = new Set(['Guide', 'Mode Guide', 'Arsenal Guide']);

function contextFromParams(params) {
  const segments = Array.isArray(params?.slug) ? [...params.slug] : [];
  const locale = normalizeLocale(supportedLocales.includes(segments[0]) ? segments.shift() : 'en');
  return { locale, route: segments.length ? segments.join('/') : 'home' };
}

function canonicalPath(route, locale = 'en') {
  return routeWithLocale(route, locale);
}

function allRoutes() {
  const articleRoutes = Object.entries(articlePages).map(([slug, page]) => `${guideKinds.has(page.kind) ? 'guides' : 'research'}/${slug}`);
  const noteRoutes = researchNotes.map((note) => `research/${note.slug}`);
  return ['home', 'guides', 'research', 'faq', 'about', ...Object.keys(hubPages), ...articleRoutes, ...noteRoutes];
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
  const title = seo.title.includes('Gallipoli Wiki') ? seo.title : `${seo.title} — Gallipoli Wiki`;
  const canonical = canonicalPath(route, locale);
  return {
    title,
    description: seo.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(supportedLocales.map((item) => [localeConfig[item].htmlLang, canonicalPath(route, item)])),
    },
    openGraph: {
      title,
      description: seo.description,
      url: canonical,
      type: seo.isArticle ? 'article' : 'website',
      images: [seo.image],
    },
    twitter: {
      title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export default async function Page({ params }) {
  const { route, locale } = contextFromParams(await params);
  return (
    <>
      <div id="app" dangerouslySetInnerHTML={{ __html: renderToString(route, locale) }} />
      <SiteClient />
    </>
  );
}
