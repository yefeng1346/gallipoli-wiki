import { articlePages, hubPages, researchNotes } from './content.js';

const guideKinds = new Set(['Guide', 'Mode Guide', 'Arsenal Guide']);

export function allRoutes() {
  const articleRoutes = Object.entries(articlePages).map(([slug, page]) => (
    `${guideKinds.has(page.kind) ? 'guides' : 'research'}/${slug}`
  ));
  const noteRoutes = researchNotes.map((note) => `research/${note.slug}`);
  return ['home', 'guides', 'research', 'faq', 'about', ...Object.keys(hubPages), ...articleRoutes, ...noteRoutes];
}
