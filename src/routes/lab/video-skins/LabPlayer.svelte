<!-- Renders a skin component around a Mux video, for side-by-side skin exploration. -->
<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import type { MuxSource } from '@videojs/html/media/mux-video';

	import '$lib/videojs';

	type Props = {
		Skin: Component<{ children?: Snippet; class?: string }>;
		title?: string;
		playbackId?: string;
		width?: number;
		height?: number;
	};
	const {
		Skin,
		title = 'Parallax molecules',
		playbackId = '9ZMTsFQmaoNsvfVXDqXlPGYuGmdxz6GiV99TH5D16dM',
		width = 3024,
		height = 1722
	}: Props = $props();

	const source: MuxSource = $derived({
		playbackId,
		playback: { maxResolution: '1080p' },
		poster: { time: 0 }
	});
	let mediaReady = $state(false);

	$effect(() => {
		let cancelled = false;
		void import('@videojs/html/media/mux-video').then(() => {
			if (!cancelled) mediaReady = true;
		});
		return () => {
			cancelled = true;
		};
	});
</script>

<div style:aspect-ratio="{width}/{height}" class="relative w-full">
	<video-player content-title={title}>
		<Skin class="absolute inset-0">
			{#if mediaReady}
				<mux-video {source} playsinline crossorigin="anonymous"></mux-video>
			{/if}
		</Skin>
	</video-player>
</div>
