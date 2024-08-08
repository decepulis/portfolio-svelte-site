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
	class="text-link dark:text-link-dark"
	class:visited:text-visited={withVisitedStyles}
	class:dark:visited:text-visited-dark={withVisitedStyles}
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
