<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	import type { Tag } from '@markdoc/markdoc';
	import '@videojs/html/video/skin.css';

	const { title, caption, playbackId, width, height, ...rest }: Tag['attributes'] = $props();

	// Video.js 10 has no playback-id attribute. Mux settings live in a source object, or in
	// a stream URL it parses back into one, which is what markup we can't script gets.
	const src = $derived(`https://stream.mux.com/${playbackId}.m3u8?max_resolution=1080p`);
	// The poster is ours to build now, too. mux-player's thumbnail-time="0" is ?time=0.
	const poster = $derived(`https://image.mux.com/${playbackId}/thumbnail.webp?time=0`);

	// These modules touch HTMLElement as they register their custom elements, so they can't
	// be imported during prerender. The markup below renders as inert unknown elements
	// until they land, then upgrades in place. import() de-dupes, so calling this per
	// player on the page costs nothing.
	function defineElements() {
		return Promise.all([
			import('@videojs/html/video/player'),
			import('@videojs/html/video/skin'),
			import('@videojs/html/media/mux-video'),
			import('@videojs/html/media/mux-data')
		]);
	}

	$effect(() => {
		void defineElements();
	});

	// Analytics is its own element now, and metadata is an object, so it's a property with
	// no attribute form. Setting it has to wait for <mux-data> to be defined, or the
	// upgrade would shadow the value with the class's own accessor.
	function metadata(videoTitle: string): Attachment {
		return (element) => {
			let cancelled = false;

			void defineElements().then(() => {
				if (cancelled) return;
				(element as HTMLElement & { metadata?: Record<string, unknown> }).metadata = {
					video_title: videoTitle
				};
			});

			return () => {
				cancelled = true;
			};
		};
	}
</script>

<figure class="row-span-2 my-8 grid w-full grid-rows-subgrid gap-0 first:mt-0 last:mb-0">
	<div style:aspect-ratio="{width}/{height}" class="bg-gray relative w-full">
		<video-player content-title={title}>
			<video-skin
				class="border-silver dark:border-gray absolute inset-0 border"
				style:--media-accent-color="var(--color-blue)"
				style:--media-border-radius="0"
			>
				<mux-video {src} playsinline crossorigin="anonymous" {...rest}></mux-video>
				<mux-data {@attach metadata(title)} player-software-name="portfolio-site"></mux-data>
				<img slot="poster" src={poster} alt="" />
			</video-skin>
		</video-player>
	</div>
	{#if caption}
		<figcaption class="mt-2 text-sm italic">{caption}</figcaption>
	{/if}
</figure>
