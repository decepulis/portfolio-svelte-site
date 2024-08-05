import type { Tag } from '@markdoc/markdoc';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTag = (tag: any): tag is Tag => {
	return !!(tag?.$$mdtype === 'Tag');
};

export const frontmatter = z.object({
	title: z.string(),
	type: z.enum(['post', 'talk', 'build', 'video']),
	directUrl: z.string().optional(),
	pageUrl: z.string().optional(),
	githubUrl: z.string().optional(),
	priority: z.number().optional(),
	previewTitle: z.string().optional(),
	previewText: z.string().optional(),
	formatMonth: z.boolean().optional(),
	formatDay: z.boolean().optional()
});
export interface Frontmatter extends z.infer<typeof frontmatter> {
	date: Date;
	slug: string;
}
