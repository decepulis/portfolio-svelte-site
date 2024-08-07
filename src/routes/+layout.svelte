<script lang="ts">
	import './layout.css';
	import ShouldReduceMotionManager from '$lib/components/ShouldReduceMotionManager.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import type { Snippet } from 'svelte';
	import { onNavigate } from '$app/navigation';

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
	<ShouldReduceMotionManager />
	{@render children?.()}
</Metadata>
