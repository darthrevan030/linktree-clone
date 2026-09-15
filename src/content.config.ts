import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * A single outbound link on a project (GitHub, Live, PyPI, ...).
 * `label` is what the button says; it is also the PostHog event label,
 * so keep labels consistent across projects.
 */
const projectLink = z.object({
  label: z.string().min(1),
  url: z.url(),
});

/**
 * One record per project, read by BOTH /resume and /projects.
 *
 * Keeping this single-sourced is deliberate: every project link appears on
 * two pages, and storing them twice guarantees they drift apart.
 *
 * Schema is intentionally flat with obvious field names — resume updates are
 * made by pasting Word-doc content to an AI and asking it to add an entry,
 * and flat/obvious survives that far better than clever nesting.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    start: z.string().min(1),            // "Jun 2026"
    end: z.string().optional(),          // omitted = ongoing
    award: z.string().optional(),        // "SummerBuild 2026 Gold Award"
    context: z.string().optional(),      // "SC2002 NTU", "Personal Project"
    repo: z.string().optional(),         // "owner/name" -> opts into GitHub stats
    links: z.array(projectLink).default([]),
    tech: z.array(z.string()).default([]),
    resumeBullets: z.array(z.string()).default([]),
    showcase: z.boolean().default(false), // true -> gets its own /projects/<id> page
    order: z.number(),                    // ascending; controls display order
  }),
});

export const collections = { projects };
