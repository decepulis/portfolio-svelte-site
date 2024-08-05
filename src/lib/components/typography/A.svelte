<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		decoration?: string;
	};
	const { children, decoration, ...rest }: Props & SvelteHTMLElements['a'] = $props();
</script>

<a
	class="text-linkText {decoration
		? 'group'
		: 'underline hover:decoration-wavy focus:decoration-wavy'}"
	{...rest}
>
	{#if decoration}
		{decoration}
		<span class="underline group-hover:decoration-wavy group-focus:decoration-wavy">
			{@render children?.()}
		</span>
	{:else}
		{@render children?.()}
	{/if}
</a>
