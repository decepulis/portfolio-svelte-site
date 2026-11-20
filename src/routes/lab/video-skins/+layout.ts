import type { Metadata } from '$lib/types/metadata';

export const load = ({ url }) => {
	const metadata: Metadata = {
		pathname: url.pathname,
		title: 'Video skin lab',
		description: 'Exploratory Video.js skins.'
	};
	return { metadata };
};
