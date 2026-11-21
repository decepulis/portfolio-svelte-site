<script lang="ts">
	import type { Tag } from '@markdoc/markdoc';
	import type { MuxSource } from '@videojs/html/media/mux-video';

	import VideoSkin from '$lib/components/VideoSkin/index.svelte';

	const {
		title,
		caption,
		playbackId,
		youtube,
		width,
		height,
		loop,
		autoplay,
		muted
	}: Tag['attributes'] = $props();

	const source: MuxSource = $derived({
		playbackId,
		playback: { maxResolution: '1080p' },
		poster: { time: 0 }
	});
	// Play the published copy on YouTube until YouTube says it's gone, then the Mux backup.
	let youtubeGone = $state(false);
	const fromYouTube = $derived(youtube && !youtubeGone);
	let mediaReady = $state(false);

	$effect(() => {
		let cancelled = false;

		// Keep the playback engines, Mux Data and Google Cast out of the initial bundle.
		const imports = fromYouTube
			? [import('@videojs/html/media/youtube-video')]
			: [
					import('@videojs/html/media/mux-video/spf'),
					import('@videojs/html/extensions/mux-data'),
					import('@videojs/html/extensions/google-cast')
				];
		void Promise.all(imports).then(() => {
			if (!cancelled) mediaReady = true;
		});

		return () => {
			cancelled = true;
		};
	});
</script>

<figure class="row-span-2 my-8 grid w-full grid-rows-subgrid gap-0 first:mt-0 last:mb-0">
	<video-player content-title={title}>
		<VideoSkin aspectRatio="{width}/{height}">
			{#if mediaReady && fromYouTube}
				<!-- loads nothing from YouTube until it's played, so it shows the backup's poster -->
				<youtube-video
					src={youtube}
					poster="https://image.mux.com/{playbackId}/thumbnail.webp?time=0"
					preload="none"
					playsinline
					{loop}
					{autoplay}
					{muted}
					onerror={() => (youtubeGone = true)}
				></youtube-video>
			{:else if mediaReady}
				<mux-video {source} playsinline crossorigin="anonymous" {loop} {autoplay} {muted}
				></mux-video>
				<mux-data metadata={{ video_title: title }}></mux-data>
				<google-cast></google-cast>
			{/if}
		</VideoSkin>
	</video-player>
	{#if caption}
		<figcaption class="mt-2 text-sm italic">{caption}</figcaption>
	{/if}
</figure>
