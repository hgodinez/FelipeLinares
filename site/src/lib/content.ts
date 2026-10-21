import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/routes';

export type Work = CollectionEntry<'artworks'>;
export type Person = CollectionEntry<'people'>;
export type ArchiveItem = CollectionEntry<'archive'>;

export async function getPage(slug: string, lang: Lang) {
  const entry = await getEntry('pages', `${lang}/${slug}`);
  if (!entry) throw new Error(`Missing page content: ${lang}/${slug}`);
  return entry;
}

export async function getWorks(): Promise<Work[]> {
  const works = await getCollection('artworks');
  return works.sort((a, b) => a.data.order - b.data.order);
}

export async function getPeople(): Promise<Person[]> {
  const people = await getCollection('people');
  return people.sort((a, b) => a.data.generation - b.data.generation || a.data.order - b.data.order);
}

export async function getArchive(): Promise<ArchiveItem[]> {
  const items = await getCollection('archive');
  return items.sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
}

export function coverOf(work: Work) {
  return work.data.images.find((i) => i.kind === 'final') ?? work.data.images[0];
}
