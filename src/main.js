import { articlePages, guideCards, researchNotes, researchPageDetails, faqItems, filters, stats, quickStartSteps, hubPages } from './content.js';
import { localeConfig, localeFromPath, normalizeLocale, routeFromPath, routeWithLocale, translateRenderedHtml, translateText, localizedSeoText } from './i18n.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const logoPath = '/favicon_io/android-chrome-192x192.webp';
const AD_CONTAINER_ID = 'container-a96883afe0ac9e788c209bad83b67040';
let activeTemplateLocale = 'en';

function imageStyle(variable, path, extra = '') {
  if (!path) return '';
  const base = path.replace(/\.(avif|webp|jpe?g|png)$/i, '');
  return ` style="${extra ? `${extra}; ` : ''}--${variable}: url('${path}'); --${variable}-modern: image-set(url('${base}.avif') type('image/avif'), url('${base}.webp') type('image/webp'), url('${path}') type('image/jpeg')); --${variable}-mobile: image-set(url('${base}-mobile.avif') type('image/avif'), url('${base}-mobile.webp') type('image/webp'), url('${path}') type('image/jpeg'))"`;
}

function templateText(value) {
  return translateText(value, activeTemplateLocale);
}

function localizedReadTime(value) {
  const match = String(value).match(/^(\d+)\s+min\s+read$/i);
  if (!match || activeTemplateLocale === 'en') return value;
  const units = { tr: 'dk okuma', de: 'Min. Lesezeit', fr: 'min de lecture' };
  return `${match[1]} ${units[activeTemplateLocale] || 'min'}`;
}

function localizedTheatreVisual() {
  const labels = {
    en: ['Ottoman', 'Fronts'],
    tr: ['Osmanlı', 'Cepheleri'],
    de: ['Osmanische', 'Fronten'],
    fr: ['Fronts', 'ottomans'],
  };
  return labels[activeTemplateLocale] || labels.en;
}

function localizedDeployTitle() {
  const labels = {
    en: ['BEFORE YOU', 'DEPLOY'],
    tr: ['KONUŞLANMADAN', 'ÖNCE'],
    de: ['VOR DEM', 'EINSATZ'],
    fr: ['AVANT LE', 'DÉPLOIEMENT'],
  };
  return labels[activeTemplateLocale] || labels.en;
}

const icons = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  compass: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m14.8 9.2-1.9 3.7-3.7 1.9 1.9-3.7 3.7-1.9Z"/></svg>',
  crosshair: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/><path d="M12 2v3.5M12 18.5V22M2 12h3.5M18.5 12H22"/></svg>',
  flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4m0 1c4-3 7 2 12-1v9c-5 3-8-2-12 1"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 2 5 13h6l-.4 9L19 10h-6l.4-8Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6V6Z"/></svg>',
};

function icon(name, className = '') {
  return `<span class="icon ${className}">${icons[name] || icons.arrow}</span>`;
}

function cleanRoute(value) {
  return value.replace(/^#?\/?/, '').replace(/\/$/, '') || 'home';
}

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('/')) return routeFromPath(hash);
  return window.location.pathname.endsWith('/index.html') ? 'home' : routeFromPath(window.location.pathname);
}

function getLocale() {
  const hash = window.location.hash.replace(/^#/, '');
  return normalizeLocale(hash.startsWith('/') ? localeFromPath(hash) : localeFromPath(window.location.pathname));
}

function noteSlug(note) {
  return note.slug;
}

function stateTone(state) {
  return ['Confirmed', 'Current schedule'].includes(state) ? 'confirmed' : 'watch';
}

function routeHref(route, locale = 'en') {
  return routeWithLocale(cleanRoute(route), locale);
}

function logoTemplate() {
  return `<span class="brand-mark"><img src="${logoPath}" width="192" height="192" alt="Gallipoli Wiki logo" decoding="async" /></span>`;
}

const navHubItems = {
  guides: [
    { route: 'guides', label: 'Guide Library', description: 'The complete field manual: beginner routes, classes, Expedition and weapons progression.' },
    { route: 'guides/beginner-guide', label: "Beginner's Guide", description: 'The first deployment route: objective flow, squad rhythm and combat habits.' },
    { route: 'guides/classes-and-loadouts', label: 'Classes & Loadouts', description: 'Ten historic roles, squad utility and first loadout decisions.' },
    { route: 'guides/expedition-mode', label: 'Expedition Mode', description: 'Sectors, capture-then-secure objectives and push momentum.' },
    { route: 'guides/weapons-and-progression', label: 'Weapons & Progression', description: '50+ authentic weapons and equipment, read by role and terrain.' },
  ],
  classes: [
    { route: 'classes', label: 'Classes Hub', description: 'A role-first starting point for squads, loadouts and utility.' },
    { route: 'guides/classes-and-loadouts', label: 'Classes & Loadouts', description: 'Ten historic roles and the gap your squad needs you to fill.' },
    { route: 'research/07-gallipoli-game-squads', label: 'Squads & Team Play', description: 'Coordination, role gaps and the language of a good push.' },
    { route: 'guides/weapons-and-progression', label: 'Weapons & Progression', description: 'Build equipment around the job and ground in front of you.' },
  ],
  maps: [
    { route: 'maps', label: 'Maps Hub', description: 'A theatre-first index for beaches, desert and urban fronts.' },
    { route: 'research/17-gallipoli-game-wiki', label: 'Ottoman Fronts', description: 'The setting, named theatres and the environments that shape the fight.' },
    { route: 'guides/expedition-mode', label: 'Expedition Mode', description: 'Sectors, randomized objectives and the capture-then-secure rhythm.' },
    { route: 'research/05-gallipoli-game-gameplay', label: 'Gameplay & Expedition', description: 'Movement, suppression, momentum and practical map reading.' },
  ],
  tools: [
    { route: 'tools', label: 'Tools Hub', description: 'Shortcuts for planning a first deployment and finding answers quickly.' },
    { route: 'guides/beginner-guide', label: 'Quick Start Route', description: 'The first six decisions to make before joining the line.' },
    { route: 'guides/classes-and-loadouts', label: 'Class Picker', description: 'Choose a role by squad gap, terrain and objective pressure.' },
    { route: 'faq', label: 'FAQ', description: 'Common questions about the game, systems and platforms.' },
  ],
  updates: [
    { route: 'updates', label: 'Updates Hub', description: 'Launch timing, delay status, price signals and community watch.' },
    { route: 'research/02-gallipoli-game-release-date', label: 'Release Date', description: 'The current official schedule: August 20, 2026.' },
    { route: 'research/03-gallipoli-game-delayed', label: 'Delay Status', description: 'Separate the confirmed schedule from rumor and future changes.' },
    { route: 'research/04-gallipoli-game-price', label: 'Price & Editions', description: 'Keep regional pricing tied to a live storefront.' },
  ],
};

function hubDropdownTemplate(hub) {
  const items = navHubItems[hub];
  const label = hub.charAt(0).toUpperCase() + hub.slice(1);
  return `<div class="nav-panel" role="menu" aria-label="${label} categories"><div class="nav-panel__head"><span>FIELD MANUAL / ${hub.toUpperCase()}</span><b>${String(items.length - 1).padStart(2, '0')} ROUTES</b></div><ul class="panel-list">${items.map((item, index) => `<li><a class="panel-link js-route ${index === 0 ? 'panel-link--featured' : ''}" data-route="${item.route}" href="${routeHref(item.route)}" role="menuitem"><span class="panel-label">${item.label}</span><span class="panel-desc">${item.description}</span></a></li>`).join('')}</ul></div>`;
}

function languageMenuTemplate(locale = 'en') {
  const current = normalizeLocale(locale);
  return `<div class="language-picker"><button class="language-btn" type="button" aria-label="Change language" aria-expanded="false">${current.toUpperCase()} <span>⌄</span></button><div class="language-menu" role="menu" aria-label="Language"><a data-language-link data-locale="en" href="${routeWithLocale('home', 'en')}" class="${current === 'en' ? 'active' : ''}" role="menuitem">EN <span>English</span></a><a data-language-link data-locale="tr" href="${routeWithLocale('home', 'tr')}" class="${current === 'tr' ? 'active' : ''}" role="menuitem">TR <span>Türkçe</span></a><a data-language-link data-locale="de" href="${routeWithLocale('home', 'de')}" class="${current === 'de' ? 'active' : ''}" role="menuitem">DE <span>Deutsch</span></a><a data-language-link data-locale="fr" href="${routeWithLocale('home', 'fr')}" class="${current === 'fr' ? 'active' : ''}" role="menuitem">FR <span>Français</span></a></div></div>`;
}

function headerTemplate(active = 'overview', locale = 'en') {
  const dropdown = (hub) => `<div class="nav-item nav-item--dropdown ${active === hub ? 'active' : ''}"><a class="nav-link nav-panel-toggle" data-route="${hub}" href="${routeHref(hub)}" aria-haspopup="true" aria-expanded="false">${hub.charAt(0).toUpperCase() + hub.slice(1)} <svg class="caret" viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></a>${hubDropdownTemplate(hub)}</div>`;
  return `<header class="site-header"><a class="brand js-route" data-route="home" href="/" aria-label="Gallipoli Field Manual home">${logoTemplate()}<span class="brand-copy"><strong>GALLIPOLI</strong><small>FIELD MANUAL / WIKI</small></span></a><nav class="main-nav" aria-label="Main navigation"><a class="${active === 'overview' ? 'active' : ''} js-route" data-route="home" href="/">Overview</a>${dropdown('guides')}${dropdown('classes')}${dropdown('maps')}${dropdown('tools')}${dropdown('updates')}<a class="${active === 'research' ? 'active' : ''} js-route" data-route="research" href="/research/">Research</a><a class="${active === 'faq' ? 'active' : ''} js-route" data-route="faq" href="/faq/">FAQ</a><a class="${active === 'about' ? 'active' : ''} js-route" data-route="about" href="/about/">About</a></nav><div class="header-actions"><button class="header-search" type="button" data-focus-search aria-label="Search field manual">${icon('search')}<span>Search</span><kbd>/</kbd></button>${languageMenuTemplate(locale)}<button class="menu-btn" type="button" aria-label="Open menu"><span></span><span></span></button></div></header>`;
}

function footerTemplate() {
  const edition = { en: 'ENGLISH EDITION', tr: 'TÜRKÇE SÜRÜM', de: 'DEUTSCHE AUSGABE', fr: 'ÉDITION FRANÇAISE' }[activeTemplateLocale] || 'ENGLISH EDITION';
  return `<footer class="site-footer content-width"><div class="footer-top"><a class="brand js-route" data-route="home" href="/">${logoTemplate()}<span class="brand-copy"><strong>GALLIPOLI</strong><small>FIELD MANUAL / WIKI</small></span></a><p>Independent fan-made guide site for Gallipoli — the fourth WW1 Game Series entry. Not affiliated with BlackMill Games.</p><div class="footer-links"><a href="https://www.ww1gameseries.com/gallipoli/" target="_blank" rel="noreferrer">${templateText('Official site')}</a><a href="https://store.steampowered.com/app/3065940/Gallipoli/" target="_blank" rel="noreferrer">Steam</a><a href="https://discord.com/invite/ww1gameseries" target="_blank" rel="noreferrer">Discord</a><a href="https://www.youtube.com/@WW1GameSeries" target="_blank" rel="noreferrer">YouTube</a><a href="https://steamcommunity.com/app/3065940" target="_blank" rel="noreferrer">${templateText('Community')}</a><a href="https://www.reddit.com/r/WW1GameSeries/" target="_blank" rel="noreferrer">Reddit</a></div></div><div class="footer-bottom"><span>© 2026 GALLIPOLI FIELD MANUAL</span><span>${templateText('PRE-RELEASE EDITION')}</span><span>${edition} <i></i></span></div></footer>`;
}

function editorialTrustTemplate() {
  return `<section class="editorial-trust content-width" aria-label="Editorial policy"><div><div class="eyebrow">EDITORIAL STANDARD</div><strong>Independent fan-made wiki</strong><p>Official developer and storefront pages lead. Preview coverage and community signals are labeled separately, and open questions stay marked until they are verified.</p></div><div class="editorial-trust__meta"><span>Last reviewed: 17 Aug 2026</span><span>Sources: developer · stores · community</span><a class="js-route" data-route="about" href="${routeHref('about')}">Read the editorial note ${icon('arrow')}</a></div></section>`;
}

function adSlotTemplate() {
  return '<div class="ad-slot" data-ad-slot aria-label="Advertisement"></div>';
}

function insertAdSlot(body) {
  const placements = [
    [/(<section class="hero section-frame">[\s\S]*?<\/section>)(<section class="stat-rail)/, `$1${adSlotTemplate()}$2`],
    [/(<section class="hub-hero reveal">[\s\S]*?<\/section>)(<section class="hub-grid)/, `$1${adSlotTemplate()}$2`],
    [/(<div class="directory-hero reveal">[\s\S]*?)(<div class="directory-grid)/, `$1${adSlotTemplate()}$2`],
    [/(<div class="directory-hero reveal">[\s\S]*?)(<div class="research-layout research-layout--page)/, `$1${adSlotTemplate()}$2`],
    [/(<section class="faq-hero reveal">[\s\S]*?<\/section>)(<section class="faq-layout)/, `$1${adSlotTemplate()}$2`],
    [/(<section class="article-hero content-width reveal">[\s\S]*?<\/section>)(<section class="(?:article-facts|answer-summary|article-content))/, `$1${adSlotTemplate()}$2`],
  ];

  for (const [pattern, replacement] of placements) {
    if (pattern.test(body)) return body.replace(pattern, replacement);
  }
  return `${body}${adSlotTemplate()}`;
}

function quickStartTemplate() {
  return `<section class="quick-start-section content-width" id="quick-start"><div class="section-heading section-heading--split reveal"><div><div class="eyebrow">QUICK START <span class="eyebrow-divider"></span> FIRST DEPLOYMENT</div><h2>YOUR FIRST<br /><em>DEPLOYMENT</em></h2></div><p>Use the same order a new player needs on day one: know the schedule, pick a role, read the objective and build from there.</p></div><ol class="quick-start-grid">${quickStartSteps.map((step) => `<li class="quick-start-card reveal"><span class="quick-start-card__number">${step.number}</span><div><span class="quick-start-card__label">${step.label}</span><h3>${step.title}</h3><p>${step.description}</p><a class="text-link js-route" data-route="${step.route}" href="${routeHref(step.route)}">Open route ${icon('arrow')}</a></div></li>`).join('')}</ol></section>`;
}

function shellTemplate(body, active = 'overview') {
  const renderedBody = body.includes('id="top"') ? body.replace('<section class="briefing-section', `${quickStartTemplate()}<section class="briefing-section`) : body;
  const bodyWithAd = insertAdSlot(renderedBody);
  return `<div class="site-shell"><div class="ambient ambient--one"></div><div class="ambient ambient--two"></div>${headerTemplate(active, activeTemplateLocale)}${bodyWithAd}${editorialTrustTemplate()}${footerTemplate()}<div class="toast" role="status" aria-live="polite"></div></div>`;
}

function guideCardTemplate(card) {
  return `<article class="guide-card guide-card--${card.accent}"${imageStyle('card-image', card.image)} data-route="${card.href}"><div class="guide-card__top"><span class="card-number">${card.number}</span><span class="card-type">${card.type}</span>${icon(card.icon, 'guide-card__icon')}</div><div class="guide-card__body"><h3>${card.title}</h3><p>${card.description}</p></div><div class="guide-card__footer"><span>${card.meta}</span><a class="text-link js-route" data-route="${card.href}" href="${card.href}">Open guide ${icon('arrow')}</a></div></article>`;
}

function noteTemplate(note) {
  const href = `/research/${noteSlug(note)}/`;
  return `<article class="note-card" data-route="research/${noteSlug(note)}" data-category="${note.category}" data-search="${[note.title, note.category, note.tag, note.summary].join(' ').toLowerCase()}"><div class="note-card__rail"><span>${note.id}</span><i></i></div><div class="note-card__content"><div class="note-card__meta"><span class="note-category">${note.category}</span><span class="note-state note-state--${stateTone(note.state)}">${note.state}</span></div><h3>${note.title}</h3><p>${note.summary}</p><div class="note-card__bottom"><span class="keyword-pill">${note.tag}</span></div></div><a class="note-card__open js-route" data-route="research/${noteSlug(note)}" href="${href}" aria-label="Open ${note.title}">${icon('arrow')}</a></article>`;
}

function homeTemplate() {
  return shellTemplate(`<main id="top"><section class="hero section-frame"><div class="hero__grid"></div><div class="hero__copy reveal"><div class="eyebrow"><span class="eyebrow-dot"></span> WW1 GAME SERIES <span class="eyebrow-divider"></span> COMMUNITY WIKI</div><h1>GALLIPOLI<span class="title-slash">/</span><em>THE OTTOMAN<br />FRONT</em></h1><p class="hero__lede">A practical field manual for the next chapter of the WW1 Game Series. Learn the battlefield, choose your class, and arrive ready for the first 50-player push.</p><div class="hero__actions"><a class="button button--primary" href="#guides" data-scroll="guides">Start with the basics ${icon('arrow')}</a><a class="button button--ghost" href="#trailer" data-scroll="trailer">Watch official trailer ${icon('play')}</a></div></div><div class="hero__visual reveal reveal--delay"><div class="visual-frame"><div class="visual-image"></div><div class="visual-scrim"></div><div class="visual-stamp">OT—01</div><div class="visual-caption"><span>ARCHIVE IMAGE / OFFICIAL TRAILER</span><strong>Across the Ottoman Fronts</strong></div><div class="visual-crosshair">＋</div></div><div class="status-card"><span class="status-card__label">CURRENT BRIEF</span><strong>Confirmed release<br /><b>20 AUG 2026</b></strong><span class="status-card__rule"></span><div class="status-card__facts"><span><b>25v25</b> objective PvP</span><span><b>PC + CONSOLE</b> cross-platform</span></div><a class="js-route" data-route="research/02-gallipoli-game-release-date" href="/research/02-gallipoli-game-release-date/">Open release notes ${icon('arrow')}</a></div></div></section><section class="stat-rail" aria-label="Gallipoli game facts">${stats.map((stat) => `<div class="stat-item"><strong>${stat.value}</strong><span>${stat.label}</span></div>`).join('')}<div class="stat-rail__mark">GM–2026<br /><span>FIELD MANUAL</span></div></section><section class="manual-section content-width" id="guides"><div class="section-heading reveal"><div><div class="eyebrow">01 <span class="eyebrow-divider"></span> START HERE</div><h2>THE FIELD MANUAL</h2></div><p>Four clear routes into Gallipoli — built for players who want useful answers before the first deployment.</p></div><div class="guide-grid">${guideCards.map(guideCardTemplate).join('')}</div></section><section class="briefing-section content-width" id="research"><div class="section-heading section-heading--split reveal"><div><div class="eyebrow">02 <span class="eyebrow-divider"></span> RESEARCH INDEX</div><h2>THE BRIEFING ROOM</h2></div><p>19 notes on release dates, platforms, modes, weapons and community signals. Each entry is labeled so you can see what is confirmed and what is still unknown.</p></div><div class="research-layout"><aside class="research-aside"><div class="aside-label">FILTER THE INDEX</div><div class="filter-list">${filters.map((filter, index) => `<button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${filter}"><span>${filter}</span><b>${filter === 'All notes' ? '19' : researchNotes.filter((n) => n.category === filter).length || '—'}</b></button>`).join('')}</div><div class="source-note"><span class="source-note__icon">◎</span><div><strong>Information status</strong><p>See confirmed facts, open questions and community signals at a glance.</p></div></div></aside><div class="research-main"><div class="research-toolbar"><label class="search-field">${icon('search')}<input id="research-search" type="search" placeholder="Search guides, platforms, classes…" autocomplete="off" /><kbd>/</kbd></label><span id="result-count">19 notes</span></div><div class="notes-grid" id="notes-grid">${researchNotes.map(noteTemplate).join('')}</div><div class="empty-state" id="empty-state" hidden>No field notes match that search. Try “release”, “platform”, or “weapons”.</div></div></div></section><section class="trailer-section content-width" id="trailer"><div class="trailer-media reveal" data-video-id="hlnSz-JPiBk"><div class="trailer-image"></div><div class="trailer-overlay"></div><button class="play-button" type="button" aria-label="Play Gallipoli official trailer">${icon('play')}</button><div class="trailer-tag">OFFICIAL TRAILER / 01:32</div></div><div class="trailer-copy reveal reveal--delay"><div class="eyebrow">03 <span class="eyebrow-divider"></span> WATCH THE FRONT</div><h2>SEE THE<br /><em>FRONTLINE</em></h2><p>The official release-date re-reveal trailer is the clearest snapshot of Gallipoli so far: beach landings, harsh terrain, authentic kit and a battle built around the next objective.</p><div class="trailer-details"><span><b>01</b> Official reveal</span><span><b>02</b> Release-date reveal</span><span><b>03</b> Steam · PS5 · Xbox</span></div></div></section><section class="about-section content-width" id="about"><div class="about-copy reveal"><div class="eyebrow">04 <span class="eyebrow-divider"></span> ORIENTATION</div><h2>WHAT IS<br /><em>GALLIPOLI?</em></h2><p>Gallipoli is a historical World War I multiplayer FPS by BlackMill Games and the fourth standalone entry in the WW1 Game Series. It moves the series to the Ottoman Fronts — from beach landings to desert and city combat.</p><p>The game is built around 50-player objective battles, historic classes, authentic weapons and squad-level decisions where the next few meters matter.</p><a class="text-link js-route" data-route="about" href="/about/">Browse the full orientation ${icon('arrow')}</a></div><div class="about-facts"><div class="facts-head"><span>AT A GLANCE</span><span>GM–01 / 2026</span></div><div class="facts-grid"><div><small>DEVELOPER</small><strong>BlackMill Games</strong></div><div><small>GENRE</small><strong>Historical tactical FPS</strong></div><div><small>BATTLE SIZE</small><strong>50 players</strong></div><div><small>PLATFORMS</small><strong>PC · PS5 · Xbox Series</strong></div><div><small>SETTING</small><strong>Ottoman Fronts</strong></div><div><small>STATUS</small><strong class="facts-status"><i></i> Pre-release</strong></div></div><div class="facts-footer"><span>“Authentic detail, made playable.”</span><span>COMMUNITY WIKI / 2026 EDITION</span></div></div></section><section class="final-cta content-width reveal"><div><div class="eyebrow">END OF BRIEFING</div><h2>READY FOR<br /><em>THE FRONT?</em></h2></div><div class="final-cta__right"><p>Start with the beginner route, keep the research index bookmarked, and come back when the first official loadout tables land.</p><div class="hero__actions"><a class="button button--primary js-route" data-route="guides" href="/guides/">Enter the manual ${icon('arrow')}</a><a class="button button--ghost" href="https://store.steampowered.com/app/3065940/Gallipoli/" target="_blank" rel="noreferrer">Wishlist on Steam ${icon('arrow')}</a></div></div></section></main>`, 'overview');
}

function hubTemplate(page) {
  const [titleTop, titleBottom] = page.title.split('\n');
  return shellTemplate(`<main class="hub-page content-width"><section class="hub-hero reveal"><div class="hub-hero__copy"><div class="eyebrow">${page.eyebrow}</div><h1>${titleTop}<br /><em>${titleBottom}</em></h1><p>${page.intro}</p><div class="hub-hero__meta"><span>${String(page.cards.length).padStart(2, '0')} routes</span><span>Player-first index</span><span>Pre-release edition</span></div></div><div class="hub-hero__visual"${imageStyle('hub-image', page.image, `--hub-accent: ${page.accent}`)}><span>FIELD MANUAL / HUB</span><strong>${page.active.toUpperCase()}</strong><small>READ THE FRONT BY TOPIC</small></div></section><section class="hub-grid" aria-label="${titleTop} routes">${page.cards.map((card) => `<a class="hub-card js-route" data-route="${card.route}" href="${routeHref(card.route)}"${imageStyle('hub-card-image', card.image, `--hub-accent: ${page.accent}`)}><span class="hub-card__number">${card.number}</span><span class="hub-card__type">${card.type}</span><h2>${card.title}</h2><p>${card.description}</p><span class="text-link">Open route ${icon('arrow')}</span></a>`).join('')}</section><section class="hub-footer"><div><div class="eyebrow">KEEP THE MANUAL CLOSE</div><p>Use the hub as a starting point, then follow each route into the full guide or research note.</p></div><a class="button button--ghost js-route" data-route="research" href="/research/">Browse research index ${icon('arrow')}</a></section></main>`, page.active);
}

function directoryTemplate() {
  return shellTemplate(`<main class="directory-page content-width"><div class="directory-hero reveal"><div><div class="eyebrow">FIELD MANUAL / 00</div><h1>THE GUIDE<br /><em>LIBRARY</em></h1></div><p>Choose a route for practical answers on objectives, classes, Expedition Mode and weapons progression.</p></div><div class="directory-grid">${guideCards.map((card) => `<a class="directory-card guide-card--${card.accent} js-route"${imageStyle('card-image', card.image)} data-route="${card.href}" href="${card.href}"><span class="directory-card__number">${card.number}</span><span class="directory-card__type">${card.type}</span>${icon(card.icon, 'directory-card__icon')}<h2>${card.title}</h2><p>${card.description}</p><span class="text-link">Open guide ${icon('arrow')}</span></a>`).join('')}</div><div class="directory-foot reveal"><div class="eyebrow">MORE IN THE INDEX</div><p>Looking for release dates, platforms, community coverage or the developer trail?</p><a class="button button--ghost js-route" data-route="research" href="/research/">Open research index ${icon('arrow')}</a></div></main>`, 'guides');
}

function researchDirectoryTemplate() {
  return shellTemplate(`<main class="directory-page content-width"><div class="directory-hero reveal"><div><div class="eyebrow">FIELD MANUAL / 19 NOTES</div><h1>RESEARCH<br /><em>INDEX</em></h1></div><p>Browse release dates, platforms, modes, weapons and community signals. Each note shows what is confirmed and what is still unknown.</p></div><div class="research-layout research-layout--page"><aside class="research-aside"><div class="aside-label">FILTER THE INDEX</div><div class="filter-list">${filters.map((filter, index) => `<button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${filter}"><span>${filter}</span><b>${filter === 'All notes' ? '19' : researchNotes.filter((n) => n.category === filter).length || '—'}</b></button>`).join('')}</div><div class="source-note"><span class="source-note__icon">◎</span><div><strong>Information status</strong><p>See confirmed facts, open questions and community signals at a glance.</p></div></div></aside><div class="research-main"><div class="research-toolbar"><label class="search-field">${icon('search')}<input id="research-search" type="search" placeholder="Search guides, platforms, classes…" autocomplete="off" /><kbd>/</kbd></label><span id="result-count">19 notes</span></div><div class="notes-grid" id="notes-grid">${researchNotes.map(noteTemplate).join('')}</div><div class="empty-state" id="empty-state" hidden>No field notes match that search.</div></div></div></main>`, 'research');
}

function faqTemplate() {
  const groups = [...new Set(faqItems.map((item) => item.category))];
  return shellTemplate(`<main class="faq-page content-width"><section class="faq-hero reveal"><div><div class="eyebrow">FIELD MANUAL / QUICK ANSWERS</div><h1>FREQUENTLY<br /><em>ASKED</em></h1></div><div class="faq-hero__brief"><p>Short, practical answers to the questions players usually ask before they join the Ottoman Fronts.</p><div class="faq-hero__facts"><span><b>${faqItems.length}</b> answers</span><span><b>03</b> topic groups</span><span><b>20 AUG 2026</b> release date</span></div></div></section><section class="faq-layout"><aside class="faq-index"><span class="aside-label">JUMP TO A TOPIC</span>${groups.map((group, index) => `<a href="#faq-${index + 1}">${String(index + 1).padStart(2, '0')} ${group}</a>`).join('')}<div class="faq-index__note"><span>◎</span><p>Answers reflect the current pre-release information and will grow with the live game.</p></div></aside><div class="faq-list">${groups.map((group, groupIndex) => `<section class="faq-group" id="faq-${groupIndex + 1}"><div class="faq-group__head"><span>${String(groupIndex + 1).padStart(2, '0')}</span><h2>${group}</h2></div>${faqItems.filter((item) => item.category === group).map((item, index) => `<details class="faq-item" ${groupIndex === 0 && index === 0 ? 'open' : ''}><summary><span class="faq-item__number">${String(faqItems.indexOf(item) + 1).padStart(2, '0')}</span><span class="faq-item__question">${item.question}</span><span class="faq-item__toggle" aria-hidden="true"></span></summary><div class="faq-item__answer"><p>${item.answer}</p>${item.link ? `<a class="text-link js-route" data-route="${item.link.route}" href="${routeHref(item.link.route)}">${item.link.label} ${icon('arrow')}</a>` : ''}</div></details>`).join('')}</section>`).join('')}</div></section></main>`, 'faq');
}

function aboutTemplate() {
  return shellTemplate(`<main class="article-page about-page"><section class="article-hero content-width reveal"><div class="article-hero__copy"><div class="eyebrow">FIELD MANUAL / ORIENTATION</div><h1>ABOUT<br /><em>GALLIPOLI</em></h1><p>Gallipoli is a historical World War I multiplayer FPS by BlackMill Games and the fourth standalone entry in the WW1 Game Series.</p></div><div class="article-hero__visual about-visual"${imageStyle('article-image', '/images/gallipoli-sector-desert.jpg')}><div class="about-visual__logo">${logoTemplate()}</div><span>GM–01 / 2026</span><strong>Authentic detail,<br />made playable.</strong></div></section><section class="article-content content-width"><article class="article-main"><div class="article-kicker">THE ORIENTATION</div><h2>A new front for a familiar series</h2><p>Gallipoli moves the WW1 Game Series into the Ottoman Fronts, with beach landings, desert approaches, city combat and a 50-player objective-focused format. The game combines historic classes, authentic weapons and squad decisions that make the next few metres matter.</p><p>This fan-made wiki provides beginner routes, release tracking and practical references for classes, modes, weapons and platforms.</p><div class="article-callout"><span>EDITORIAL NOTE</span><strong>This site is independent and not affiliated with BlackMill Games or the WW1 Game Series.</strong></div><h2>What this wiki covers</h2><div class="coverage-grid"><div><b>01</b><strong>Guides</strong><span>Beginner, classes, Expedition and weapons.</span></div><div><b>02</b><strong>Research</strong><span>19 keyword trails with visible status labels.</span></div><div><b>03</b><strong>Platforms</strong><span>PC, PS5, Xbox and storefront notes.</span></div><div><b>04</b><strong>Community</strong><span>Reviews, Reddit and launch listening posts.</span></div></div></article><aside class="article-sidebar"><div class="sidebar-block"><span class="sidebar-label">AT A GLANCE</span><div class="sidebar-facts"><span><small>DEVELOPER</small><b>BlackMill Games</b></span><span><small>GENRE</small><b>Historical tactical FPS</b></span><span><small>BATTLE SIZE</small><b>50 players</b></span><span><small>STATUS</small><b class="facts-status"><i></i> Pre-release</b></span></div></div><div class="sidebar-block"><span class="sidebar-label">CONTINUE READING</span><a class="sidebar-link js-route" data-route="guides" href="/guides/">Guide library ${icon('arrow')}</a><a class="sidebar-link js-route" data-route="research" href="/research/">Research index ${icon('arrow')}</a></div></aside></section></main>`, 'about');
}

function slugToPage(route) {
  const slug = route.split('/').filter(Boolean).pop();
  if (articlePages[slug]) return articlePages[slug];
  const note = researchNotes.find((item) => noteSlug(item) === slug);
  if (!note) return null;
  const noteImages = { Guide: '/images/gallipoli-steam-background.jpg', Release: '/images/gallipoli-ps-beach.jpg', Modes: '/images/gallipoli-ps-urban.jpg', Arsenal: '/images/gallipoli-store-screenshot.jpg', Platforms: '/images/gallipoli-gamewatcher-urban.jpg', Community: '/images/gallipoli-sector-desert.jpg', Wiki: '/images/gallipoli-steam-background.jpg', Developer: '/images/gallipoli-sector-desert.jpg' };
  return {
    kind: note.category,
    number: note.id,
    title: note.title,
    kicker: note.tag.toUpperCase(),
    status: note.state,
    readTime: '4 min read',
    tag: note.tag,
    intro: note.summary,
    image: noteImages[note.category],
    facts: [['Category', note.category], ['Keyword', note.title], ['Status', note.state]],
    sections: [{ heading: 'What we know', paragraphs: [note.summary] }],
    related: ['beginner-guide', 'release-date', 'platforms'],
    ...researchPageDetails[note.slug],
  };
}

export function pageForRoute(routeInput) {
  const route = cleanRoute(routeInput);
  return route !== 'home' && !hubPages[route] && !['guides', 'research', 'faq', 'about'].includes(route) ? slugToPage(route) : null;
}

function legacyArticleTemplate(page) {
  const related = (page.related || []).map((slug) => articlePages[slug]).filter(Boolean);
  const articleRoute = (slug) => ['Guide', 'Mode Guide', 'Arsenal Guide'].includes(articlePages[slug]?.kind) ? `guides/${slug}` : `research/${slug}`;
  const sectionLinks = (page.sections || []).map((section, index) => `<a href="#section-${index + 1}">${String(index + 1).padStart(2, '0')} ${section.heading}</a>`).join('');
  const imageStyleValue = page.image ? imageStyle('article-image', page.image) : '';
  return shellTemplate(`<main class="article-page"><section class="article-hero content-width reveal"><div class="article-hero__copy"><div class="eyebrow">${page.kind.toUpperCase()} <span class="eyebrow-divider"></span> FIELD NOTE ${page.number}</div><div class="article-meta"><span class="article-status article-status--${stateTone(page.status)}">${page.status}</span><span>${page.readTime}</span><span>${page.tag}</span></div><h1>${page.title}</h1><p>${page.intro}</p></div><div class="article-hero__visual"${imageStyleValue}><div class="article-hero__stamp">GM<br /><b>${page.number}</b></div><span>FIELD MANUAL / BRIEFING</span><strong>Ottoman<br />Fronts</strong><small>PRE-RELEASE EDITION</small></div></section><section class="article-facts content-width">${page.facts.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join('')}</section><section class="article-content content-width"><article class="article-main"><div class="article-kicker">THE BRIEFING</div>${page.sections.map((section, index) => `<section class="article-section" id="section-${index + 1}"><h2>${section.heading}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join('')}${section.bullets ? `<ul>${section.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>` : ''}${section.callout ? `<div class="article-callout"><span>${section.callout.split(' / ')[0]}</span><strong>${section.callout.split(' / ').slice(1).join(' / ')}</strong></div>` : ''}</section>`).join('')}</article><aside class="article-sidebar"><div class="sidebar-block"><span class="sidebar-label">ON THIS PAGE</span>${sectionLinks}</div>${related.length ? `<div class="sidebar-block"><span class="sidebar-label">RELATED NOTES</span>${related.map((item) => { const slug = Object.keys(articlePages).find((key) => articlePages[key] === item); const href = articleRoute(slug); return `<a class="sidebar-link js-route" data-route="${href}" href="${routeHref(href)}">${item.title} ${icon('arrow')}</a>`; }).join('')}</div>` : ''}</aside></section>${related.length ? `<section class="related-section content-width"><div class="section-heading"><div><div class="eyebrow">NEXT IN THE MANUAL</div><h2>KEEP READING</h2></div><p>Follow the thread from this field note into the next practical guide.</p></div><div class="related-grid">${related.map((item) => { const slug = Object.keys(articlePages).find((key) => articlePages[key] === item); const href = articleRoute(slug); return `<a class="related-card js-route" data-route="${href}" href="${routeHref(href)}"><span>${item.number}</span><strong>${item.title}</strong><small>${item.kind} · ${item.readTime}</small>${icon('arrow')}</a>`; }).join('')}</div></section>` : ''}</main>`, page.kind === 'Guide' || page.kind === 'Mode Guide' || page.kind === 'Arsenal Guide' ? 'guides' : 'research');
}

export function articleFaqItems(page) {
  const title = `${page.title} ${page.intro}`.toLowerCase();
  if (title.includes('platform') || title.includes('mac') || title.includes('xbox') || title.includes('ps5') || title.includes('price')) {
    return faqItems.filter((item) => item.category === 'Platforms & store').slice(0, 3);
  }
  if (title.includes('class') || title.includes('squad') || title.includes('weapon') || title.includes('loadout')) {
    return faqItems.filter((item) => item.category === 'Play & systems').slice(0, 3);
  }
  if (title.includes('expedition') || title.includes('gameplay') || title.includes('single-player') || title.includes('bot')) {
    return faqItems.filter((item) => item.category === 'Play & systems').slice(0, 3);
  }
  return faqItems.filter((item) => item.category === 'The game').slice(0, 2).concat(faqItems.filter((item) => item.category === 'Play & systems').slice(0, 1));
}

function articleFaqTemplate(page) {
  const [deployTop, deployBottom] = localizedDeployTitle();
  return `<section class="article-faq content-width"><div class="article-faq__head"><div><div class="eyebrow">${templateText('QUICK ANSWERS')}</div><h2>${deployTop}<br /><em>${deployBottom}</em></h2></div><p>Three short answers related to this page. Keep the full FAQ nearby when you need the wider picture.</p></div><div class="article-faq__list">${articleFaqItems(page).map((item) => `<details class="faq-item"><summary><span class="faq-item__number">◎</span><span class="faq-item__question">${item.question}</span><span class="faq-item__toggle" aria-hidden="true"></span></summary><div class="faq-item__answer"><p>${item.answer}</p><a class="text-link js-route" data-route="faq" href="/faq/">Open full FAQ ${icon('arrow')}</a></div></details>`).join('')}</div></section>`;
}

function answerSummaryTemplate(page) {
  return `<section class="answer-summary content-width" aria-label="Quick answer"><div><div class="eyebrow">QUICK ANSWER <span class="eyebrow-divider"></span> ${templateText(page.status)}</div><p>${page.intro}</p></div><div class="answer-summary__meta"><span>LAST REVIEWED</span><time datetime="${page.updated || '2026-08-17'}">${page.updated || '2026-08-17'}</time><span>EDITORIAL STATUS</span><strong>${templateText(page.status)}</strong></div></section>`;
}

function enhancedArticleTemplate(page) {
  const related = (page.related || []).map((slug) => articlePages[slug]).filter(Boolean);
  const isGuide = ['Guide', 'Mode Guide', 'Arsenal Guide'].includes(page.kind);
  const parentRoute = isGuide ? 'guides' : 'research';
  const parentLabel = isGuide ? 'Guide library' : 'Research index';
  const articleRoute = (slug) => ['Guide', 'Mode Guide', 'Arsenal Guide'].includes(articlePages[slug]?.kind) ? `guides/${slug}` : `research/${slug}`;
  const sectionLinks = (page.sections || []).map((section, index) => `<a href="#section-${index + 1}">${String(index + 1).padStart(2, '0')} ${section.heading}</a>`).join('');
  const imageStyleValue = page.image ? imageStyle('article-image', page.image) : '';
  const lastUpdated = page.updated || '2026-08-17';
  const [theatreTop, theatreBottom] = localizedTheatreVisual();
  return shellTemplate(`<main class="article-page"><section class="article-hero content-width reveal"><div class="article-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a class="js-route" data-route="home" href="/">Overview</a><span>/</span><a class="js-route" data-route="${parentRoute}" href="${routeHref(parentRoute)}">${parentLabel}</a><span>/</span><span aria-current="page">${page.title}</span></nav><div class="eyebrow">${templateText(page.kind).toUpperCase()} <span class="eyebrow-divider"></span> ${templateText('FIELD NOTE')} ${page.number}</div><div class="article-meta"><span class="article-status article-status--${stateTone(page.status)}">${templateText(page.status)}</span><span>${localizedReadTime(page.readTime)}</span><span>${templateText(page.tag)}</span></div><h1>${page.title}</h1><p>${page.intro}</p><div class="article-update"><i></i> Last updated: ${lastUpdated}</div></div><div class="article-hero__visual"${imageStyleValue}><div class="article-hero__stamp">GM<br /><b>${page.number}</b></div><span>FIELD MANUAL / BRIEFING</span><strong>${theatreTop}<br />${theatreBottom}</strong><small>PRE-RELEASE EDITION</small></div></section>${answerSummaryTemplate(page)}<section class="article-facts content-width">${page.facts.map(([label, value]) => `<div><small>${templateText(label)}</small><strong>${templateText(value)}</strong></div>`).join('')}</section><section class="article-content content-width"><article class="article-main"><div class="article-kicker">THE BRIEFING</div>${page.sections.map((section, index) => `<section class="article-section" id="section-${index + 1}"><h2>${section.heading}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join('')}${section.bullets ? `<ul>${section.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>` : ''}${section.callout ? `<div class="article-callout"><span>${section.callout.split(' / ')[0]}</span><strong>${section.callout.split(' / ').slice(1).join(' / ')}</strong></div>` : ''}</section>`).join('')}</article><aside class="article-sidebar"><div class="sidebar-block"><span class="sidebar-label">ON THIS PAGE</span>${sectionLinks}</div>${related.length ? `<div class="sidebar-block"><span class="sidebar-label">RELATED NOTES</span>${related.map((item) => { const slug = Object.keys(articlePages).find((key) => articlePages[key] === item); const href = articleRoute(slug); return `<a class="sidebar-link js-route" data-route="${href}" href="${routeHref(href)}">${item.title} ${icon('arrow')}</a>`; }).join('')}</div>` : ''}</aside></section>${articleFaqTemplate(page)}${related.length ? `<section class="related-section content-width"><div class="section-heading"><div><div class="eyebrow">NEXT IN THE MANUAL</div><h2>KEEP READING</h2></div><p>Follow the thread from this field note into the next practical guide.</p></div><div class="related-grid">${related.map((item) => { const slug = Object.keys(articlePages).find((key) => articlePages[key] === item); const href = articleRoute(slug); return `<a class="related-card js-route" data-route="${href}" href="${routeHref(href)}"><span>${item.number}</span><strong>${item.title}</strong><small>${templateText(item.kind)} · ${localizedReadTime(item.readTime)}</small>${icon('arrow')}</a>`; }).join('')}</div></section>` : ''}</main>`, isGuide ? 'guides' : 'research');
}

function notFoundTemplate() {
  return shellTemplate(`<main class="not-found content-width"><div class="eyebrow">FIELD MANUAL / 404</div><h1>PAGE<br /><em>NOT FOUND</em></h1><p>This page doesn’t exist in the guide library. Return to the library and choose another field note.</p><a class="button button--primary js-route" data-route="home" href="/">Return to overview ${icon('arrow')}</a></main>`);
}

function setMeta(name, content, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    if (property) tag.setAttribute('property', name);
    else tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateSchema(id, value) {
  document.head.querySelector(`#${id}`)?.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(value);
  document.head.appendChild(script);
}

const seoTitleOverrides = {
  faq: { en: 'Gallipoli FAQ: Release & Gameplay', tr: 'Gallipoli SSS: Çıkış ve Oynanış', de: 'Gallipoli FAQ: Veröffentlichung & Gameplay', fr: 'FAQ Gallipoli : sortie et gameplay' },
  classes: { en: 'Gallipoli Classes & Loadouts', tr: 'Gallipoli Sınıflar ve Teçhizat', de: 'Gallipoli Klassen & Ausrüstung', fr: 'Gallipoli Classes et équipement' },
  maps: { en: 'Gallipoli Maps & Ottoman Fronts', tr: 'Gallipoli Haritaları ve Osmanlı Cepheleri', de: 'Gallipoli Karten & Osmanische Fronten', fr: 'Cartes et fronts ottomans de Gallipoli' },
  tools: { en: 'Gallipoli Player Tools & Quick Start', tr: 'Gallipoli Oyuncu Araçları ve Hızlı Başlangıç', de: 'Gallipoli Spieler-Tools & Schnellstart', fr: 'Outils et démarrage rapide de Gallipoli' },
  updates: { en: 'Gallipoli Release & Updates', tr: 'Gallipoli Çıkış ve Güncellemeler', de: 'Gallipoli Release & Status', fr: 'Sortie et actualités de Gallipoli' },
  'guides/expedition-mode': { en: 'Gallipoli Expedition Mode Guide', tr: 'Gallipoli Sefer Modu Rehberi', de: 'Gallipoli Expeditionsmodus-Leitfaden', fr: 'Guide du mode Expédition de Gallipoli' },
  'research/02-gallipoli-game-release-date': { en: 'Gallipoli Release Date: August 20, 2026', tr: 'Gallipoli Çıkış Tarihi: 20 Ağustos 2026', de: 'Gallipoli Release: 20. August 2026', fr: 'Date de sortie de Gallipoli : 20 août 2026' },
  'research/05-gallipoli-game-gameplay': { en: 'Gallipoli Gameplay & Expedition', tr: 'Gallipoli Oynanış ve Sefer', de: 'Gallipoli Gameplay & Expedition Guide', fr: 'Gameplay et Expédition de Gallipoli' },
  'research/06-gallipoli-game-single-player': { en: 'Gallipoli Single-Player & Bots', tr: 'Gallipoli Tek Oyuncu ve Botlar', de: 'Gallipoli Einzelspieler & Bots', fr: 'Solo et bots dans Gallipoli' },
  'research/13-gallipoli-game-epic-games': { en: 'Gallipoli on Epic Games Store', tr: 'Gallipoli Epic Games Store', de: 'Gallipoli im Epic Games Store', fr: 'Gallipoli sur Epic Games Store' },
  'research/16-gallipoli-game-reddit': { en: 'Gallipoli Reddit & Community', tr: 'Gallipoli Reddit ve Topluluk', de: 'Gallipoli Reddit & Community Signals', fr: 'Reddit et communauté Gallipoli' },
  'research/17-gallipoli-game-wiki': { en: 'Gallipoli Wiki: Game Reference', tr: 'Gallipoli Wikisi: Oyun Rehberi', de: 'Gallipoli-Wiki: Spielreferenz', fr: 'Wiki Gallipoli : référence du jeu' },
  'research/18-gallipoli-game-steam-chart': { en: 'Gallipoli Steam Charts & Players', tr: 'Gallipoli Steam İstatistikleri ve Oyuncular', de: 'Gallipoli Steam-Charts & Spielerzahlen', fr: 'Statistiques Steam et joueurs de Gallipoli' },
  'research/19-gallipoli-game-blackmill-games': { en: 'BlackMill Games: Gallipoli Developer', tr: 'BlackMill Games: Gallipoli Geliştiricisi', de: 'BlackMill Games: Entwickler von Gallipoli', fr: 'BlackMill Games : développeur de Gallipoli' },
};

const seoDescriptionSuffix = {
  en: ' Read the latest official details, player guidance and pre-release status.',
  tr: ' Güncel resmî ayrıntıları, oyuncu rehberlerini ve çıkış öncesi durumu okuyun.',
  de: ' Lies aktuelle offizielle Details, Spielerhilfen und den Stand vor der Veröffentlichung.',
  fr: ' Consultez les informations officielles, les guides et l’état de pré-sortie.',
};

const seoEditionSuffix = {
  tr: 'Türkçe sürüm',
  de: 'Deutsche Ausgabe',
  fr: 'édition française',
};

function localizedSeoValue(route, value, locale, overrides) {
  const direct = overrides[route]?.[locale];
  if (direct) return direct;
  const translated = localizedSeoText(value, locale);
  if (locale !== 'en' && translated === value) return `${translated} · ${seoEditionSuffix[locale]}`;
  return translated;
}

function fitSeoDescription(value, locale) {
  let description = value;
  if (description.length < 120) description += seoDescriptionSuffix[locale] || seoDescriptionSuffix.en;
  if (description.length <= 160) return description;
  const clipped = description.slice(0, 159).replace(/\s+\S*$/, '').replace(/[,:;—-]+$/, '').trim();
  return `${clipped}…`;
}

export function formatSeoTitle(routeInput, title, locale = 'en') {
  const route = cleanRoute(routeInput);
  let value = localizedSeoValue(route, title, normalizeLocale(locale), seoTitleOverrides);
  const brand = 'Gallipoli Wiki';
  const suffix = ` — ${brand}`;
  if (value.length > 60 && value.includes(' · ')) value = value.split(' · ')[0];
  if (!value.includes(brand) && value.length + suffix.length > 60) {
    const available = 60 - suffix.length;
    value = `${value.slice(0, available).replace(/\s+\S*$/, '').trim()}…`;
  }
  const formatted = value.includes(brand) ? value : `${value}${suffix}`;
  return formatted.length > 60 ? formatted.slice(0, 60).replace(/\s+\S*$/, '').replace(/[—–,:;]+$/, '').trim() : formatted;
}

export function seoForRoute(routeInput, page = null, locale = 'en') {
  const route = cleanRoute(routeInput);
  const baseTitle = page?.title || hubPages[route]?.title.replace('\n', ' ') || ({ home: 'Gallipoli Wiki — Guides, Classes & Weapons', guides: 'Guide Library', research: 'Research Index', faq: 'FAQ', about: 'About Gallipoli' }[route] || 'Gallipoli Wiki');
  const description = page?.intro || hubPages[route]?.intro || ({
    home: 'Gallipoli Wiki — a practical field manual for classes, weapons, Expedition mode, platforms and release details.',
    guides: 'Practical Gallipoli game guides for beginners, classes, Expedition Mode and weapons progression.',
    research: 'Gallipoli research index covering release dates, platforms, modes, weapons and community signals.',
    faq: 'Answers to common Gallipoli questions about release timing, gameplay, classes, platforms and store status.',
    about: 'An independent player-first orientation to Gallipoli, the fourth standalone entry in the WW1 Game Series.',
  }[route] || 'Gallipoli Field Manual — practical player guides for the Ottoman Fronts.');
  const normalizedLocale = normalizeLocale(locale);
  const localizedDescription = localizedSeoValue(route, description, normalizedLocale, {});
  const image = page?.image || hubPages[route]?.image || '/images/gallipoli-steam-background.jpg';
  return { route, title: seoTitleOverrides[route]?.[normalizedLocale] || localizedSeoText(baseTitle, normalizedLocale), description: fitSeoDescription(localizedDescription, normalizedLocale), image, isArticle: Boolean(page), locale: normalizedLocale };
}

function updateSeo(route, page = null, locale = 'en') {
  const origin = window.location.origin;
  const canonical = new URL(routeHref(route, locale), origin).href;
  const { title, description, image } = seoForRoute(route, page, locale);
  const displayTitle = formatSeoTitle(route, title, locale);
  document.documentElement.lang = locale;
  document.title = displayTitle;
  setMeta('description', description);
  setMeta('og:title', displayTitle, true);
  setMeta('og:description', description, true);
  setMeta('og:url', canonical, true);
  setMeta('og:image', new URL(image, origin).href, true);
  setMeta('og:type', page ? 'article' : 'website', true);
  setMeta('og:site_name', 'Gallipoli Wiki', true);
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', displayTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:image', new URL(image, origin).href);
  let canonicalLink = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonical;

  updateSchema('site-schema', { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Gallipoli Wiki', url: canonical, inLanguage: locale, description: description });
  if (route === 'faq' || page) {
    const items = route === 'faq' ? faqItems : articleFaqItems(page);
    updateSchema('faq-schema', { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: locale, mainEntity: items.map((item) => ({ '@type': 'Question', name: localizedSeoText(item.question, locale), acceptedAnswer: { '@type': 'Answer', text: localizedSeoText(item.answer, locale) } })) });
  }
  if (page) {
    updateSchema('article-schema', { '@context': 'https://schema.org', '@type': 'Article', headline: localizedSeoText(page.title, locale), description: localizedSeoText(page.intro, locale), dateModified: page.updated || '2026-08-17', mainEntityOfPage: canonical, image: new URL(image, origin).href, author: { '@type': 'Organization', name: 'Gallipoli Wiki' }, publisher: { '@type': 'Organization', name: 'Gallipoli Wiki' } });
  } else {
    document.head.querySelector('#article-schema')?.remove();
  }
}

function routeTemplate(routeInput, localeInput = 'en') {
  const route = cleanRoute(routeInput);
  const previousLocale = activeTemplateLocale;
  activeTemplateLocale = normalizeLocale(localeInput);
  let html = homeTemplate();
  if (route === 'guides') html = directoryTemplate();
  else if (hubPages[route]) html = hubTemplate(hubPages[route]);
  else if (route === 'research') html = researchDirectoryTemplate();
  else if (route === 'faq') html = faqTemplate();
  else if (route === 'about') html = aboutTemplate();
  else if (route !== 'home') {
    const page = slugToPage(route);
    html = page ? enhancedArticleTemplate(page) : notFoundTemplate();
  }
  const page = route !== 'home' && !hubPages[route] && !['guides', 'research', 'faq', 'about'].includes(route) ? slugToPage(route) : null;
  const localizedHtml = translateRenderedHtml(html, activeTemplateLocale);
  activeTemplateLocale = previousLocale;
  return { route, html: localizedHtml, page, locale: normalizeLocale(localeInput) };
}

export function renderToString(route = 'home', locale = 'en') {
  return routeTemplate(route, locale).html;
}

function detachAdContainer(app) {
  const container = document.getElementById(AD_CONTAINER_ID);
  if (container && app?.contains(container)) document.body.appendChild(container);
}

function mountAdContainer(app) {
  const slot = $('[data-ad-slot]', app);
  const container = document.getElementById(AD_CONTAINER_ID);
  if (slot && container && container.parentElement !== slot) slot.appendChild(container);
}

export function render() {
  const locale = getLocale();
  const { route, html, page } = routeTemplate(getRoute(), locale);
  const app = document.querySelector('#app');
  if (!app) return;
  detachAdContainer(app);
  app.innerHTML = html;
  mountAdContainer(app);
  updateSeo(route, page, locale);
}

function navigate(route) {
  const target = cleanRoute(route);
  window.history.pushState({}, '', routeHref(target, getLocale()));
  render();
  setupInteractions();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function setupInteractions() {
  const search = $('#research-search');
  const notes = $$('.note-card');
  const count = $('#result-count');
  const empty = $('#empty-state');
  const toast = $('.toast');
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };

  if (search && count && empty) {
    const filterNotes = () => {
      const query = (search.value || '').trim().toLowerCase();
      const active = $('.filter-btn.active')?.dataset.filter || 'All notes';
      let visible = 0;
      notes.forEach((note) => {
        const shouldShow = (active === 'All notes' || note.dataset.category === active) && (!query || note.dataset.search.includes(query));
        note.hidden = !shouldShow;
        if (shouldShow) visible += 1;
      });
      const locale = getLocale();
      count.textContent = `${visible} ${translateText(visible === 1 ? 'note' : 'notes', locale).trim()}`;
      empty.hidden = visible !== 0;
    };
    $$('.filter-btn').forEach((button) => button.addEventListener('click', () => {
      $$('.filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      filterNotes();
    }));
    search.addEventListener('input', filterNotes);
  }

  $$('.nav-item--dropdown').forEach((dropdown) => {
    const dropdownToggle = $('.nav-panel-toggle', dropdown);
    if (!dropdownToggle) return;
    const setDropdownState = (open) => dropdownToggle.setAttribute('aria-expanded', String(open));
    dropdown.addEventListener('mouseenter', () => setDropdownState(true));
    dropdown.addEventListener('mouseleave', () => {
      if (!dropdown.classList.contains('open')) setDropdownState(false);
    });
    dropdownToggle.addEventListener('focus', () => setDropdownState(true));
    dropdownToggle.addEventListener('click', (event) => {
      if (window.matchMedia('(max-width: 720px)').matches) {
        event.preventDefault();
        const open = dropdown.classList.toggle('open');
        setDropdownState(open);
        return;
      }
      event.preventDefault();
      navigate(dropdownToggle.dataset.route);
    });
  });

  $$('.trailer-media[data-video-id]').forEach((player) => {
    player.querySelector('.play-button')?.addEventListener('click', () => {
      if (player.classList.contains('is-playing')) return;
      const videoId = player.dataset.videoId;
      const tag = player.querySelector('.trailer-tag');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = 'Gallipoli official trailer';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      player.classList.add('is-playing');
      player.replaceChildren(iframe, tag);
    });
  });

  $$('[data-focus-search]').forEach((button) => button.addEventListener('click', () => {
    if (getRoute() !== 'research') navigate('research');
    window.setTimeout(() => $('#research-search')?.focus(), 100);
  }));
  $$('[data-scroll]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.getElementById(link.dataset.scroll);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  $$('.js-route').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(link.dataset.route);
  }));
  $('.menu-btn')?.addEventListener('click', () => {
    $('.main-nav')?.classList.toggle('open');
    $('.menu-btn')?.classList.toggle('open');
  });
  $$('[data-language-link]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.assign(routeWithLocale(getRoute(), link.dataset.locale));
  }));
  $('.language-btn')?.addEventListener('click', () => {
    const picker = $('.language-picker');
    const button = $('.language-btn');
    const open = picker?.classList.toggle('open') || false;
    button?.setAttribute('aria-expanded', String(open));
  });
  $$('.guide-card[data-route], .note-card[data-route]').forEach((card) => card.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    navigate(card.dataset.route);
  }));
  document.onkeydown = (event) => {
    if (event.key === 'Escape') {
      $$('.nav-item--dropdown').forEach((dropdown) => {
        dropdown.classList.remove('open');
        $('.nav-panel-toggle', dropdown)?.setAttribute('aria-expanded', 'false');
      });
      $('.language-picker')?.classList.remove('open');
      $('.language-btn')?.setAttribute('aria-expanded', 'false');
    }
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      event.preventDefault();
      if (getRoute() !== 'research') navigate('research');
      window.setTimeout(() => $('#research-search')?.focus(), 100);
    }
  };
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }), { threshold: 0.12 });
  $$('.reveal').forEach((element) => observer.observe(element));
  $$('.hero .reveal, .article-hero.reveal, .directory-hero.reveal').forEach((element) => element.classList.add('is-visible'));
}

export function initClient() {
  window.onpopstate = () => { render(); setupInteractions(); };
  window.onhashchange = () => { if (window.location.hash.startsWith('#/')) { render(); setupInteractions(); } };
  setupInteractions();
}
