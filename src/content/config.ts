import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pedagogicalSchema = z.object({
  bigQuestion: z.string().optional(),
  content: z.string().optional(),
  biblicalConnection: z.string().optional(),
  reflection: z.string().optional(),
  keyIdea: z.string().optional(),
  culturalWealth: z.string().optional(),
});

// Lesson collection — ES
const lessonEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/es' }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
    cic: z.string().optional(),
    scripture: z.string().optional(),
    pedagogical: pedagogicalSchema.optional(),
  }),
});

// Lesson collection — EN
const lessonEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/en' }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
    cic: z.string().optional(),
    scripture: z.string().optional(),
    pedagogical: pedagogicalSchema.optional(),
  }),
});

export const collections = {
  'credo-lessons-es': lessonEs,
  'sacramentos-lessons-es': lessonEs,
  'moral-lessons-es': lessonEs,
  'oracion-lessons-es': lessonEs,
  'credo-lessons-en': lessonEn,
  'sacramentos-lessons-en': lessonEn,
  'moral-lessons-en': lessonEn,
  'oracion-lessons-en': lessonEn,
};
