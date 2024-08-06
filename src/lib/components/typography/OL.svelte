<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<ol class="my-4 ml-4 list-decimal text-pretty first:mt-0 last:mb-0">{@render children()}</ol>
