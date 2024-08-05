import Markdoc, { type Node, type RenderableTreeNode, type Schema } from '@markdoc/markdoc';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
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
function getFrontmatter(filename: string, ast: Node): Frontmatter {
	const [year, month, date, ...rest] = filename.split('-');
	const [dateSlug] = rest.join('-').split('.');
	try {
		const astFrontmatter = parse(ast.attributes.frontmatter);
		const validatedAstFrontmatter = frontmatter.parse(astFrontmatter);
		return {
			...validatedAstFrontmatter,
			date: new Date(`${year}-${month}-${date}`),
			slug: `${year}-${month}-${date}-${dateSlug}`
		};
	} catch (e) {
		throw new Error(`Error parsing frontmatter in ${filename}: ${e}`);
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
			const frontmatter = getFrontmatter(file, ast);
			return { frontmatter };
		})
	);
	return posts;
}
export async function getPost(filename: string) {
	const file = path.resolve(`src/posts/${filename}.mdoc`);
	const post = await fs.readFile(file, 'utf-8');
	const ast = Markdoc.parse(post);
	const frontmatter = getFrontmatter(filename, ast);
	const content = Markdoc.transform(ast, {
		nodes: { paragraph },
		tags: {
			grid: {
				render: 'Grid',
				attributes: {}
			}
		},
		variables: {
			frontmatter
		}
	});

	return { content: stripTags(content), images: getImages(content), frontmatter };
}
