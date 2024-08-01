// todo: prerender

import { getPost } from '$lib/markdoc/server';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { date, slug } = params;
	return getPost(`${date}.${slug}`);
}) satisfies PageServerLoad;
