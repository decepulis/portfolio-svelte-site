<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		decoration?: string;
		withVisitedStyles?: boolean;
	};
	const {
		children,
		decoration,
		withVisitedStyles = true,
		...rest
	}: Props & SvelteHTMLElements['a'] = $props();
</script>

<a
	class="text-link"
	class:visited:text-visited={withVisitedStyles}
	class:group={decoration}
	class:hocus:decoration-wavy={!decoration}
	class:underline={!decoration}
	{...rest}
>
	{#if decoration}
		{decoration}
		<span class="group-hocus:decoration-wavy underline">
			{@render children?.()}
		</span>
	{:else}
		{@render children?.()}
	{/if}
</a>
