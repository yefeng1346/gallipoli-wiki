import { allRoutes } from '../src/site-routes.js';
import { routeWithLocale, supportedLocales } from '../src/i18n.js';

const SITE_URL = 'https://www.gallipoligame.wiki';
const LAST_MODIFIED = new Date('2026-08-17T00:00:00.000Z');

function absoluteRoute(route, locale) {
  return new URL(routeWithLocale(route, locale), SITE_URL).toString();
}

export default function sitemap() {
  const routes = [...new Set(allRoutes())];

  return routes.flatMap((route) => {
    const languages = Object.fromEntries(
      supportedLocales.map((locale) => [locale, absoluteRoute(route, locale)]),
    );
    languages['x-default'] = absoluteRoute(route, 'en');

    return supportedLocales.map((locale) => ({
      url: absoluteRoute(route, locale),
      lastModified: LAST_MODIFIED,
      alternates: { languages },
    }));
  });
}
