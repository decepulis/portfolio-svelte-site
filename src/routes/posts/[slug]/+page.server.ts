import { getPost } from '$lib/markdoc/server';
import { redirect } from '@sveltejs/kit';
import type { Picture } from 'vite-imagetools';
import type { PageServerLoad } from './$types';

const allEnhancedImages: { [key: string]: { default: Picture } } = import.meta.glob(
	'/src/posts/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
	{
		eager: true,
		query: {
			enhanced: true
		}
	}
);
function getEnhancedImages(images: string[]) {
	const enhancedImages: { [key: string]: Picture } = {};
	for (const image of images) {
		const enhancedImage = allEnhancedImages[image];
		if (enhancedImage) enhancedImages[image] = enhancedImage.default;
	}
	return enhancedImages;
}

export const load = (async ({ params }) => {
	const { slug } = params;

	const { content, images, frontmatter } = await getPost(slug);
	if (frontmatter.directUrl) {
		throw redirect(307, frontmatter.directUrl);
	}

	const enhancedImages = getEnhancedImages(images);

	return { content, enhancedImages, frontmatter };
}) satisfies PageServerLoad;
