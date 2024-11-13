<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import '@mux/mux-player';

	const { color, children }: Tag['attributes'] = $props();
</script>

<span class="inline-flex items-center">
	{@render children()}
	<span
		style:background-color={color}
		class="ml-1 inline-block h-2 w-2 rounded-full border border-current"
	></span>
</span>
