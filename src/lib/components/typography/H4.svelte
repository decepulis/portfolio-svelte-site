<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		as?: string;
	};
	const { children, as }: Props = $props();
</script>

<svelte:element this={as || 'h4'} class="my-8 text-lg font-bold text-pretty">
	{@render children()}
</svelte:element>
