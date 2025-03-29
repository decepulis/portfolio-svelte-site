<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		as?: string;
	};
	const { children, as }: Props = $props();
</script>

<svelte:element this={as || 'h2'} class="mt-16 mb-8 text-3xl font-bold text-balance">
	{@render children()}
</svelte:element>
