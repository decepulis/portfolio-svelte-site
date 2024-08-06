<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<div class="my-8 grid gap-4 md:grid-cols-2">{@render children()}</div>

<style>
	div :global(p),
	div :global(img),
	div :global(figure) {
		margin-top: 0;
		margin-bottom: 0;
	}
</style>
