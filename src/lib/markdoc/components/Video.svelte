<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import type { MuxSource } from '@videojs/html/media/mux-video';

	import VideoSkin from '$lib/components/VideoSkin/index.svelte';

	const { title, caption, playbackId, width, height, loop, autoplay, muted }: Tag['attributes'] =
		$props();

	const source: MuxSource = $derived({
		playbackId,
		playback: { maxResolution: '1080p' },
		poster: { time: 0 }
	});
	let mediaReady = $state(false);

	$effect(() => {
		let cancelled = false;

		// Keep the playback engine, Mux Data and Google Cast out of the initial bundle.
		void Promise.all([
			import('@videojs/html/media/mux-video/spf'),
			import('@videojs/html/extensions/mux-data'),
			import('@videojs/html/extensions/google-cast')
		]).then(() => {
			if (!cancelled) mediaReady = true;
		});

		return () => {
			cancelled = true;
		};
	});
</script>

<figure class="row-span-2 my-8 grid w-full grid-rows-subgrid gap-0 first:mt-0 last:mb-0">
	<div style:aspect-ratio="{width}/{height}" class="bg-gray relative w-full">
		<video-player content-title={title}>
			<VideoSkin class="absolute inset-0">
				{#if mediaReady}
					<mux-video {source} playsinline crossorigin="anonymous" {loop} {autoplay} {muted}
					></mux-video>
					<mux-data metadata={{ video_title: title }}></mux-data>
					<google-cast></google-cast>
				{/if}
			</VideoSkin>
		</video-player>
	</div>
	{#if caption}
		<figcaption class="mt-2 text-sm italic">{caption}</figcaption>
	{/if}
</figure>
