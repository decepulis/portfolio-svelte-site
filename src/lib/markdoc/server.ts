import Markdoc, { type Node, type RenderableTreeNode } from '@markdoc/markdoc';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

import { fence, paragraph } from './nodes';
import { color, getFootnote, grid, video } from './tags';
import { type Frontmatter, frontmatter, isTag } from './types';

function stripTags(content: RenderableTreeNode): RenderableTreeNode {
	if (content === null) return content;
	if (isTag(content)) {
		return {
			...content,
			children: content.children.map(stripTags)
		};
	}
	return content;
}
function getImages(content: RenderableTreeNode): string[] {
	if (content === null) return [];
	if (isTag(content)) {
		if (content.name === 'img') {
			return [content.attributes.src];
		}
		return content.children.flatMap(getImages);
	}
	return [];
}
function getDateFromSlug(slug: string) {
	// the slug is in one of the following three formats:
	// yyyy-mm-dd-rest OR yyyy-mm-rest OR yyyy-rest

	const [year, string2, string3] = slug.split('-');
	const hasMonth = !isNaN(parseInt(string2));
	const hasDay = !isNaN(parseInt(string3));
	let dateString = year;
	if (hasMonth) dateString += `-${string2}`;
	if (hasDay) dateString += `-${string3}`;
	const date = new Date(dateString);
	return { date, hasMonth, hasDay };
}
function getFrontmatter(slug: string, ast: Node): Frontmatter {
	try {
		const astFrontmatter = parse(ast.attributes.frontmatter);
		const validatedAstFrontmatter = frontmatter.parse(astFrontmatter);
		const date = getDateFromSlug(slug);
		return {
			...validatedAstFrontmatter,
			...date,
			slug: slug
		};
	} catch (e) {
		throw new Error(`Error parsing frontmatter in ${slug}: ${e}`);
	}
}

export async function getPosts() {
	const files = await fs.readdir('src/posts');
	const mdocFiles = files.filter((file) => file.endsWith('.mdoc'));
	const posts = await Promise.all(
		mdocFiles.map(async (file) => {
			const post = await fs.readFile(`src/posts/${file}`, 'utf-8');
			const ast = Markdoc.parse(post);
			const slug = file.replace('.mdoc', '');
			const frontmatter = getFrontmatter(slug, ast);
			return { frontmatter };
		})
	);
	return posts;
}
export async function getPost(slug: string) {
	const file = path.resolve(`src/posts/${slug}.mdoc`);
	const post = await fs.readFile(file, 'utf-8');
	const ast = Markdoc.parse(post);
	const frontmatter = getFrontmatter(slug, ast);
	const content = Markdoc.transform(ast, {
		nodes: { paragraph, fence },
		tags: {
			grid,
			color,
			video,
			footnote: getFootnote()
		},
		variables: {
			frontmatter
		}
	});

	return { content: stripTags(content), images: getImages(content), frontmatter };
}
