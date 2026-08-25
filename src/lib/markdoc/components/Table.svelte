<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<div class="my-4 overflow-x-auto first:mt-0 last:mb-0">
	<table
		class="[&_td]:border-silver [&_th]:border-silver [&_th]:bg-gainsboro dark:[&_td]:border-gray dark:[&_th]:border-gray dark:[&_th]:bg-gray w-full border-collapse text-left text-sm [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:font-bold"
	>
		{@render children()}
	</table>
</div>
