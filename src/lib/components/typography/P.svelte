<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<p class="my-4 text-pretty first:mt-0 last:mb-0">{@render children()}</p>
