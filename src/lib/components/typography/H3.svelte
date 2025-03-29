<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		as?: string;
	};
	const { children, as }: Props = $props();
</script>

<svelte:element this={as || 'h3'} class="mt-8 mb-4 text-xl font-bold text-balance italic">
	{@render children()}
</svelte:element>
