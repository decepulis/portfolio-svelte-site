import { getPosts } from '#lib/markdoc/server.ts';
import { getVisits } from '#lib/server/visits.ts';
import type { Metadata } from '#lib/types/metadata.ts';

import type { PageServerLoad } from './$types';

export const load = (async () => {
	const [fullPosts, visits] = await Promise.all([getPosts(), getVisits()]);
	const posts = fullPosts.map(({ frontmatter }) => ({
		// only pick the frontmatter that we're going to use
		frontmatter: {
			title: frontmatter.title,
			slug: frontmatter.slug,
			type: frontmatter.type,
			priority: frontmatter.priority,
			directUrl: frontmatter.directUrl,
			todo: frontmatter.todo,
			previewTitle: frontmatter.previewTitle,
			previewText: frontmatter.previewText
		}
	}));

	return {
		posts,
		visits,
		metadata: {
			pathname: `/`,
			fullTitle: 'Darius Cepulis',
			description: 'I try and make the web nicer to use',
			profile: true
		} satisfies Metadata
	};
}) satisfies PageServerLoad;
