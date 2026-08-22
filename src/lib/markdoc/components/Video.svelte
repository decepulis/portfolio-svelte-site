<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import '@videojs/html/video/minimal-skin.css';

	const { title, caption, playbackId, width, height, ...rest }: Tag['attributes'] = $props();

	// MuxVideo takes either a structured source object or a stream URL it parses back into
	// one. A source object has no attribute form, so markup gets the URL.
	const src = $derived(`https://stream.mux.com/${playbackId}.m3u8?max_resolution=1080p`);
	$effect(() => {
		// The player and skin touch HTMLElement as they register their custom elements, so
		// they can't be imported during prerender. The Mux media could be, but the hls.js
		// it carries is ~640kB of the ~920kB total, so it stays out of the page bundle as
		// well. The markup below renders as inert unknown elements until these land, then
		// upgrades in place.
		void Promise.all([
			import('@videojs/html/video/player'),
			import('@videojs/html/video/minimal-skin'),
			import('@videojs/html/media/mux-video')
		]);
	});
</script>

<figure class="row-span-2 my-8 grid w-full grid-rows-subgrid gap-0 first:mt-0 last:mb-0">
	<div style:aspect-ratio="{width}/{height}" class="bg-gray relative w-full">
		<video-player content-title={title}>
			<video-minimal-skin
				class="border-silver dark:border-gray absolute inset-0 border"
				style:--media-accent-color="var(--color-blue)"
				style:--media-border-radius="0"
			>
				<mux-video {src} poster-time="0" playsinline crossorigin="anonymous" {...rest}></mux-video>
			</video-minimal-skin>
		</video-player>
	</div>
	{#if caption}
		<figcaption class="mt-2 text-sm italic">{caption}</figcaption>
	{/if}
</figure>
