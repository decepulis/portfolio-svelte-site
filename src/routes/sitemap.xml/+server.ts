import SimpleGit from 'simple-git';

import { getPosts } from '$lib/markdoc/server';
import baseUrl from '$lib/stores/baseUrl';

const simpleGit = SimpleGit();

async function getLastModifiedDate(file: string) {
	const result = await simpleGit.log({ file, n: 1 });
	if (result?.latest) return new Date(result.latest.date);
	return new Date();
}

type SitemapUrl = {
	loc: string;
	lastmod: string;
	priority: number;
};

export const prerender = true;
export async function GET() {
	const urls: SitemapUrl[] = [];

	// home page
	urls.push({
		loc: `${baseUrl}/`,
		lastmod: new Date().toISOString(), // this page is likely to change with every build
		priority: 1
	});

	// posts
	const posts = await getPosts();
	await Promise.all(
		posts
			.map(async (post) => {
				const { frontmatter } = post;
				const { slug, directUrl } = frontmatter;
				if (directUrl) return null; // redirect

				const lastmod = await getLastModifiedDate(`src/posts/${slug}.mdoc`);
				urls.push({
					loc: `${baseUrl}/posts/${slug}`,
					lastmod: lastmod.toISOString(),
					priority: 0.8
				});
			})
			.filter(Boolean)
	);

	const urlXml = urls
		.map((url) => {
			return /* xml */ `
		<url>
			<loc>${url.loc}</loc>
			<lastmod>${url.lastmod}</lastmod>
			<priority>${url.priority}</priority>
		</url>`.trim();
		})
		.join('\n');

	return new Response(
		/* xml */ `
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			${urlXml}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
