const SITE_URL = 'https://www.gallipoligame.wiki';

const content = `# Gallipoli Wiki

> Independent fan-made field manual for Gallipoli, the fourth standalone WW1 Game Series entry. This site is not affiliated with BlackMill Games.

## Primary sections

- Homepage: ${SITE_URL}/
- Guide library: ${SITE_URL}/guides/
- Research index: ${SITE_URL}/research/
- FAQ: ${SITE_URL}/faq/
- About and editorial policy: ${SITE_URL}/about/

## High-intent pages

- Release date: ${SITE_URL}/research/02-gallipoli-game-release-date/
- Delay status: ${SITE_URL}/research/03-gallipoli-game-delayed/
- Price and editions: ${SITE_URL}/research/04-gallipoli-game-price/
- Gameplay and Expedition: ${SITE_URL}/research/05-gallipoli-game-gameplay/
- Single-player and bots: ${SITE_URL}/research/06-gallipoli-game-single-player/
- Platforms and availability: ${SITE_URL}/research/09-gallipoli-game-ps5/
- Classes and loadouts: ${SITE_URL}/guides/classes-and-loadouts/
- Weapons and progression: ${SITE_URL}/guides/weapons-and-progression/
- Reviews and community: ${SITE_URL}/research/15-gallipoli-game-review/

## Source policy

Official developer and storefront information is prioritized. Preview coverage and community discussion are labeled as secondary signals, and uncertain or pre-release claims remain marked until verified.

## Machine-readable discovery

- Sitemap: ${SITE_URL}/sitemap.xml
- Robots: ${SITE_URL}/robots.txt
`;

export function GET() {
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
