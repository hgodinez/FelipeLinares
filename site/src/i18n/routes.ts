export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];
export const DEFAULT_LANG: Lang = 'es';

/** Canonical route table. Keys are page ids; values are localized paths (without base). */
export const ROUTES = {
  home: { es: '/', en: '/en/' },
  artist: { es: '/maestro/', en: '/en/the-artist/' },
  works: { es: '/obras/', en: '/en/works/' },
  legacy: { es: '/legado/', en: '/en/legacy/' },
  workshop: { es: '/taller/', en: '/en/workshop/' },
  archive: { es: '/archivo/', en: '/en/archive/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  credits: { es: '/creditos/', en: '/en/credits/' },
  accessibility: { es: '/accesibilidad/', en: '/en/accessibility/' },
} as const;

export type RouteKey = keyof typeof ROUTES;

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Prefix a site-relative path with the configured base path. */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}`;
}

export function route(key: RouteKey, lang: Lang): string {
  return withBase(ROUTES[key][lang]);
}

export function workPath(slug: string, lang: Lang): string {
  return withBase(`${ROUTES.works[lang]}${slug}/`);
}

export function archivePath(slug: string, lang: Lang): string {
  return withBase(`${ROUTES.archive[lang]}${slug}/`);
}

/** Returns the localized counterpart of the current page for the language switcher + hreflang. */
export function alternates(key: RouteKey, slug?: string): Record<Lang, string> {
  const out = {} as Record<Lang, string>;
  for (const lang of LANGS) {
    if (slug && key === 'works') out[lang] = workPath(slug, lang);
    else if (slug && key === 'archive') out[lang] = archivePath(slug, lang);
    else out[lang] = route(key, lang);
  }
  return out;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

export const LOCALE_TAG: Record<Lang, string> = { es: 'es-MX', en: 'en' };
