import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

const yamlParser = (text: string) => yaml.load(text) as Record<string, Record<string, unknown>> | Record<string, unknown>[];
const localized = z.object({ ko: z.string(), en: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: localized,
    summary: localized,
    thumbnail: z.string(),
    images: z.array(z.string()).default([]),
    github: z.string().url(),
    demo: z.string().url().optional(),
    tech: z.array(z.string()),
    period: z.string(),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const achievement = z.object({
  id: z.string(),
  name: localized,
  detail: localized.optional(), // 작품명·주제 등 부가 설명 (작은 글씨로 표시)
  org: localized,
  period: z.string(),
  scan: z.string().optional(),
});

const certifications = defineCollection({
  loader: file('src/content/data/certifications.yaml', { parser: yamlParser }),
  schema: z.object({ id: z.string(), issuer: localized, name: localized, date: z.string() }),
});
const awards = defineCollection({
  loader: file('src/content/data/awards.yaml', { parser: yamlParser }),
  schema: achievement,
});
const programs = defineCollection({
  loader: file('src/content/data/programs.yaml', { parser: yamlParser }),
  schema: achievement,
});
const site = defineCollection({
  loader: file('src/content/data/site.yaml', { parser: yamlParser }),
  schema: z.object({
    name: localized,
    devName: z.string(),
    email: z.string().email(),
    github: z.string().url(),
    slogan: z.array(z.string()),
    about: localized,
    profileImage: z.string(),
  }),
});

export const collections = { projects, certifications, awards, programs, site };
