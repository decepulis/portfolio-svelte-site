import { getPosts } from '$lib/markdoc/server';
import type { Metadata } from '$lib/types/metadata';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		posts: await getPosts(),
		metadata: {
			pathname: `/`,
			fullTitle: 'Darius Cepulis',
			description: 'I make great web experiences',
			profile: true
		} satisfies Metadata
	};
}) satisfies PageServerLoad;
