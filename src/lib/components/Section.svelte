<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { children, ...rest }: SvelteHTMLElements['section'] = $props();
</script>

<section {...rest} class="px-4">{@render children?.()}</section>
