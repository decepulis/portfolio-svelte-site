// todo: prerender

import { getPost } from '$lib/markdoc/server';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { slug } = params;
	return getPost(slug);
}) satisfies PageServerLoad;
