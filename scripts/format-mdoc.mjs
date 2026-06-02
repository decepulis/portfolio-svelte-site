// Formats Markdoc (.mdoc) files using Markdoc's own AST-based formatter.
// Prettier has no .mdoc parser, so it's used for everything except Markdoc.
//
// Usage:
//   node ./scripts/format-mdoc.mjs                 # format all posts
//   node ./scripts/format-mdoc.mjs <file> [file…]  # format given files (lint-staged)
import Markdoc from '@markdoc/markdoc';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = 'src/posts';

const args = process.argv.slice(2);
const files = args.length
	? args
	: readdirSync(POSTS_DIR)
			.filter((f) => f.endsWith('.mdoc'))
			.map((f) => join(POSTS_DIR, f));

let changed = 0;
for (const file of files) {
	const src = readFileSync(file, 'utf8');
	const formatted = Markdoc.format(Markdoc.parse(src));
	if (formatted !== src) {
		writeFileSync(file, formatted);
		changed++;
	}
}

console.log(`format-mdoc: reformatted ${changed} of ${files.length} file(s)`);
