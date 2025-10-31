<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';

	const { content, index }: Tag['attributes'] = $props();
	const uid = $props.id();
	// I really wanna use popover, but, it's being weird in chrome... so...
	// let's manage this ourselves.
	let open = $state(false);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			open = false;
			event.preventDefault();
		}
	}
</script>

<button
	aria-expanded={open}
	aria-controls={uid}
	aria-label="Footnote {index}"
	onclick={() => (open = !open)}
	onkeydown={handleKeydown}
	class="relative"
	style:anchor-name="--footnote-{uid}"
>
	<sup class="text-link hocus:no-underline cursor-help underline">[{index}]</sup>
</button>
<span
	id={uid}
	hidden={!open}
	class="border-silver dark:border-gray bg-gainsboro dark:bg-silver absolute bottom-1 max-w-prose border p-2 font-sans text-sm"
	style:position-anchor="--footnote-{uid}"
	style:position-area="top"
	style:position-try-fallbacks="flip-block"
>
	{content}
</span>
