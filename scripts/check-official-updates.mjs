import { readFile, writeFile, mkdir } from 'node:fs/promises';

const appId = '3065940';
const sources = {
  steamStore: `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`,
  steamNews: `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appId}&count=5&format=json`,
  officialGamePage: 'https://www.ww1gameseries.com/gallipoli/',
};

const statePath = new URL('../data/official-state.json', import.meta.url);
const candidatePath = new URL('../data/update-candidates.json', import.meta.url);

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'Gallipoli-Wiki-Update-Watch/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'Gallipoli-Wiki-Update-Watch/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`);
  return response.text();
}

function parsePrice(app) {
  const price = app?.price_overview;
  return price ? { value: price.final / 100, currency: price.currency } : { value: null, currency: null };
}

function parseReleaseDate(app) {
  const raw = app?.release_date?.date || '';
  const match = raw.match(/^(\d{1,2})\s+(\w+),\s+(\d{4})$/) || raw.match(/^(\w+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return raw || null;
  const day = Number.isNaN(Number(match[1])) ? Number(match[2]) : Number(match[1]);
  const monthName = Number.isNaN(Number(match[1])) ? match[1] : match[2];
  const month = new Date(`${monthName} 1, 2000`).getMonth() + 1;
  return `${match[3]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function diffState(previous, current) {
  const changes = [];
  for (const key of ['releaseDate', 'comingSoon', 'price', 'currency']) {
    if (previous[key] !== current[key]) changes.push({ field: key, before: previous[key] ?? null, after: current[key] ?? null });
  }
  if (previous.latestNews?.id !== current.latestNews?.id && current.latestNews) {
    changes.push({ field: 'latestNews', before: previous.latestNews ?? null, after: current.latestNews });
  }
  return changes;
}

const previous = JSON.parse(await readFile(statePath, 'utf8'));
const [storePayload, newsPayload, officialPage] = await Promise.all([
  fetchJson(sources.steamStore),
  fetchJson(sources.steamNews),
  fetchText(sources.officialGamePage),
]);
const store = storePayload?.[appId]?.data || {};
const price = parsePrice(store);
const latest = newsPayload?.appnews?.newsitems?.[0] || null;
const current = {
  releaseDate: parseReleaseDate(store),
  comingSoon: Boolean(store.release_date?.coming_soon),
  price: price.value,
  currency: price.currency,
  latestNews: latest ? { id: latest.gid, title: latest.title, url: latest.url, date: new Date(latest.date * 1000).toISOString() } : null,
  officialPageReachable: officialPage.length > 0,
  lastReviewed: new Date().toISOString().slice(0, 10),
};
const changes = diffState(previous, current);
const candidate = {
  checkedAt: new Date().toISOString(),
  status: changes.length ? 'review-required' : 'no-change',
  changes,
  current,
  sources,
  reviewNote: 'Check the official pages, approve the candidate, then update src/content.js or the relevant locale copy before publishing.',
};

await mkdir(new URL('../data', import.meta.url), { recursive: true });
await writeFile(candidatePath, `${JSON.stringify(candidate, null, 2)}\n`);
console.log(JSON.stringify(candidate, null, 2));
if (changes.length) process.exitCode = 10;
