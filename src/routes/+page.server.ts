import { getPosts } from '$lib/markdoc/server';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return { posts: await getPosts() };
}) satisfies PageServerLoad;
