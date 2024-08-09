<script lang="ts">
	import './layout.css';
	import Metadata from '$lib/components/Metadata.svelte';
	import type { Snippet } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import UIManager from '$lib/stores/UIManager.svelte';
	import Favicons from '$lib/components/Favicons.svelte';

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
