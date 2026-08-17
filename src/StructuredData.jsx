import { faqItems } from './content.js';
import { articleFaqItems } from './main.js';
import { localizedSeoText } from './i18n.js';

const SITE_URL = 'https://www.gallipoligame.wiki';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function absoluteUrl(value) {
  return new URL(value, SITE_URL).toString();
}

function faqEntities(items, locale) {
  return items.map((item) => ({
    '@type': 'Question',
    name: localizedSeoText(item.question, locale),
    acceptedAnswer: {
      '@type': 'Answer',
      text: localizedSeoText(item.answer, locale),
    },
  }));
}

export default function StructuredData({ route, locale, page, seo, canonical }) {
  const image = absoluteUrl(seo.image);
  const graph = [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Gallipoli Wiki',
      url: SITE_URL,
      logo: absoluteUrl('/favicon_io/android-chrome-192x192.webp'),
      description: 'Independent fan-made field manual for Gallipoli and the WW1 Game Series.',
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: 'Gallipoli Wiki',
      description: seo.description,
      inLanguage: locale,
      publisher: { '@id': ORGANIZATION_ID },
    },
  ];

  if (page) {
    graph.push({
      '@type': 'Article',
      '@id': `${canonical}#article`,
      url: canonical,
      headline: seo.title,
      description: seo.description,
      image,
      inLanguage: locale,
      dateModified: page.updated || '2026-08-17',
      author: { '@id': ORGANIZATION_ID },
      publisher: { '@id': ORGANIZATION_ID },
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
    });
  }

  graph.push({
    '@type': page ? 'WebPage' : 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    primaryImageOfPage: { '@type': 'ImageObject', contentUrl: image },
    ...(page ? { mainEntity: { '@id': `${canonical}#article` } } : {}),
  });

  if (route === 'faq' || page) {
    const items = route === 'faq' ? faqItems : articleFaqItems(page);
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      url: canonical,
      inLanguage: locale,
      mainEntity: faqEntities(items, locale),
    });
  }

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    .replace(/</g, '\\u003c');

  return <script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
