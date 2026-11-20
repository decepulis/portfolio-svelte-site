import { error } from '@sveltejs/kit';

import { type SkinSlug, skins } from '../skins';

export const entries = () => Object.keys(skins).map((skin) => ({ skin }));

export const load = ({ params }) => {
	if (!(params.skin in skins)) error(404);
	return { slug: params.skin as SkinSlug };
};
