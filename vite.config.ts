import adapter from '@sveltejs/adapter-static';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: true // this also enables runes mode for node_modules, so...
			},
			// leave this blank for zero-config on vercel
			// https://svelte.dev/docs/kit/adapter-static#Zero-config-support
			adapter: adapter()
		})
	]
});
