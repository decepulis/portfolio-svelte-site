<script lang="ts">
	import ui from '$lib/stores/ui.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		ui.shouldReduceMotion = reduceQuery.matches;

		const onQueryChange = (e: MediaQueryListEvent) => (ui.shouldReduceMotion = e.matches);
		reduceQuery.addEventListener('change', onQueryChange);

		return () => reduceQuery.removeEventListener('change', onQueryChange);
	});
</script>
