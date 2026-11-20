<!--
	Lab skin: tabs. Forked from $lib/videojs/scaffold/ScaffoldSkin.svelte.
	Markup follows the HTML registry skin (html/scaffold, video/skin.html); classes come from the
	React Tailwind registry skin (react/scaffold, video/**/*.tsx), which has the same structure.
	Copy this file as the starting point for a custom skin.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import '$lib/videojs/scaffold/register';

	type Props = {
		/** The media element (e.g. `<mux-video>`). */
		children?: Snippet;
		class?: ClassValue;
		style?: string;
	};
	const { children, class: className, style }: Props = $props();

	// Tooltips, popovers and submenus point at their triggers by id, so ids must be unique per player.
	const uid = $props.id();
	const id = (name: string) => `${uid}-${name}`;

	// == shared classes ==
	// Buttons are the inactive tabs from $lib/components/Tabs.svelte: flat gainsboro, silver border,
	// white on hover/focus. An expanded button becomes the *active* tab: page-colored, with its top
	// border opened up so it joins the panel (menu/volume popover) that opens above it.
	const button = [
		'relative grid size-8 shrink-0 cursor-pointer place-items-center rounded-none p-0',
		'border border-solid border-silver bg-gainsboro text-black dark:border-gray dark:bg-silver',
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[3px] pointer-coarse:before:content-['']",
		'hover:bg-white focus-visible:bg-white dark:hover:bg-gainsboro dark:focus-visible:bg-gainsboro',
		'aria-expanded:border-t-white aria-expanded:bg-white dark:aria-expanded:border-t-gainsboro dark:aria-expanded:bg-gainsboro',
		'outline-none -outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue',
		'aria-disabled:cursor-not-allowed aria-disabled:text-gray disabled:cursor-not-allowed disabled:text-gray',
		'forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]',
		'forced-colors:forced-color-adjust-none',
		'forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText] forced-colors:focus-visible:bg-[Highlight] forced-colors:focus-visible:text-[HighlightText]',
		'forced-colors:aria-expanded:bg-[Highlight] forced-colors:aria-expanded:text-[HighlightText] forced-colors:aria-disabled:text-[GrayText] forced-colors:aria-disabled:opacity-100',
		'data-hidden:hidden'
	];
	// The big buttons over the picture are the same tabs, just larger.
	const centerButton = 'm-0! -outline-offset-6!';
	const centerSeek = [
		centerButton,
		'hidden size-10! pointer-fine:grid media-max-360:hidden! group-not-data-started/controls:hidden!'
	];
	const icon = 'col-start-1 row-start-1 size-4.5';
	// The panel an expanded button opens: page-colored with a silver frame, like a tab panel.
	const panel =
		'border border-solid border-silver bg-white text-black dark:border-gray dark:bg-gainsboro';
	const popup = [
		'm-0 overflow-visible text-inherit',
		'media-transitioning:opacity-0 media-transitioning:blur-media-hidden-popup media-transitioning:scale-media-hidden-popup',
		'data-starting-style:transform-[translate(var(--media-popup-translate-x-distance,0),var(--media-popup-translate-y-distance,0))]',
		'data-ending-style:transform-none',
		'data-[side=top]:origin-bottom data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left',
		'data-[side=top]:[--media-popup-translate-y-distance:var(--media-popup-translate-distance)]',
		'data-[side=bottom]:[--media-popup-translate-y-distance:calc(var(--media-popup-translate-distance)*-1)]',
		'data-[side=left]:[--media-popup-translate-x-distance:var(--media-popup-translate-distance)]',
		'data-[side=right]:[--media-popup-translate-x-distance:calc(var(--media-popup-translate-distance)*-1)]',
		'before:pointer-events-auto before:absolute',
		'data-[side=top]:before:inset-x-0 data-[side=top]:before:top-full',
		'data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:bottom-full',
		'data-[side=left]:before:inset-y-0 data-[side=left]:before:left-full',
		'data-[side=right]:before:inset-y-0 data-[side=right]:before:right-full',
		'data-[side=top]:before:h-(--media-popup-side-offset) data-[side=bottom]:before:h-(--media-popup-side-offset)',
		'data-[side=left]:before:w-(--media-popup-side-offset) data-[side=right]:before:w-(--media-popup-side-offset)',
		'media-high-contrast:outline forced-colors:outline'
	];
	// Classic Windows tooltips: #ffffe1 with a 1px black border, whatever the page theme.
	const tooltipBox =
		'rounded-none border border-solid border-black bg-[#ffffe1] px-1 py-px font-sans text-media-sm leading-tight text-black shadow-none';
	const tooltipPopup = [
		popup,
		tooltipBox,
		'pointer-events-none z-20 whitespace-nowrap',
		'[--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:calc(var(--media-spacing)*9)]',
		'data-open:flex data-open:items-center data-open:gap-1'
	];
	const screenTooltipPopup = [
		tooltipPopup,
		'[--media-tooltip-side-offset:calc(var(--media-spacing)*2)]!'
	];
	const tooltipShortcut =
		'min-w-[1.5em] border border-solid border-gray bg-white px-0.5 text-center font-mono text-media-xs leading-tight empty:hidden';
	const indicator = [
		'pointer-events-none flex items-center gap-2 rounded-none px-2 py-0.5 font-mono',
		panel,
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	// Menu rows are a vertical tab list: a highlighted row turns into a gainsboro tab with a silver edge.
	const menuRow = [
		'flex min-h-7 w-full shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-none px-2 py-0 text-start',
		'border border-solid border-transparent',
		'data-highlighted:border-silver data-highlighted:bg-gainsboro dark:data-highlighted:border-gray dark:data-highlighted:bg-silver',
		'outline-none -outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue',
		'forced-colors:data-highlighted:highlight-media'
	];
	const menuTrigger = [
		menuRow,
		'data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden'
	];
	// The flourish: panels move exactly like Tabs.svelte panels: a 25% nudge plus a fade, while the
	// popup's width and height ease to the incoming panel's size.
	const menuContent = [
		'absolute inset-x-0 top-0 max-h-full overflow-auto overscroll-none outline-hidden',
		'flex flex-col p-1',
		'transform-gpu transition-[transform,opacity] duration-300 ease-out motion-reduce:duration-0',
		'not-data-submenu:data-child-open:transform-[translateX(-25%)] not-data-submenu:data-child-open:opacity-0',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(25%)]',
		'data-submenu:z-10',
		'data-submenu:media-transitioning:transform-[translateX(25%)] data-submenu:media-transitioning:opacity-0',
		'data-submenu:media-transitioning:rtl:transform-[translateX(-25%)] data-submenu:media-transitioning:pointer-events-none'
	];
	const radioItem = [menuRow, 'group/menu-radio justify-between gap-4 data-custom:italic'];
	const menuHint = 'ms-auto inline-flex min-w-0 items-center gap-1 ps-3 font-mono text-gray';
	const menuBadge =
		'border border-solid border-silver bg-gainsboro px-1 font-mono text-media-xs leading-tight dark:border-gray dark:bg-silver';
	const menuIcon = 'size-4 shrink-0';

	const submenus = [
		{ key: 'quality', icon: 'switches', group: 'media-quality-radio-group' },
		{ key: 'audio', icon: 'speech', group: 'media-audio-track-radio-group' },
		{ key: 'speed', icon: 'speed', group: 'media-playback-rate-radio-group' },
		{ key: 'captions', icon: 'captions-off', group: 'media-captions-radio-group' }
	] as const;
	const menuLabels = { quality: 'Quality', audio: 'Audio', speed: 'Speed', captions: 'Captions' };

	const hotkeys: { keys: string; action: string; value?: string }[] = [
		{ keys: 'Space', action: 'togglePaused' },
		{ keys: 'k', action: 'togglePaused' },
		{ keys: 'm', action: 'toggleMuted' },
		{ keys: 'ArrowRight', action: 'seekStep' },
		{ keys: 'ArrowLeft', action: 'seekStep' },
		{ keys: 'l', action: 'seekStep' },
		{ keys: 'j', action: 'seekStep' },
		{ keys: 'ArrowUp', action: 'volumeStep' },
		{ keys: 'ArrowDown', action: 'volumeStep' },
		{ keys: '0-9', action: 'seekToPercent' },
		{ keys: 'Home', action: 'seekToPercent', value: '0' },
		{ keys: 'End', action: 'seekToPercent', value: '100' },
		{ keys: '>', action: 'speedUp' },
		{ keys: '<', action: 'speedDown' },
		{ keys: 'f', action: 'toggleFullscreen' },
		{ keys: 'c', action: 'toggleSubtitles' },
		{ keys: 'i', action: 'togglePictureInPicture' }
	];
</script>

{#snippet tooltip(
	trigger: string,
	opts: { class?: ClassValue; disabled?: boolean; delay?: number; sticky?: boolean } = {}
)}
	<media-tooltip
		trigger={id(trigger)}
		side="top"
		disabled={opts.disabled}
		delay={opts.delay}
		sticky={opts.sticky}
		class={opts.class ?? tooltipPopup}
	>
		<media-tooltip-label></media-tooltip-label>
		<media-tooltip-shortcut class={tooltipShortcut}></media-tooltip-shortcut>
	</media-tooltip>
{/snippet}

{#snippet playIcons(iconClass?: ClassValue)}
	<media-icon
		family="scaffold"
		name="restart"
		class={[icon, 'hidden group-data-ended/play:block', iconClass]}
	></media-icon>
	<media-icon
		family="scaffold"
		name="play"
		class={[
			icon,
			'hidden',
			'group-not-data-ended/play:group-data-paused/play:block',
			'group-not-data-ended/play:group-not-data-started/play:block',
			iconClass
		]}
	></media-icon>
	<media-icon
		family="scaffold"
		name="pause"
		class={[
			icon,
			'hidden',
			'group-data-started/play:group-not-data-paused/play:group-not-data-ended/play:block',
			iconClass
		]}
	></media-icon>
{/snippet}

{#snippet seekContent(seconds: number)}
	<div class="relative grid">
		<media-icon
			family="scaffold"
			name="seek"
			class={[icon, seconds < 0 && 'transform-[scaleX(-1)]']}
		></media-icon>
		<span
			class={[
				'absolute bottom-[calc(var(--media-spacing)*-0.75)] text-[calc(var(--media-spacing)*2.25)] tabular-nums',
				seconds < 0 ? '-left-px' : '-right-px'
			]}
		>
			{Math.abs(seconds)}
		</span>
	</div>
{/snippet}

{#snippet chevron(back = false)}
	<media-icon
		family="scaffold"
		name="chevron"
		class={back
			? 'size-4 shrink-0 transform-[rotate(180deg)] rtl:transform-none'
			: 'size-4 shrink-0 text-black rtl:transform-[scaleX(-1)]'}
	></media-icon>
{/snippet}

<media-container
	class={[
		'media-skin',
		'rounded-media-player text-media @container/media-root relative block h-full w-full overflow-hidden font-sans text-white [--spacing:var(--media-spacing)]',
		'[--media-accent:var(--color-blue)] [--media-ring:var(--color-blue)]',
		'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue',
		'bg-black',
		className
	]}
	{style}
	data-theme="scaffold"
	data-preset="video"
>
	{@render children?.()}

	<!-- poster -->
	<media-poster class="absolute inset-0 size-full not-data-visible:hidden">
		<img alt="" decoding="async" class="object-media size-full" />
	</media-poster>

	<!-- error dialog -->
	<media-error-dialog>
		<media-dialog-backdrop
			class="absolute inset-0 z-40 bg-black/60 not-data-open:hidden data-[scope=document]:fixed"
		></media-dialog-backdrop>
		<media-dialog-popup
			class={[
				panel,
				'absolute top-1/2 left-1/2 z-50 grid max-h-[calc(100%-var(--media-spacing)*8)] w-[calc(100%-var(--media-spacing)*8)] max-w-80 transform-[translate(-50%,-50%)] gap-3 overflow-auto rounded-none p-4 not-data-open:hidden',
				'data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-var(--media-spacing)*8)]',
				'outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-blue',
				'forced-colors:border-[CanvasText]'
			]}
		>
			<media-dialog-title class="font-serif text-[calc(var(--media-spacing)*5)] leading-7"
			></media-dialog-title>
			<media-dialog-description class="text-[calc(var(--media-spacing)*3.5)]"
			></media-dialog-description>
			<media-dialog-close class={[button, 'h-8 w-auto justify-self-end px-4']}></media-dialog-close>
		</media-dialog-popup>
	</media-error-dialog>

	<media-controls>
		<media-controls-backdrop
			class={[
				'pointer-events-none absolute inset-0 not-data-visible:hidden',
				'not-data-started:[visibility:var(--media-controls-before-start,hidden)]'
			]}
		></media-controls-backdrop>

		<!-- buffering, while controls are hidden -->
		<media-controls-group class="group/buffering-controls contents">
			<media-buffering-indicator
				class="pointer-events-none absolute inset-0 z-40 grid place-items-center not-data-visible:hidden not-data-visible:[--media-spinner-animation:none] group-not-data-visible/buffering-controls:bg-[rgba(0,0,0,0.4)] motion-reduce:[--media-spinner-animation:none] forced-colors:bg-transparent!"
			>
				<media-icon family="scaffold" name="spinner" class="size-7"></media-icon>
			</media-buffering-indicator>
		</media-controls-group>

		<media-controls-content class="group/controls pointer-events-none absolute inset-0 z-30">
			<media-tooltip-group>
				<!-- top: title and screen controls -->
				<media-controls-group
					class={[
						'pointer-events-auto absolute inset-x-0 top-0 flex items-start justify-end gap-1 p-2 group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
						'forced-colors:bg-[Canvas]',
						'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0',
						'not-data-started:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<!-- the title hangs off the top edge like a label tab -->
					<div class="me-auto flex min-w-0 flex-1">
						<media-title
							class={[
								panel,
								'media-max-3xs:hidden pointer-events-none max-w-full min-w-0 truncate px-2 py-0.5 font-serif text-[calc(var(--media-spacing)*4)] leading-snug empty:hidden',
								'forced-colors:z-40 forced-colors:bg-transparent! forced-colors:text-[CanvasText]',
								'not-data-visible:opacity-0'
							]}
						></media-title>
					</div>

					<media-airplay-button id={id('airplay')} class={[button, 'group/airplay']}>
						<media-icon
							family="scaffold"
							name="airplay-enter"
							class={[icon, 'group-data-[airplay-state=connected]/airplay:hidden']}
						></media-icon>
						<media-icon
							family="scaffold"
							name="airplay-exit"
							class={[icon, 'hidden group-data-[airplay-state=connected]/airplay:block']}
						></media-icon>
					</media-airplay-button>
					{@render tooltip('airplay', { class: screenTooltipPopup })}

					<media-cast-button id={id('cast')} class={[button, 'group/cast']}>
						<media-icon
							family="scaffold"
							name="cast-enter"
							class={[icon, 'group-data-[cast-state=connected]/cast:hidden']}
						></media-icon>
						<media-icon
							family="scaffold"
							name="cast-exit"
							class={[icon, 'hidden group-data-[cast-state=connected]/cast:block']}
						></media-icon>
					</media-cast-button>
					{@render tooltip('cast', { class: screenTooltipPopup })}

					<media-pip-button id={id('pip')} class={[button, 'group/pip']}>
						<media-icon
							family="scaffold"
							name="pip-enter"
							class={[icon, 'group-data-pip/pip:hidden']}
						></media-icon>
						<media-icon
							family="scaffold"
							name="pip-exit"
							class={[icon, 'hidden group-data-pip/pip:block']}
						></media-icon>
					</media-pip-button>
					{@render tooltip('pip', { class: screenTooltipPopup })}

					<media-fullscreen-button id={id('fullscreen')} class={[button, 'group/fullscreen']}>
						<media-icon
							family="scaffold"
							name="fullscreen-enter"
							class={[icon, 'hidden group-not-data-fullscreen/fullscreen:block']}
						></media-icon>
						<media-icon
							family="scaffold"
							name="fullscreen-exit"
							class={[icon, 'hidden group-data-fullscreen/fullscreen:block']}
						></media-icon>
					</media-fullscreen-button>
					{@render tooltip('fullscreen', { class: screenTooltipPopup })}
				</media-controls-group>

				<!-- center: seek and play -->
				<media-buffering-indicator class="group/center-buffering contents">
					<media-controls-group
						class={[
							'pointer-events-auto absolute top-1/2 left-1/2 flex transform-[translate(-50%,-50%)] items-center gap-2 group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
							'forced-colors:bg-transparent!',
							'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0 group-data-visible/center-buffering:hidden!'
						]}
					>
						<media-seek-button seconds={-10} id={id('center-back')} class={[button, centerSeek]}>
							{@render seekContent(-10)}
						</media-seek-button>
						{@render tooltip('center-back', { disabled: true })}

						<media-play-button
							id={id('center-play')}
							class={[button, centerButton, 'group/play media-max-360:size-11! size-14!']}
						>
							{@render playIcons('size-6! media-max-360:size-5!')}
						</media-play-button>
						{@render tooltip('center-play', { disabled: true })}

						<media-seek-button seconds={10} id={id('center-forward')} class={[button, centerSeek]}>
							{@render seekContent(10)}
						</media-seek-button>
						{@render tooltip('center-forward', { disabled: true })}
					</media-controls-group>
				</media-buffering-indicator>

				<!-- bottom: a page-colored strip framed in silver, like the panel under a row of tabs -->
				<div
					class={[
						'pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col gap-1.5 px-2 pt-1.5 pb-2 group-not-data-visible/controls:pointer-events-none',
						'border border-solid border-silver bg-white text-black dark:border-gray dark:bg-gainsboro',
						'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]',
						'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<div class="w-full">
						<media-time-slider
							thumb-alignment="edge"
							class={[
								'group/slider relative flex h-4 min-w-12 flex-1 cursor-pointer items-center',
								'data-disabled:cursor-not-allowed data-disabled:opacity-40 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
							]}
						>
							<media-time-slider-chapters class="relative flex size-full items-center">
								<template>
									<div
										class={[
											'clip-media-chapter-x absolute inset-0 flex items-center',
											'[--media-chapter-inset-end:0.5] [--media-chapter-inset-start:0.5]',
											'first-of-type:[--media-chapter-inset-start:0] last-of-type:[--media-chapter-inset-end:0]'
										]}
									>
										<!-- a silver groove with a hard 1px edge; buffered = gainsboro, played = blue -->
										<media-slider-track
											class={[
												'absolute inset-x-0 isolate h-2 rounded-none',
												'before:clip-media-chapter-track-x before:absolute before:inset-y-0 before:rounded-none before:border before:border-solid before:border-silver before:bg-gainsboro dark:before:border-gray dark:before:bg-silver',
												'forced-colors:before:bg-[Canvas] forced-colors:before:opacity-100! forced-colors:before:forced-color-adjust-none',
												'forced-colors:before:border-[CanvasText]'
											]}
										>
											<media-slider-buffer
												class={[
													'clip-media-x-[--media-slider-buffer] absolute inset-y-px rounded-none bg-silver dark:bg-darkgray',
													'forced-colors:opacity-100! forced-colors:forced-color-adjust-none',
													'forced-colors:bg-[repeating-linear-gradient(135deg,CanvasText_0px,CanvasText_1px,Canvas_1px,Canvas_3px)]'
												]}
											></media-slider-buffer>
											<media-slider-fill
												class={[
													'clip-media-x-[--media-slider-fill] absolute inset-y-0 rounded-none bg-blue forced-colors:forced-color-adjust-none',
													'group-data-dragging/slider:clip-media-x-[--media-slider-pointer]',
													'forced-colors:bg-[Canvas] forced-colors:bg-[linear-gradient(Highlight,Highlight)]'
												]}
											></media-slider-fill>
										</media-slider-track>
									</div>
								</template>
							</media-time-slider-chapters>
							<!-- the thumb is a tiny tab button -->
							<media-slider-thumb
								class={[
									'absolute left-[var(--media-slider-fill,0%)] h-4 w-2.5 transform-[translateX(-50%)] rounded-none',
									'border border-solid border-gray bg-gainsboro dark:bg-silver',
									'group-hover/slider:bg-white group-data-dragging/slider:bg-white dark:group-hover/slider:bg-gainsboro dark:group-data-dragging/slider:bg-gainsboro',
									'group-data-dragging/slider:left-(--media-slider-pointer)',
									'outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue',
									'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none',
									'forced-colors:border-[CanvasText]'
								]}
							></media-slider-thumb>
							<media-slider-preview
								class={[
									'pointer-events-none bottom-[calc(100%+var(--media-spacing)*3)] grid max-w-39 origin-bottom justify-items-center',
									'opacity-0 group-data-disabled/slider:hidden',
									'group-data-pointing/slider:opacity-100',
									'group-data-dragging/slider:opacity-100'
								]}
							>
								<media-slider-thumbnail
									class="border-silver dark:border-gray block max-w-39 overflow-hidden rounded-none border border-b-0 border-solid bg-black"
								>
									<img alt="" aria-hidden="true" decoding="async" class="block" />
								</media-slider-thumbnail>
								<div class={[tooltipBox, 'flex max-w-full min-w-0 items-center gap-2']}>
									<media-slider-value type="pointer" class="shrink-0 font-mono tabular-nums"
									></media-slider-value>
									<media-time-slider-chapter-title class="min-w-0 truncate empty:hidden"
									></media-time-slider-chapter-title>
								</div>
							</media-slider-preview>
						</media-time-slider>
					</div>

					<media-controls-group class="flex items-center justify-between gap-1 rtl:flex-row-reverse">
						<media-controls-group class="flex min-w-0 items-center gap-1 rtl:flex-row-reverse">
							<media-play-button id={id('play')} class={[button, 'group/play']}>
								{@render playIcons()}
							</media-play-button>
							{@render tooltip('play')}

							<media-mute-button
								commandfor={id('volume')}
								id={id('mute')}
								class={[button, 'group/mute']}
							>
								<media-icon
									family="scaffold"
									name="volume-off"
									class={[icon, 'hidden group-data-muted/mute:block']}
								></media-icon>
								<media-icon
									family="scaffold"
									name="volume-high"
									class={[icon, 'hidden group-not-data-muted/mute:block']}
								></media-icon>
							</media-mute-button>
							{@render tooltip('mute', { delay: 0, disabled: true, sticky: true })}
							<!-- the volume popover is the mute button's tab panel: same width, joined at the seam -->
							<media-volume-popover
								id={id('volume')}
								open-on-hover
								delay={200}
								close-delay={100}
								side="top"
								align="center"
								class={[
									popup,
									panel,
									'z-20 box-border h-28 w-8 rounded-none px-0 py-2',
									'data-[side=top]:border-b-0',
									'shadow-none [--media-popover-side-offset:0px] [--media-popup-side-offset:var(--media-popover-side-offset)]',
									'[--media-hidden-popup-blur:0px] [--media-hidden-popup-scale:1] [--media-popup-translate-distance:0px]'
								]}
							>
								<media-volume-slider
									orientation="vertical"
									thumb-alignment="edge"
									class="group/volume relative flex size-full cursor-pointer justify-center data-disabled:cursor-not-allowed data-disabled:opacity-40"
								>
									<media-slider-track
										class={[
											'absolute bottom-0 left-1/2 h-full w-2 transform-[translateX(-50%)] overflow-hidden rounded-none forced-colors:forced-color-adjust-none',
											'border-silver bg-gainsboro dark:border-gray dark:bg-silver border border-solid',
											'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]'
										]}
									>
										<media-slider-fill
											class="bg-blue absolute bottom-0 left-0 h-[var(--media-slider-fill,0%)] w-full rounded-none forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none"
										></media-slider-fill>
									</media-slider-track>
									<media-slider-thumb
										class={[
											'absolute bottom-[var(--media-slider-fill,0%)] left-1/2 h-2.5 w-4 transform-[translate(-50%,50%)] rounded-none',
											'border-gray bg-gainsboro dark:bg-silver border border-solid',
											'group-hover/volume:bg-white dark:group-hover/volume:bg-gainsboro',
											'outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue',
											'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none',
											'forced-colors:border-[CanvasText]'
										]}
									></media-slider-thumb>
								</media-volume-slider>
							</media-volume-popover>

							<media-time-group
								class="flex h-8 shrink-0 items-center gap-1 px-1.5 font-mono leading-none tabular-nums rtl:flex-row-reverse"
							>
								<media-time
									type="current"
									toggle
									class={[
										'media-xs:hidden cursor-pointer rounded-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue',
										'data-disabled:cursor-not-allowed data-disabled:opacity-40 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
									]}
								></media-time>
								<media-time type="current" class="media-xs:inline data-unavailable:text-gray hidden"
								></media-time>
								<media-time-separator
									class="media-xs:inline text-gray data-unavailable:text-gray hidden"
								></media-time-separator>
								<media-time
									type="duration"
									class="media-xs:inline data-unavailable:text-gray hidden"
								></media-time>
							</media-time-group>
						</media-controls-group>

						<media-controls-group class="flex items-center gap-1 rtl:flex-row-reverse">
							<media-captions-button
								id={id('captions')}
								class={[
									button,
									'group/captions media-max-3xs:hidden',
									// an active toggle stays "pressed": white, like the selected tab
									'data-active:bg-white dark:data-active:bg-gainsboro'
								]}
							>
								<media-icon
									family="scaffold"
									name="captions-off"
									class={[icon, 'group-data-active/captions:hidden']}
								></media-icon>
								<media-icon
									family="scaffold"
									name="captions-on"
									class={[icon, 'hidden group-data-active/captions:block']}
								></media-icon>
							</media-captions-button>
							{@render tooltip('captions')}

							<button
								type="button"
								commandfor={id('menu')}
								id={id('settings')}
								class={[button, 'media-max-3xs:hidden']}
							>
								<media-icon family="scaffold" name="gear" class={icon}></media-icon>
								<media-text token="menu.settings" class="sr-only">Settings</media-text>
							</button>
							<media-tooltip trigger={id('settings')} side="top" class={tooltipPopup}>
								<media-text token="menu.settings">Settings</media-text>
							</media-tooltip>

							<!--
								The settings menu is the gear button's tab panel. It opens flush against the button
								(side offset 0, aligned to its end), the button opens its top border, and the panel's
								bottom border is drawn by ::after with a button-wide gap, so the two read as one shape.
							-->
							<media-menu
								id={id('menu')}
								side="top"
								align="end"
								class={[
									popup,
									panel,
									'z-20 m-0 box-content max-w-(--media-menu-available-width) min-w-44 overflow-hidden! rounded-none p-0',
									'shadow-none [--media-popover-side-offset:0px] [--media-popup-side-offset:var(--media-popover-side-offset)]',
									'[--media-hidden-popup-blur:0px] [--media-hidden-popup-scale:1] [--media-popup-translate-distance:0px] [--media-popover-boundary-offset:0px]',
									'max-h-[min(var(--media-menu-available-height,--spacing(56)),--spacing(56))] overscroll-none',
									'h-(--media-menu-height) w-(--media-menu-width)',
									'transition-[opacity,width,height] duration-300 ease-out motion-reduce:duration-0',
									'data-[side=top]:border-b-0',
									'after:pointer-events-none after:absolute after:start-0 after:bottom-0 after:z-20 after:hidden after:h-px after:bg-silver dark:after:bg-gray',
									'after:end-[calc(--spacing(8)-2px)] data-[side=top]:after:block',
									'forced-colors:after:bg-[CanvasText]'
								]}
							>
								<media-menu-content class={menuContent}>
									{#each submenus as submenu (submenu.key)}
										{@const label = menuLabels[submenu.key]}
										{@const contentId = id(`menu-${submenu.key}`)}
										<media-menu-item commandfor={contentId} class={menuTrigger}>
											<media-icon family="scaffold" name={submenu.icon} class={menuIcon}
											></media-icon>
											<media-text token="menu.{submenu.key}">{label}</media-text>
											<span class={menuHint}>
												<span data-part="value" class="max-w-24 truncate"></span>
												{@render chevron()}
											</span>
										</media-menu-item>
										<media-menu-content id={contentId} class={menuContent}>
											<!-- the back row is the submenu's heading, ruled off like a tab strip -->
											<media-menu-item
												class={[
													menuRow,
													'mb-1 font-bold',
													'not-data-highlighted:border-b-silver dark:not-data-highlighted:border-b-gray'
												]}
											>
												{@render chevron(true)}
												<media-text token="menu.{submenu.key}">{label}</media-text>
											</media-menu-item>
											<media-menu-separator class="hidden"></media-menu-separator>
											<svelte:element this={submenu.group} class="flex flex-col">
												<template>
													<media-menu-radio-item class={radioItem}>
														{#if submenu.key === 'quality'}
															<span>
																<span data-part="label"></span>
																<sup
																	data-part="tier"
																	class="text-media-xs ps-0.5 pt-px leading-none empty:hidden"
																></sup>
															</span>
														{:else}
															<span data-part="label"></span>
														{/if}
														{#if submenu.key === 'quality' || submenu.key === 'captions'}
															<span data-part="badge" class={[menuBadge, 'empty:hidden']}></span>
														{/if}
														<media-menu-item-indicator
															force-mount
															class="ms-auto -me-0.5 shrink-0 opacity-0 group-aria-checked/menu-radio:opacity-100"
														>
															<media-icon family="scaffold" name="check" class={menuIcon}
															></media-icon>
														</media-menu-item-indicator>
													</media-menu-radio-item>
												</template>
											</svelte:element>
										</media-menu-content>
									{/each}
								</media-menu-content>
							</media-menu>
						</media-controls-group>
					</media-controls-group>
				</div>
			</media-tooltip-group>
		</media-controls-content>
	</media-controls>

	<!-- behaviors -->
	{#each hotkeys as hotkey (hotkey.keys)}
		<media-hotkey keys={hotkey.keys} action={hotkey.action} value={hotkey.value}></media-hotkey>
	{/each}
	<media-gesture type="tap" action="togglePaused" pointer="mouse" region="center"></media-gesture>
	<media-gesture type="tap" action="toggleControls" pointer="touch"></media-gesture>
	<media-gesture type="doubletap" action="seekStep" region="left"></media-gesture>
	<media-gesture type="doubletap" action="toggleFullscreen" region="center"></media-gesture>
	<media-gesture type="doubletap" action="seekStep" region="right"></media-gesture>

	<media-status-announcer
		class="absolute size-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)]"
	></media-status-announcer>

	<!-- transient feedback; hidden from AT because the status announcer speaks the same events -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 z-20 grid grid-cols-3 items-center justify-items-center forced-colors:z-40"
	>
		<media-volume-indicator
			class={[indicator, 'group/volume-status col-start-2 row-start-1 mt-3.5 self-start']}
		>
			<media-volume-indicator-fill class="flex items-center gap-2 rtl:flex-row-reverse">
				<media-icon
					family="scaffold"
					name="volume-high"
					class="hidden size-4.5 shrink-0 group-data-[level=high]/volume-status:block"
				></media-icon>
				<media-icon
					family="scaffold"
					name="volume-low"
					class="hidden size-4.5 shrink-0 group-data-[level=low]/volume-status:block"
				></media-icon>
				<media-icon
					family="scaffold"
					name="volume-off"
					class="hidden size-4.5 shrink-0 group-data-[level=off]/volume-status:block"
				></media-icon>
				<media-volume-indicator-value class="tabular-nums"></media-volume-indicator-value>
			</media-volume-indicator-fill>
		</media-volume-indicator>

		<media-status-indicator
			actions="toggleSubtitles,toggleFullscreen,togglePictureInPicture"
			class={[indicator, 'group/input-status col-start-2 row-start-1 mt-3 self-start']}
		>
			{#each [['captions-on', 'captions-on'], ['captions-off', 'captions-off'], ['fullscreen-enter', 'fullscreen'], ['fullscreen-exit', 'exit-fullscreen'], ['pip-enter', 'pip'], ['pip-exit', 'exit-pip']] as [name, status] (name)}
				<media-icon
					family="scaffold"
					{name}
					class={[
						'hidden size-4.5 shrink-0',
						status === 'captions-on' && 'group-data-[status=captions-on]/input-status:block',
						status === 'captions-off' && 'group-data-[status=captions-off]/input-status:block',
						status === 'fullscreen' && 'group-data-[status=fullscreen]/input-status:block',
						status === 'exit-fullscreen' &&
							'group-data-[status=exit-fullscreen]/input-status:block',
						status === 'pip' && 'group-data-[status=pip]/input-status:block',
						status === 'exit-pip' && 'group-data-[status=exit-pip]/input-status:block'
					]}
				></media-icon>
			{/each}
			<media-status-indicator-value></media-status-indicator-value>
		</media-status-indicator>

		<media-seek-indicator
			class={[
				indicator,
				'group/seek-status col-start-2 row-start-1 mx-3 flex-col justify-center gap-1!',
				'data-[direction=backward]:col-start-1 data-[direction=backward]:justify-self-start rtl:data-[direction=backward]:col-start-3 rtl:data-[direction=backward]:justify-self-end',
				'data-[direction=forward]:col-start-3 data-[direction=forward]:justify-self-end rtl:data-[direction=forward]:col-start-1 rtl:data-[direction=forward]:justify-self-start'
			]}
		>
			<media-icon
				family="scaffold"
				name="chevron"
				class="size-4.5 group-data-[direction=backward]/seek-status:transform-[scaleX(-1)]"
			></media-icon>
			<media-seek-indicator-value class="tabular-nums"></media-seek-indicator-value>
		</media-seek-indicator>
	</div>
</media-container>
