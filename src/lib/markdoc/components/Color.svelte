<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import '@mux/mux-player';

	const { color, children }: Tag['attributes'] = $props();
</script>

<span class="inline-flex items-center">
	{@render children()}
	<span style:background-color={color} class="w-2 h-2 ml-1 border border-current rounded-full inline-block"></span>
</span>
