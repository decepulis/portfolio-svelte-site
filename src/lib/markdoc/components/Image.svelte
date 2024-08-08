<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import type { Picture } from 'vite-imagetools';

	type Props = {
		attributes: Tag['attributes'];
		enhancedImages?: Record<string, string | Picture>;
	};
	const { attributes, enhancedImages }: Props = $props();

	const { src, block, title, ...rest } = $derived(attributes);
	const enhancedImage = $derived(enhancedImages?.[src]);
</script>

<!-- this snippet uses enhanced:img if it can find an enhancedImage, otherwise, just img -->
{#snippet image()}
	{#if enhancedImage}
		<!-- todo: optimize -->
		<enhanced:img
			{...rest}
			src={enhancedImage}
			class="border-silver border"
			class:w-full={block}
			class:h-auto={block}
			title={// if block we use title for caption
			block ? undefined : title}
		/>
	{:else}
		<img
			{...rest}
			{src}
			class="border-silver border"
			class:w-full={block}
			class:h-auto={block}
			title={// if block we use title for caption
			block ? undefined : title}
		/>
	{/if}
{/snippet}

<!-- if the image is block-level, we wrap it with a figure and add a caption -->
<!-- if the image is inline, we treat the caption like a title up above -->
{#if block}
	<figure class="row-span-2 my-8 grid w-full max-w-lg grid-rows-subgrid gap-0 first:mt-0 last:mb-0">
		{@render image()}
		{#if title}
			<figcaption class="mt-2 text-sm italic">{title}</figcaption>
		{/if}
	</figure>
{:else}
	{@render image()}
{/if}
