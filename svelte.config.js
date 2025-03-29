import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true // this also enables runes mode for node_modules, so...
	},

	kit: {
		// leave this blank for zero-config on vercel
		// https://kit.svelte.dev/docs/adapter-static#zero-config-support
		adapter: adapter()
	}
};

export default config;
