import adapter from '@sveltejs/adapter-vercel';
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
		// every page is prerendered (see src/routes/+layout.ts);
		// the Vercel adapter lets /api/visits run as a function
		adapter: adapter()
	}
};

export default config;
