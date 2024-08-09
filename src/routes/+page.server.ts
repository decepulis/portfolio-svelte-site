import { getPosts } from '$lib/markdoc/server';
import type { Metadata } from '$lib/types/metadata';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const fullPosts = await getPosts();
	const posts = fullPosts.map(({ frontmatter }) => ({
		// only pick the frontmatter that we're going to use
		frontmatter: {
			title: frontmatter.title,
			slug: frontmatter.slug,
			type: frontmatter.type,
			directUrl: frontmatter.directUrl,
			previewTitle: frontmatter.previewTitle,
			previewText: frontmatter.previewText
		}
	}));

	return {
		posts,
		metadata: {
			pathname: `/`,
			fullTitle: 'Darius Cepulis',
			description: 'I make great web experiences',
			profile: true
		} satisfies Metadata
	};
}) satisfies PageServerLoad;
