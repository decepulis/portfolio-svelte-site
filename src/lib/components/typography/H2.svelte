<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		as?: string;
	};
	const { children, as }: Props = $props();
</script>

<svelte:element this={as || 'h2'} class="mt-16 mb-8 text-balance text-3xl font-bold">
	{@render children()}
</svelte:element>
