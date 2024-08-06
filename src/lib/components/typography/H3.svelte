<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		as?: string;
	};
	const { children, as }: Props = $props();
</script>

<svelte:element this={as || 'h3'} class="my-8 text-balance text-xl font-bold italic">
	{@render children()}
</svelte:element>
