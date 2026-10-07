<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import type { MuxSource } from '@videojs/html/media/mux-video';

	import '$lib/videojs';

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

		// Keep the hls.js-backed media implementation and the Mux Data SDK out of the initial bundle.
		void Promise.all([
			import('@videojs/html/media/mux-video'),
			import('@videojs/html/extensions/mux-data')
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
			<video-neutral-skin
				class="border-silver dark:border-gray absolute inset-0 border"
				style:--media-accent-color="var(--color-blue)"
				style:--media-border-radius="0"
			>
				{#if mediaReady}
					<mux-video {source} playsinline crossorigin="anonymous" {loop} {autoplay} {muted}
					></mux-video>
					<mux-data metadata={{ video_title: title }}></mux-data>
				{/if}
			</video-neutral-skin>
		</video-player>
	</div>
	{#if caption}
		<figcaption class="mt-2 text-sm italic">{caption}</figcaption>
	{/if}
</figure>
