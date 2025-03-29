<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		as?: string;
	};
	const { children, as }: Props = $props();
</script>

<svelte:element
	this={as || 'h1'}
	class="mt-16 mb-8 text-4xl font-bold text-balance md:mt-24 md:mb-12"
>
	{@render children()}
</svelte:element>
