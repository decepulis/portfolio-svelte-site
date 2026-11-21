<!-- A control drawn as a form button filling its own sunken table cell, with a tooltip. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		/** The control's element, e.g. `media-play-button`. */
		as: string;
		/** Which side the tooltip opens on, or `false` for none. */
		tooltip?: 'top' | 'bottom' | false;
		class?: ClassValue;
		children?: Snippet;
		[attribute: string]: unknown;
	};
	const { as, tooltip = 'top', class: className, children, ...attributes }: Props = $props();

	const id = $props.id();
</script>

<svelte:element
	this={as}
	{id}
	class={[
		'sunken flex h-6 min-w-7 cursor-pointer items-center justify-center gap-1 px-1.5 text-xs',
		'bg-gainsboro hover:bg-white aria-expanded:bg-white',
		'dark:bg-silver dark:hover:bg-gainsboro dark:aria-expanded:bg-gainsboro',
		'aria-disabled:text-gray -outline-offset-4 focus-visible:outline-2 aria-disabled:cursor-not-allowed',
		className
	]}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

{#if tooltip}
	<media-tooltip
		trigger={id}
		side={tooltip}
		class="border-gray m-0 border bg-white px-1.5 py-0.5 text-[11px] whitespace-nowrap text-black data-open:flex data-open:items-center data-open:gap-1"
	>
		<media-tooltip-label></media-tooltip-label>
		<media-tooltip-shortcut class="border-silver border px-1 font-mono empty:hidden"
		></media-tooltip-shortcut>
	</media-tooltip>
{/if}
