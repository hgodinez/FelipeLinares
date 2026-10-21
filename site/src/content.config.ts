import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Bilingual text field: every editorial string exists in Spanish and English. */
const i18nText = z.object({ es: z.string(), en: z.string() });
const i18nOptional = z.object({ es: z.string().optional(), en: z.string().optional() }).optional();

/** A documented source: title + URL (+ optional publisher/date). Used across collections. */
const source = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  publisher: z.string().optional(),
  date: z.string().optional(),
});

/** Which generation of the Linares family, counted from Pedro Linares López = 3 (per family accounts). */
const artworks = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/artworks' }),
  schema: ({ image }) =>
    z.object({
      title: i18nText,
      /** "confirmed" = title given by the artist; "provisional" = descriptive label pending confirmation. */
      titleStatus: z.enum(['confirmed', 'provisional']).default('provisional'),
      year: z.number().int().optional(),
      yearNote: i18nOptional,
      categories: z.array(z.enum(['alebrijes', 'calaveras', 'judas', 'mascaras', 'colecciones', 'encargos'])),
      materials: i18nText,
      dimensions: z.string().optional(),
      description: i18nText,
      context: i18nOptional,
      provenance: i18nOptional,
      collection: z.string().optional(),
      availability: z.enum(['inquire', 'collection', 'private', 'unknown']).default('unknown'),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      images: z
        .array(
          z.object({
            src: image(),
            alt: i18nText,
            caption: i18nOptional,
            credit: z.string().optional(),
            /** "workshop" images document a piece before its final finish. */
            kind: z.enum(['final', 'detail', 'workshop', 'context']).default('final'),
          }),
        )
        .default([]),
      related: z.array(reference('artworks')).default([]),
      sources: z.array(source).default([]),
      /** Items the family must confirm before publication. Rendered only in the content checklist, never on the site. */
      toConfirm: z.array(z.string()).default([]),
    }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    born: z.number().int().optional(),
    died: z.number().int().optional(),
    datesNote: i18nOptional,
    generation: z.number().int(),
    parent: reference('people').optional(),
    parentConfirmed: z.boolean().default(true),
    role: i18nText,
    bio: i18nText,
    isFeaturedArtist: z.boolean().default(false),
    order: z.number().default(100),
    sources: z.array(source).default([]),
  }),
});

const archive = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/archive' }),
  schema: ({ image }) =>
    z.object({
      title: i18nText,
      type: z.enum(['exhibition', 'collection', 'press', 'publication', 'recognition', 'event', 'film']),
      /** artist = Felipe Linares Vargas himself; family = other members or the family as a whole; tradition = the craft. */
      subject: z.enum(['artist', 'family', 'tradition']),
      year: z.number().int(),
      endYear: z.number().int().optional(),
      dateLabel: i18nOptional,
      institution: z.string().optional(),
      city: z.string().optional(),
      summary: i18nText,
      body: i18nOptional,
      people: z.array(reference('people')).default([]),
      artworks: z.array(reference('artworks')).default([]),
      image: image().optional(),
      imageAlt: i18nOptional,
      sources: z.array(source).default([]),
      order: z.number().default(100),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    lead: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    sections: z
      .array(z.object({ heading: z.string(), text: z.string(), note: z.string().optional() }))
      .optional(),
  }),
});

export const collections = { artworks, people, archive, pages };
