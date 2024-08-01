<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { children, ...rest }: SvelteHTMLElements['a'] = $props();
</script>

<a
	class="text-linkText visited:text-visitedText underline hover:decoration-wavy focus:decoration-wavy"
	{...rest}
>
	{@render children?.()}
</a>
