<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		id: string;
	};
	const { children, id }: Props = $props();
</script>

<section class="px-4" {id}>{@render children()}</section>
