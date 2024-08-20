import Markdoc, { type Node, type RenderableTreeNode, type Schema } from '@markdoc/markdoc';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import { color, grid, video } from './tags';
import { frontmatter, isTag, type Frontmatter } from './types';

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
const paragraph: Schema = {
	render: 'p',
	children: ['inline'],
	transform(node, config) {
		const attributes = node.transformAttributes(config);
		const children = node.transformChildren(config);

		// if the paragraph has no children, return null
		if (children.length === 0) {
			return null;
		}
		// if the paragraph has only an image as a child, return that image
		if (children.length === 1 && isTag(children[0]) && children[0].name === 'img') {
			// mark the image as safe to render block-level
			children[0].attributes.block = true;
			return children[0];
		}
		// otherwise, return as normal!
		return new Markdoc.Tag(`p`, attributes, children);
	}
};

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
		nodes: { paragraph },
		tags: {
			grid,
			color,
			video
		},
		variables: {
			frontmatter
		}
	});

	return { content: stripTags(content), images: getImages(content), frontmatter };
}
