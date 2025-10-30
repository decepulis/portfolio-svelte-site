<script lang="ts">
	import type { Snippet } from 'svelte';

	import Favicons from '$lib/components/Favicons.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import UIManager from '$lib/stores/UIManager.svelte';

	import { onNavigate } from '$app/navigation';

	import './layout.css';

	type Props = {
		children?: Snippet;
	};
	const { children }: Props = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Metadata>
	<Favicons />
	<UIManager />
	{@render children?.()}
</Metadata>

<!-- due to a bug in tailwind v4, app.html isn't being scanned, so we declare its classes here -->
<div
	data-fix-tailwind-v4-bug
	class="dark:bg-gainsboro sr-only min-w-[20rem] bg-white text-black antialiased"
></div>
