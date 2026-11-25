<!-- A control drawn as a form button filling its own sunken table cell, with a tooltip. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import { sunken } from './bevel';

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
		sunken,
		'bg-gainsboro dark:bg-silver flex h-6 min-w-7 cursor-pointer items-center justify-center gap-1 px-1.5 text-xs',
		// flat, like a button in the browser's toolbar, until it's pointed at or tabbed to; then it rises
		// out of its cell, and sinks in, face and all, while held or while its popup is open
		'hocus:shadow-[inset_1px_1px_var(--color-white),inset_-1px_-1px_var(--color-gray)]',
		'active:shadow-[inset_1px_1px_var(--color-gray),inset_-1px_-1px_var(--color-white)] active:*:translate-px',
		'aria-expanded:shadow-[inset_1px_1px_var(--color-gray),inset_-1px_-1px_var(--color-white)] aria-expanded:*:translate-px',
		'aria-disabled:text-gray aria-disabled:cursor-not-allowed aria-disabled:shadow-none aria-disabled:*:translate-none',
		'-outline-offset-4',
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
