<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<h2 class="mt-16 mb-8 text-4xl font-bold">{@render children()}</h2>
