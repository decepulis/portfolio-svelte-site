import Markdoc, { type Node, type RenderableTreeNode } from '@markdoc/markdoc';
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

function getFrontmatter(filename: string, ast: Node): Frontmatter {
	const [dateString, dateSlug] = filename.split('.');
	const astFrontmatter = parse(ast.attributes.frontmatter);
	try {
		const validatedAstFrontmatter = frontmatter.parse(astFrontmatter);
		return {
			...validatedAstFrontmatter,
			date: new Date(dateString),
			slug: `${dateString}/${dateSlug}`
		};
	} catch (e) {
		throw new Error(`Error parsing frontmatter in ${filename}: ${e}`);
	}
}
export async function getPosts() {
	const files = await fs.readdir('src/posts');
	const posts = await Promise.all(
		files.map(async (file) => {
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
		tags: {},
		variables: {
			frontmatter
		}
	});

	return { content: stripTags(content), frontmatter };
}
