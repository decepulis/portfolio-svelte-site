<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';

	const { html }: Tag['attributes'] = $props();
</script>

<div class="my-8 w-full">{@html html}</div>
