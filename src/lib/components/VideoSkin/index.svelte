<!--
	The site's video player skin, drawn the way a browser drew an HTML 3.2 page: one raised table,
	with the title in its first row, the movie in a sunken cell, and flat form buttons in the cells
	beneath, docked under the picture like the QuickTime plug-in's controller and always showing.
	Fullscreen is just the movie: the controller floats over its bottom edge and steps aside, with
	the pointer, when it's left idle.

	TODO: captions, audio tracks and chapters are missing. Restore them: a captions button and menu
	panel, an audio track panel, and chapter marks and titles on the timeline.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import { raised, sunken } from './bevel';
	import Control from './Control.svelte';
	import SettingsMenu from './SettingsMenu.svelte';
	import './register';

	type Props = {
		/** The media element, e.g. `<mux-video>`. */
		children?: Snippet;
		class?: ClassValue;
		/** The movie's aspect ratio, e.g. `16/9`. */
		aspectRatio: string;
	};
	const { children, class: className, aspectRatio }: Props = $props();

	const id = $props.id();

	/** `<table border=1 cellspacing=2>`: a raised frame with its cells 2px apart. */
	const table = [raised, 'gap-[2px] bg-white p-[2px] dark:bg-gainsboro'];
	/** Feedback that presses into the page like a rubber stamp, then rests slightly askew. */
	const stamp = [
		table,
		'flex -rotate-1 font-serif text-xl font-bold data-starting-style:invisible',
		'not-data-starting-style:animate-[video-stamp_400ms_cubic-bezier(0.2,0.8,0.3,1)] motion-reduce:animate-none'
	];
	/** The play button's three faces; each class names when that face is hidden. */
	const playFaces = [
		{ icon: 'restart', hidden: 'not-group-data-ended/play:hidden' },
		{
			icon: 'play',
			hidden:
				'group-data-ended/play:hidden group-data-started/play:not-group-data-paused/play:hidden'
		},
		{
			icon: 'pause',
			hidden:
				'not-group-data-started/play:hidden group-data-ended/play:hidden group-data-paused/play:hidden'
		}
	];

	const hotkeys = [
		{ keys: 'Space', action: 'togglePaused' },
		{ keys: 'k', action: 'togglePaused' },
		{ keys: 'm', action: 'toggleMuted' },
		{ keys: 'f', action: 'toggleFullscreen' },
		{ keys: 'i', action: 'togglePictureInPicture' },
		{ keys: 'ArrowLeft', action: 'seekStep' },
		{ keys: 'ArrowRight', action: 'seekStep' },
		{ keys: 'j', action: 'seekStep' },
		{ keys: 'l', action: 'seekStep' },
		{ keys: 'ArrowUp', action: 'volumeStep' },
		{ keys: 'ArrowDown', action: 'volumeStep' },
		{ keys: '0-9', action: 'seekToPercent' }
	];
</script>

{#snippet icon(name: string, className?: ClassValue, size = 'size-4')}
	<!-- the icon draws an svg of a fixed size, so stretch it to the size asked for -->
	<media-icon family="scaffold" {name} class={['block *:size-full', size, className]}></media-icon>
{/snippet}

<media-container
	class={[
		table,
		'group/player @container relative flex flex-col font-sans text-black',
		'[&:fullscreen]:border-0 [&:fullscreen]:bg-black [&:fullscreen]:p-0',
		'[&:fullscreen]:not-data-controls-visible:cursor-none',
		className
	]}
>
	<div
		class={[
			sunken,
			'bg-gainsboro dark:bg-silver truncate px-2 py-0.5 font-serif font-bold in-[:fullscreen]:hidden has-[media-title:empty]:hidden'
		]}
	>
		<media-title></media-title>
	</div>

	<div
		style:aspect-ratio={aspectRatio}
		class={[
			sunken,
			'relative overflow-hidden bg-black in-[:fullscreen]:flex-1 in-[:fullscreen]:border-0'
		]}
	>
		{@render children?.()}

		<media-poster class="absolute inset-0 not-data-visible:hidden">
			<img alt="" class="size-full object-contain" />
		</media-poster>

		<media-buffering-indicator
			class={[table, 'absolute top-1/2 left-1/2 flex -translate-1/2 not-data-visible:hidden']}
		>
			<span class={[sunken, 'px-2 py-1 font-serif italic']}>Loading&hellip;</span>
		</media-buffering-indicator>

		<!-- the status announcer reads out the same events, so these stay quiet -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 grid grid-cols-3 items-center"
		>
			<media-volume-indicator
				class={[
					stamp,
					'group/volume col-span-full row-start-1 mt-14 self-start justify-self-center'
				]}
			>
				<media-volume-indicator-fill
					class="flex gap-[2px] group-data-max/volume:animate-[video-shake_300ms_linear] group-data-min/volume:animate-[video-shake_300ms_linear] motion-reduce:animate-none"
				>
					<span class={[sunken, 'flex w-24 items-center justify-center gap-2 py-1']}>
						{@render icon('volume-high', 'not-group-data-[level=high]/volume:hidden', 'size-5')}
						{@render icon('volume-low', 'not-group-data-[level=low]/volume:hidden', 'size-5')}
						{@render icon('volume-off', 'not-group-data-[level=off]/volume:hidden', 'size-5')}
						<media-volume-indicator-value class="tabular-nums"></media-volume-indicator-value>
					</span>
					<!-- a row of little cells, filled up to the level -->
					<span class={[sunken, 'flex w-32 p-[3px] @max-md:w-16']}>
						<span
							class="bg-gainsboro flex-1 [mask-image:repeating-linear-gradient(90deg,#000_0_4px,transparent_4px_6px)]"
						>
							<span class="bg-blue block h-full w-(--media-volume-fill)"></span>
						</span>
					</span>
				</media-volume-indicator-fill>
			</media-volume-indicator>

			<media-seek-indicator
				class={[
					stamp,
					'group/seek row-start-1 mx-6',
					'data-[direction=backward]:col-start-1 data-[direction=backward]:justify-self-start',
					'data-[direction=forward]:col-start-3 data-[direction=forward]:justify-self-end'
				]}
			>
				<span
					class={[
						sunken,
						'flex items-center gap-1.5 px-2 py-1 group-data-[direction=backward]/seek:flex-row-reverse'
					]}
				>
					<media-seek-indicator-value class="tabular-nums"></media-seek-indicator-value>
					<span class="text-[11px] group-data-[direction=backward]/seek:hidden">&#9654;&#9654;</span
					>
					<span class="text-[11px] group-data-[direction=forward]/seek:hidden">&#9664;&#9664;</span>
				</span>
			</media-seek-indicator>
		</div>

		<media-error-dialog class="contents">
			<media-dialog-popup
				class={[
					table,
					'absolute top-1/2 left-1/2 grid w-[calc(100%-2rem)] max-w-80 -translate-1/2 gap-2 px-3 py-2 font-serif not-data-open:hidden'
				]}
			>
				<media-dialog-title class="text-xl font-bold"></media-dialog-title>
				<hr class="border-t-gray border-b border-b-white" />
				<media-dialog-description></media-dialog-description>
				<!-- with copy of its own, the error dialog leaves it be and doesn't clobber hydration -->
				<Control as="media-dialog-close" tooltip={false} class="justify-self-end px-4 font-sans">
					OK
				</Control>
			</media-dialog-popup>
		</media-error-dialog>
	</div>

	<media-tooltip-group class="contents">
		<!--
					the controller: the timeline over a row of buttons. Popups open above the buttons, clearing
					the timeline row (--spacing(6)) and the borders and spacing around it (8px).
				-->
		<media-controls-group
			class={[
				'flex flex-col gap-[2px]',
				'in-[:fullscreen]:border-gray in-[:fullscreen]:border-t-silver in-[:fullscreen]:border-l-silver in-[:fullscreen]:border',
				'dark:in-[:fullscreen]:border-t-white dark:in-[:fullscreen]:border-l-white',
				'in-[:fullscreen]:absolute in-[:fullscreen]:inset-x-0 in-[:fullscreen]:bottom-0',
				'dark:in-[:fullscreen]:bg-gainsboro in-[:fullscreen]:bg-white in-[:fullscreen]:p-[2px]',
				'in-[:fullscreen]:group-not-data-controls-visible/player:invisible',
				'[--media-popover-side-offset:calc(--spacing(6)+8px)] [--media-tooltip-side-offset:calc(--spacing(6)+8px)]'
			]}
		>
			<div class={[sunken, 'flex h-6 items-center px-2']}>
				<media-time-slider
					thumb-alignment="edge"
					class="group/slider relative flex h-4 flex-1 cursor-pointer items-center"
				>
					<media-slider-track
						class={[sunken, 'dark:bg-gainsboro relative h-2.5 w-full overflow-hidden bg-white']}
					>
						<media-slider-buffer
							class="absolute inset-y-px left-0 w-(--media-slider-buffer) bg-[repeating-linear-gradient(90deg,var(--color-gainsboro)_0_3px,transparent_3px_4px)] dark:bg-[repeating-linear-gradient(90deg,var(--color-silver)_0_3px,transparent_3px_4px)]"
						></media-slider-buffer>
						<media-slider-fill
							class="bg-blue absolute inset-y-px left-0 w-(--media-slider-fill) group-data-dragging/slider:w-(--media-slider-pointer)"
						></media-slider-fill>
					</media-slider-track>
					<media-slider-thumb
						class="border-gray bg-gainsboro group-hocus/slider:bg-white absolute left-(--media-slider-fill) h-4 w-2 -translate-x-1/2 border outline-offset-1 group-data-dragging/slider:left-(--media-slider-pointer) focus-visible:outline-2"
					></media-slider-thumb>
					<media-slider-preview
						class="pointer-events-none invisible bottom-[calc(100%+--spacing(3))] flex flex-col items-center group-data-dragging/slider:visible group-data-pointing/slider:visible"
					>
						<media-slider-thumbnail class={[table, 'block max-w-40']}>
							<img alt="" class={[sunken, 'block']} />
						</media-slider-thumbnail>
						<media-slider-value
							type="pointer"
							class="border-gray -mt-px border bg-white px-1.5 py-0.5 text-[11px] tabular-nums"
						></media-slider-value>
					</media-slider-preview>
				</media-time-slider>
			</div>

			<div class="flex gap-[2px]">
				<Control as="media-play-button" class="group/play">
					{#each playFaces as { icon: name, hidden } (name)}
						{@render icon(name, hidden)}
					{/each}
				</Control>

				<Control as="media-mute-button" commandfor="{id}-volume" tooltip={false} class="group/mute">
					{@render icon('volume-off', 'not-group-data-muted/mute:hidden')}
					{@render icon('volume-high', 'group-data-muted/mute:hidden')}
				</Control>
				<!-- a one-cell table above the mute button, exactly as wide -->
				<media-volume-popover
					id="{id}-volume"
					open-on-hover
					delay={200}
					close-delay={100}
					side="top"
					class={[table, 'm-0 h-28 w-(--media-popover-anchor-width)']}
				>
					<div class={[sunken, 'size-full py-2']}>
						<media-volume-slider
							orientation="vertical"
							thumb-alignment="edge"
							class="group/volume relative flex size-full cursor-pointer justify-center"
						>
							<media-slider-track class={[sunken, 'dark:bg-gainsboro relative w-2 bg-white']}>
								<media-slider-fill
									class="bg-blue absolute inset-x-0 bottom-0 h-(--media-slider-fill)"
								></media-slider-fill>
							</media-slider-track>
							<media-slider-thumb
								class="border-gray bg-gainsboro group-hocus/volume:bg-white absolute bottom-(--media-slider-fill) left-1/2 h-2 w-4 -translate-x-1/2 translate-y-1/2 border outline-offset-1 focus-visible:outline-2"
							></media-slider-thumb>
						</media-volume-slider>
					</div>
				</media-volume-popover>

				<div class={[sunken, 'flex flex-1 items-center px-2 text-xs tabular-nums']}>
					<media-time-group class="flex gap-1.5">
						<media-time type="current"></media-time>
						<media-time-separator class="text-gray @max-2xs:hidden"></media-time-separator>
						<media-time type="duration" class="@max-2xs:hidden"></media-time>
					</media-time-group>
				</div>

				<SettingsMenu />
				<Control as="media-airplay-button" class="group/airplay">
					{@render icon('airplay-enter', 'group-data-[airplay-state=connected]/airplay:hidden')}
					{@render icon('airplay-exit', 'not-group-data-[airplay-state=connected]/airplay:hidden')}
				</Control>
				<Control as="media-cast-button" class="group/cast">
					{@render icon('cast-enter', 'group-data-[cast-state=connected]/cast:hidden')}
					{@render icon('cast-exit', 'not-group-data-[cast-state=connected]/cast:hidden')}
				</Control>
				<Control as="media-pip-button" class="group/pip">
					{@render icon('pip-enter', 'group-data-pip/pip:hidden')}
					{@render icon('pip-exit', 'not-group-data-pip/pip:hidden')}
				</Control>
				<Control as="media-fullscreen-button" class="group/fullscreen">
					{@render icon('fullscreen-enter', 'group-data-fullscreen/fullscreen:hidden')}
					{@render icon('fullscreen-exit', 'not-group-data-fullscreen/fullscreen:hidden')}
				</Control>
			</div>
		</media-controls-group>
	</media-tooltip-group>

	{#each hotkeys as { keys, action } (keys)}
		<media-hotkey {keys} {action}></media-hotkey>
	{/each}
	<media-gesture type="tap" action="togglePaused" pointer="mouse" region="center"></media-gesture>
	<media-gesture type="tap" action="toggleControls" pointer="touch"></media-gesture>
	<media-gesture type="doubletap" action="seekStep" region="left"></media-gesture>
	<media-gesture type="doubletap" action="toggleFullscreen" region="center"></media-gesture>
	<media-gesture type="doubletap" action="seekStep" region="right"></media-gesture>

	<media-status-announcer class="sr-only"></media-status-announcer>
</media-container>

<style>
	/* Pressed in from a little above the page, overshooting once before it settles. */
	@keyframes -global-video-stamp {
		0% {
			transform: scale(1.45) rotate(-5deg);
		}
		45% {
			transform: scale(0.96) rotate(0deg);
		}
		70% {
			transform: scale(1.02) rotate(-1.5deg);
		}
	}

	/* Volume can't go any further: the meter rattles. */
	@keyframes -global-video-shake {
		20%,
		60% {
			translate: -4px;
		}
		40%,
		80% {
			translate: 4px;
		}
	}
</style>
