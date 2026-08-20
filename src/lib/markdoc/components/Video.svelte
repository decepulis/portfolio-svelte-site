<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import '@videojs/html/video/minimal-skin.css';

	const { title, caption, playbackId, width, height, ...rest }: Tag['attributes'] = $props();

	// MuxVideo takes either a structured source object or a stream URL it parses back into
	// one. A source object has no attribute form, so markup gets the URL.
	const src = $derived(`https://stream.mux.com/${playbackId}.m3u8?max_resolution=1080p`);
	// Posters come from Mux's thumbnail endpoint, where ?time= picks the frame. MuxVideo
	// derives this same URL and reports it, and a skin picks it up as of beta.30 — at which
	// point this <img> can go, in exchange for poster params on the source object.
	const poster = $derived(`https://image.mux.com/${playbackId}/thumbnail.webp?time=0`);

	$effect(() => {
		// These modules touch HTMLElement as they register their custom elements, so they
		// can't be imported during prerender. The markup below renders as inert unknown
		// elements until they land, then upgrades in place.
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
				<mux-video {src} playsinline crossorigin="anonymous" {...rest}></mux-video>
				<img slot="poster" src={poster} alt="" />
			</video-minimal-skin>
		</video-player>
	</div>
	{#if caption}
		<figcaption class="mt-2 text-sm italic">{caption}</figcaption>
	{/if}
</figure>
