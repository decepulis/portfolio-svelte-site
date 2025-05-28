import Markdoc from '@markdoc/markdoc';
import type { Schema } from '@markdoc/markdoc';
import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationHighlight
} from '@shikijs/transformers';
import { bundledLanguages, createHighlighter } from 'shiki';

import { isTag } from './types';

const highlighter = await createHighlighter({
	themes: ['github-light'],
	langs: Object.values(bundledLanguages)
});

export const fence: Schema = {
	render: 'Fence',
	attributes: {
		language: {
			type: String
		},
		content: {
			type: String
		},
		process: {
			type: Boolean
		}
	},
	transform(node, config) {
		const html = highlighter.codeToHtml(node.attributes.content?.trim(), {
			lang: node.attributes.language,
			theme: 'github-light',
			transformers: [
				// classes for pre
				{
					pre(node) {
						this.addClassToHast(
							node,
							'border-silver dark:border-gray border overflow-x-scroll p-4 text-sm'
						);
					}
				},
				// [!code highlight]
				transformerNotationHighlight({
					classActivePre: 'has-highlighted',
					classActiveLine: 'highlighted'
				}),
				// [!code ++] [!code --]
				transformerNotationDiff({
					classActivePre: 'has-highlighted has-diff',
					classLineAdd: 'highlighted diff add',
					classLineRemove: 'highlighted diff remove'
				}),
				// [!code error] [!code warning]
				transformerNotationErrorLevel({
					classActivePre: 'has-highlighted',
					classMap: {
						error: ['highlighted', 'error'],
						warning: ['highlighted', 'warning']
					}
				})
			]
		});

		const attributes = node.transformAttributes(config);
		// const children = node.transformChildren(config);
		return new Markdoc.Tag(`Fence`, { attributes, html });
	}
};

export const paragraph: Schema = {
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
