const SITE_URL = 'https://www.gallipoligame.wiki';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: 'www.gallipoligame.wiki',
  };
}
