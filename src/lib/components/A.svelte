<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { children, ...rest }: SvelteHTMLElements['a'] = $props();
</script>

<a class="text-blue underline hover:decoration-wavy focus:decoration-wavy" {...rest}>
	{@render children?.()}
</a>
