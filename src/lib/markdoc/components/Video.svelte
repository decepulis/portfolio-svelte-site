<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import '@mux/mux-player';

	const { title, caption, playbackId, width, height, ...rest }: Tag['attributes'] = $props();
</script>

<figure class="row-span-2 my-8 grid w-full max-w-lg grid-rows-subgrid gap-0 first:mt-0 last:mb-0">
	<div style:aspect-ratio="{width}/{height}" class="bg-gray relative w-full">
		<mux-player
			playback-id={playbackId}
			metadata-video-title={title}
			max-resolution="1080p"
			class="absolute inset-0"
			style:--media-font-family="var(--font-family-sans)"
			accent-color="blue"
			{...rest}
		></mux-player>
	</div>
	{#if caption}
		<figcaption class="mt-2 text-sm italic">{caption}</figcaption>
	{/if}
</figure>
