<!--
	Lab skin: table-plain ("B. Table, minus Windows"). Forked from the table skin.
	Still a `<table border=1 cellspacing=2 cellpadding=4>`, but the one a *browser* drew on a white
	page: the table's own gray outset/inset border, page-colored cells, Times text, Courier data.
	Controls are plain image links filling their cells (no bevelled OS buttons), menus are a
	`<fieldset>`/`<legend>` with `<select size=N>` listboxes and a « Back link, tooltips are plain
	bordered labels. The flourish: feedback indicators still stamp in, as little bordered tables.
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

	// == fonts (spelled out: the site's font-* utilities are being fixed separately) ==
	const serif = "[font-family:Times,'Times_New_Roman',serif]";
	const mono = "[font-family:'Courier_New',Courier,monospace]";

	// == page palette ==
	// --tp-page: the page (white; gainsboro in the site's dark theme); --tp-ink: text;
	// --tp-hi & --tp-lo: the light and dark edges of the browser's gray table border;
	// --tp-hover: a hovered cell; --tp-fill: slider fill (link blue); --tp-buffer: buffered stripes.
	const palette = [
		'[--tp-page:var(--color-white)] [--tp-ink:var(--color-black)] [--tp-hi:var(--color-silver)] [--tp-lo:var(--color-gray)]',
		'[--tp-hover:var(--color-gainsboro)] [--tp-fill:var(--color-link)] [--tp-buffer:var(--color-gainsboro)]',
		'dark:[--tp-page:var(--color-gainsboro)] dark:[--tp-hi:var(--color-white)] dark:[--tp-hover:var(--color-silver)]',
		'dark:[--tp-fill:var(--color-navy)] dark:[--tp-buffer:var(--color-silver)]'
	];

	// == the browser's table border ==
	/** `<table border=1>`: outset, light top-left, dark bottom-right. */
	const outset =
		'border border-solid border-t-(--tp-hi) border-l-(--tp-hi) border-r-(--tp-lo) border-b-(--tp-lo)';
	/** `<td>` inside it: inset. */
	const inset =
		'border border-solid border-t-(--tp-lo) border-l-(--tp-lo) border-r-(--tp-hi) border-b-(--tp-hi)';

	/** The `<table>`: page-colored, cellspacing=2. */
	const table = [
		outset,
		serif,
		'bg-(--tp-page) p-[2px] text-(--tp-ink) text-[14px] leading-none',
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	/** A `<td>`: hides itself when its control is hidden. Its control fills it. */
	const cell = [inset, 'flex items-stretch has-[>[hidden]]:hidden has-[>[data-hidden]]:hidden'];

	// == controls: plain image links filling their cells ==
	const control = [
		'relative grid shrink-0 cursor-pointer place-items-center rounded-none text-(--tp-ink)',
		'hover:bg-(--tp-hover) aria-expanded:bg-(--tp-hover) active:[&>*]:translate-y-px',
		'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue',
		'aria-disabled:cursor-not-allowed aria-disabled:text-(--tp-lo)',
		'forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:forced-color-adjust-none',
		'forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText] forced-colors:focus-visible:bg-[Highlight] forced-colors:focus-visible:text-[HighlightText]',
		'forced-colors:aria-expanded:bg-[Highlight] forced-colors:aria-expanded:text-[HighlightText] forced-colors:aria-disabled:text-[GrayText]',
		'data-hidden:hidden'
	];
	const button = [
		control,
		'h-[28px] min-w-[32px] px-[7px]',
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[3px] pointer-coarse:before:content-['']"
	];
	/** The center controls are themselves `<td>`s of a small one-row table. */
	const centerCell = [control, inset, 'font-bold'];
	const centerSeek = [
		centerCell,
		'hidden h-[40px] px-[10px] text-[16px] pointer-fine:grid media-max-360:hidden! group-not-data-started/controls:hidden!'
	];
	const icon = 'col-start-1 row-start-1 size-[16px]';
	const popup = [
		'm-0 overflow-visible text-inherit',
		'media-transitioning:opacity-0',
		'data-[side=top]:origin-bottom data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left',
		'before:pointer-events-auto before:absolute',
		'data-[side=top]:before:inset-x-0 data-[side=top]:before:top-full',
		'data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:bottom-full',
		'data-[side=left]:before:inset-y-0 data-[side=left]:before:left-full',
		'data-[side=right]:before:inset-y-0 data-[side=right]:before:right-full',
		'data-[side=top]:before:h-(--media-popup-side-offset) data-[side=bottom]:before:h-(--media-popup-side-offset)',
		'data-[side=left]:before:w-(--media-popup-side-offset) data-[side=right]:before:w-(--media-popup-side-offset)',
		'media-high-contrast:outline forced-colors:outline'
	];
	/** A plain bordered label on the page color, not a system tooltip. */
	const labelBox = [
		serif,
		'rounded-none border border-solid border-(--tp-ink) bg-(--tp-page) px-[5px] py-[2px] text-[13px] leading-[15px] text-(--tp-ink)'
	];
	const tooltipPopup = [
		popup,
		labelBox,
		'pointer-events-none z-20 whitespace-nowrap',
		'[--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:40px]',
		'data-open:flex data-open:items-center data-open:gap-[5px]',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	const screenTooltipPopup = [tooltipPopup, '[--media-tooltip-side-offset:6px]!'];
	/** The shortcut, like a `<kbd>`. */
	const tooltipShortcut = [
		mono,
		'min-w-[1.4em] border border-solid border-(--tp-lo) px-[3px] text-center text-[11px] leading-[13px] empty:hidden'
	];

	// == feedback stamps (the flourish) ==
	// The indicators are un-hidden with `data-starting-style` for a couple of frames, then it's removed.
	// The stamp animation only runs once `data-starting-style` is gone, so re-opening a seek indicator
	// (which replays on every press) re-stamps it. Its 100% keyframe is the resting transform below.
	// Each is a little `<table border=2 cellspacing=2>` around one bold Times `<td>`.
	const banner = [
		serif,
		'pointer-events-none flex rounded-none bg-(--tp-page) p-[2px] text-(--tp-ink)',
		'border-[3px] border-solid border-t-(--tp-hi) border-l-(--tp-hi) border-r-(--tp-lo) border-b-(--tp-lo)',
		'transform-[rotate(-2deg)] transition-opacity duration-200 ease-out',
		'data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-300',
		'not-data-starting-style:animate-[table-plain-stamp_480ms_cubic-bezier(0.2,0.8,0.3,1)]',
		'motion-reduce:animate-none! motion-reduce:transform-none',
		'media-high-contrast:outline media-high-contrast:outline-current',
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	const bannerCell = [
		inset,
		'flex items-center gap-2 px-[10px] py-[6px] text-[22px] leading-none font-bold',
		'media-max-md:px-[6px] media-max-md:py-[4px] media-max-md:text-[16px]'
	];

	// == menus ==
	/** Each menu panel is a `<fieldset>`: a 2px groove drawn by ::before, with a legend on top. */
	const menuContent = [
		'absolute max-h-full overflow-auto overscroll-none outline-hidden',
		'[clip-path:inset(0)]',
		'flex flex-col gap-[7px] px-[15px] pt-[22px] pb-[15px] not-data-submenu:inset-x-0 not-data-submenu:top-0',
		"before:pointer-events-none before:absolute before:inset-x-[6px] before:top-[12px] before:bottom-[6px] before:content-['']",
		'before:border-2 before:[border-style:groove] before:border-(--tp-hi)',
		'not-data-submenu:data-child-open:transform-[translateX(-100%)]',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(100%)]',
		'not-data-submenu:data-child-open:[clip-path:inset(0_0_0_100%)] not-data-submenu:data-child-open:rtl:[clip-path:inset(0_100%_0_0)]',
		'data-submenu:inset-x-0 data-submenu:top-0 data-submenu:z-10',
		'transition-transform duration-200 ease-out motion-reduce:transition-none'
	];
	const legend =
		'pointer-events-none absolute start-[12px] top-[5px] bg-(--tp-page) px-[3px] text-[14px] leading-[14px] font-bold';
	const menuRow = [
		'group/menu-row flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-none min-h-[26px] w-full shrink-0 text-start',
		'outline-none'
	];
	const menuTrigger = [
		menuRow,
		'data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden'
	];
	/** Root rows: `Label: [ value |v]`, the value drawn as a closed `<select>`, flat. */
	const selectBox = [
		'ms-auto flex h-[22px] min-w-[7.5rem] items-stretch border border-solid border-(--tp-lo) bg-(--tp-page)',
		'group-hover/menu-row:border-(--tp-ink)',
		'group-data-highlighted/menu-row:outline-2 group-data-highlighted/menu-row:outline-offset-1 group-data-highlighted/menu-row:outline-blue'
	];
	const selectValue = 'flex flex-1 items-center truncate px-[5px] text-[14px]';
	const selectArrow =
		'grid w-[18px] shrink-0 place-items-center border-s border-solid border-(--tp-lo) bg-(--tp-hover) text-[8px] leading-none';
	/** A `<select size=N>`: inset box on the page color. */
	const listbox = [
		inset,
		'flex max-h-[9.5rem] min-w-[9rem] flex-col overflow-y-auto bg-(--tp-page) p-[2px] [scrollbar-color:var(--tp-hi)_var(--tp-page)]'
	];
	const radioItem = [
		'group/menu-radio flex cursor-pointer items-center gap-[4px] rounded-none min-h-[20px] w-full shrink-0 px-[4px] py-[2px] text-[14px] leading-[16px]',
		'outline-none data-highlighted:bg-(--tp-hover) data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-blue',
		'aria-checked:font-bold',
		"before:w-[0.75em] before:shrink-0 before:content-[''] aria-checked:before:content-['»'] rtl:aria-checked:before:content-['«']",
		'forced-colors:aria-checked:bg-[Highlight] forced-colors:aria-checked:text-[HighlightText]',
		'data-custom:italic'
	];
	const menuBadge = [
		mono,
		'border border-solid border-current px-[3px] text-[10px] leading-[12px] font-bold'
	];

	const submenus = [
		{ key: 'quality', group: 'media-quality-radio-group' },
		{ key: 'audio', group: 'media-audio-track-radio-group' },
		{ key: 'speed', group: 'media-playback-rate-radio-group' },
		{ key: 'captions', group: 'media-captions-radio-group' }
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

<media-container
	class={[
		'media-skin table-plain-skin',
		palette,
		serif,
		'rounded-media-player text-media text-media-foreground @container/media-root relative block h-full w-full overflow-hidden [--spacing:var(--media-spacing)]',
		'focus-visible:outline-media-ring outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
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

	<!-- error dialog: a page-colored table with a bold heading, an <hr>, and an [ OK ] -->
	<media-error-dialog>
		<media-dialog-backdrop
			class="absolute inset-0 z-40 bg-black/60 not-data-open:hidden data-[scope=document]:fixed"
		></media-dialog-backdrop>
		<media-dialog-popup
			class={[
				table,
				'absolute top-1/2 left-1/2 z-50 grid max-h-[calc(100%-32px)] w-[calc(100%-32px)] max-w-80 transform-[translate(-50%,-50%)] gap-[10px] overflow-auto px-[14px] py-[12px] not-data-open:hidden',
				'data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-32px)]',
				'focus-visible:outline-media-ring outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px]'
			]}
		>
			<media-dialog-title
				class="border-b-2 [border-bottom-style:groove] border-(--tp-hi) pb-[8px] text-[20px] leading-[22px] font-bold"
			></media-dialog-title>
			<media-dialog-description class="text-[15px] leading-[19px]"></media-dialog-description>
			<media-dialog-close
				class={[
					control,
					outset,
					'h-[26px] min-w-[75px] justify-self-end bg-(--tp-hover) px-[10px] text-[14px]'
				]}
			></media-dialog-close>
		</media-dialog-popup>
	</media-error-dialog>

	<media-controls>
		<!-- buffering, while controls are hidden -->
		<media-controls-group class="group/buffering-controls contents">
			<media-buffering-indicator
				class="pointer-events-none absolute inset-0 z-40 grid place-items-center not-data-visible:hidden not-data-visible:[--media-spinner-animation:none] motion-reduce:[--media-spinner-animation:none]"
			>
				<span class={[table, 'flex']}>
					<span class={[inset, 'flex items-center gap-2 px-[10px] py-[6px] italic']}>
						<media-icon family="scaffold" name="spinner" class="size-[16px]"></media-icon>
						Loading&hellip;
					</span>
				</span>
			</media-buffering-indicator>
		</media-controls-group>

		<media-controls-content class="group/controls pointer-events-none absolute inset-0 z-30">
			<media-tooltip-group>
				<!-- top: a one-row table — a <th> with the title, then screen controls -->
				<media-controls-group
					class={[
						table,
						'pointer-events-auto absolute inset-x-[8px] top-[8px] flex items-stretch gap-[2px] group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
						'transition-opacity duration-150 group-not-data-visible/controls:opacity-0 motion-reduce:transition-none',
						'not-data-started:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<div
						class={[
							inset,
							'media-max-3xs:hidden flex min-w-0 flex-1 items-center px-[6px] py-[4px]'
						]}
					>
						<media-title
							class="pointer-events-none min-w-0 flex-1 truncate text-[17px] leading-[20px] font-bold not-data-visible:opacity-0 forced-colors:text-[CanvasText]"
						></media-title>
					</div>

					<div class={cell}>
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
					</div>

					<div class={cell}>
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
					</div>

					<div class={cell}>
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
					</div>

					<div class={cell}>
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
					</div>
				</media-controls-group>

				<!-- center: a one-row table, [ <<10 | > Play | 10>> ], each control its own <td> -->
				<media-buffering-indicator class="group/center-buffering contents">
					<media-controls-group
						class={[
							table,
							'pointer-events-auto absolute top-1/2 left-1/2 flex transform-[translate(-50%,-50%)] items-stretch gap-[2px] group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
							'transition-opacity duration-150 group-not-data-visible/controls:opacity-0 group-data-visible/center-buffering:hidden! motion-reduce:transition-none'
						]}
					>
						<media-seek-button seconds={-10} id={id('center-back')} class={centerSeek}>
							<span class="flex items-center gap-[4px]">
								<span aria-hidden="true" class="text-[10px]">&#9664;&#9664;</span>10
							</span>
						</media-seek-button>
						{@render tooltip('center-back', { disabled: true })}

						<media-play-button
							id={id('center-play')}
							class={[
								centerCell,
								'group/play media-max-360:h-[34px] media-max-360:px-[10px] h-[48px] px-[20px]'
							]}
						>
							<span class="media-max-360:text-[16px] flex items-center gap-[8px] text-[22px]">
								<span class="grid"
									>{@render playIcons('size-[20px]! media-max-360:size-[16px]!')}</span
								>
								<span aria-hidden="true" class="grid">
									<span class="col-start-1 row-start-1 hidden group-data-ended/play:block"
										>Replay</span
									>
									<span
										class="col-start-1 row-start-1 hidden group-not-data-ended/play:group-not-data-started/play:block group-not-data-ended/play:group-data-paused/play:block"
										>Play</span
									>
									<span
										class="col-start-1 row-start-1 hidden group-data-started/play:group-not-data-paused/play:group-not-data-ended/play:block"
										>Pause</span
									>
								</span>
							</span>
						</media-play-button>
						{@render tooltip('center-play', { disabled: true })}

						<media-seek-button seconds={10} id={id('center-forward')} class={centerSeek}>
							<span class="flex items-center gap-[4px]">
								10<span aria-hidden="true" class="text-[10px]">&#9654;&#9654;</span>
							</span>
						</media-seek-button>
						{@render tooltip('center-forward', { disabled: true })}
					</media-controls-group>
				</media-buffering-indicator>

				<!-- bottom: <table border=1 cellspacing=2 cellpadding=4> -->
				<div
					class={[
						table,
						'pointer-events-auto absolute inset-x-[8px] bottom-[8px] flex flex-col gap-[2px] group-not-data-visible/controls:pointer-events-none',
						'transition-opacity duration-150 group-not-data-visible/controls:opacity-0 motion-reduce:transition-none',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<!-- <tr><td colspan=6> the timeline -->
					<div class={[cell, 'items-center px-[8px] py-[4px]']}>
						<media-time-slider
							thumb-alignment="edge"
							class={[
								'group/slider relative flex h-[20px] min-w-12 flex-1 cursor-pointer items-center',
								'data-disabled:cursor-not-allowed data-disabled:opacity-50 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
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
										<media-slider-track
											class={[
												'absolute inset-x-0 isolate h-[10px] rounded-none',
												'before:clip-media-chapter-track-x before:absolute before:inset-y-0 before:rounded-none before:bg-(--tp-page)',
												'before:border before:border-solid before:border-t-(--tp-lo) before:border-r-(--tp-hi) before:border-b-(--tp-hi) before:border-l-(--tp-lo)',
												'forced-colors:before:bg-[Canvas] forced-colors:before:opacity-100! forced-colors:before:forced-color-adjust-none',
												'forced-colors:before:border forced-colors:before:border-solid forced-colors:before:border-[CanvasText]'
											]}
										>
											<media-slider-buffer
												class={[
													'clip-media-x-[--media-slider-buffer] absolute inset-y-[2px] rounded-none',
													'bg-[repeating-linear-gradient(90deg,var(--tp-buffer)_0_3px,transparent_3px_4px)]',
													'forced-colors:opacity-100! forced-colors:forced-color-adjust-none',
													'forced-colors:bg-[repeating-linear-gradient(135deg,CanvasText_0px,CanvasText_1px,Canvas_1px,Canvas_3px)]'
												]}
											></media-slider-buffer>
											<media-slider-fill
												class={[
													'clip-media-x-[--media-slider-fill] absolute inset-y-[2px] rounded-none bg-(--tp-fill) forced-colors:forced-color-adjust-none',
													'group-data-dragging/slider:clip-media-x-[--media-slider-pointer]',
													'forced-colors:bg-[Canvas] forced-colors:bg-[linear-gradient(Highlight,Highlight)]'
												]}
											></media-slider-fill>
										</media-slider-track>
									</div>
								</template>
							</media-time-slider-chapters>
							<media-slider-thumb
								class={[
									'absolute left-[var(--media-slider-fill,0%)] h-[20px] w-[9px] transform-[translateX(-50%)] rounded-none',
									'border border-solid border-(--tp-ink) bg-(--tp-page)',
									'group-data-dragging/slider:left-(--media-slider-pointer)',
									'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
									'forced-colors:border-[CanvasText] forced-colors:bg-[ButtonFace] forced-colors:forced-color-adjust-none'
								]}
							></media-slider-thumb>
							<media-slider-preview
								class={[
									'pointer-events-none bottom-[calc(100%+18px)] grid max-w-39 origin-bottom justify-items-center',
									'opacity-0 group-data-disabled/slider:hidden',
									'group-data-pointing/slider:opacity-100',
									'group-data-dragging/slider:opacity-100'
								]}
							>
								<media-slider-thumbnail
									class="block max-w-39 overflow-hidden rounded-none border border-solid border-(--tp-ink) bg-(--tp-page) p-[2px]"
								>
									<img alt="" aria-hidden="true" decoding="async" class="block" />
								</media-slider-thumbnail>
								<div class={[labelBox, '-mt-px flex max-w-full min-w-0 items-center gap-2']}>
									<media-slider-value type="pointer" class={[mono, 'shrink-0 tabular-nums']}
									></media-slider-value>
									<media-time-slider-chapter-title class="min-w-0 truncate empty:hidden"
									></media-time-slider-chapter-title>
								</div>
							</media-slider-preview>
						</media-time-slider>
					</div>

					<!-- <tr> one control per <td> -->
					<media-controls-group class="flex items-stretch gap-[2px] rtl:flex-row-reverse">
						<div class={cell}>
							<media-play-button id={id('play')} class={[button, 'group/play']}>
								{@render playIcons()}
							</media-play-button>
							{@render tooltip('play')}
						</div>

						<div class={cell}>
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
							<media-volume-popover
								id={id('volume')}
								open-on-hover
								delay={200}
								close-delay={100}
								side="top"
								class={[
									popup,
									table,
									'z-20 h-[112px] w-[34px] px-[6px] py-[10px]',
									'[--media-popover-side-offset:40px] [--media-popup-side-offset:var(--media-popover-side-offset)]'
								]}
							>
								<media-volume-slider
									orientation="vertical"
									thumb-alignment="edge"
									class="relative flex size-full cursor-pointer justify-center data-disabled:cursor-not-allowed data-disabled:opacity-40"
								>
									<media-slider-track
										class={[
											inset,
											'absolute bottom-0 left-1/2 h-full w-[8px] transform-[translateX(-50%)] overflow-hidden rounded-none bg-(--tp-page) forced-colors:forced-color-adjust-none',
											'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]'
										]}
									>
										<media-slider-fill
											class="absolute bottom-0 left-0 h-[var(--media-slider-fill,0%)] w-full rounded-none bg-(--tp-fill) forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none"
										></media-slider-fill>
									</media-slider-track>
									<media-slider-thumb
										class={[
											'absolute bottom-[var(--media-slider-fill,0%)] left-1/2 h-[9px] w-[20px] transform-[translate(-50%,50%)] rounded-none',
											'border border-solid border-(--tp-ink) bg-(--tp-page)',
											'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
											'forced-colors:border-[CanvasText] forced-colors:bg-[ButtonFace] forced-colors:forced-color-adjust-none'
										]}
									></media-slider-thumb>
								</media-volume-slider>
							</media-volume-popover>
						</div>

						<!-- the time, in Courier -->
						<div class={[cell, 'min-w-0 flex-1 items-center']}>
							<media-time-group
								class={[
									mono,
									'flex shrink-0 items-center gap-[6px] px-[6px] text-[13px] leading-none tabular-nums rtl:flex-row-reverse'
								]}
							>
								<media-time
									type="current"
									toggle
									class={[
										'media-xs:hidden focus-visible:outline-blue cursor-pointer rounded-none outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
										'data-disabled:cursor-not-allowed data-disabled:opacity-40 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
									]}
								></media-time>
								<media-time
									type="current"
									class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time>
								<media-time-separator class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time-separator>
								<media-time
									type="duration"
									class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time>
							</media-time-group>
						</div>

						<div class={[cell, 'media-max-3xs:hidden']}>
							<media-captions-button id={id('captions')} class={[button, 'group/captions']}>
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
						</div>

						<div class={[cell, 'media-max-3xs:hidden']}>
							<button
								type="button"
								commandfor={id('menu')}
								id={id('settings')}
								class={[button, 'px-[8px]']}
							>
								<span class="flex items-center gap-[5px]">
									<media-icon family="scaffold" name="gear" class="size-[14px]"></media-icon>
									<span class="media-max-sm:hidden text-[14px]" aria-hidden="true"
										>Settings&hellip;</span
									>
								</span>
								<media-text token="menu.settings" class="sr-only">Settings</media-text>
							</button>
							<media-tooltip trigger={id('settings')} side="top" class={tooltipPopup}>
								<media-text token="menu.settings">Settings</media-text>
							</media-tooltip>

							<media-menu
								id={id('menu')}
								side="top"
								align="end"
								class={[
									popup,
									outset,
									serif,
									'z-20 m-0 max-w-(--media-menu-available-width) min-w-56 overflow-hidden! rounded-none bg-(--tp-page) p-0 text-[14px] text-(--tp-ink)',
									'[--media-popover-side-offset:40px] [--media-popup-side-offset:var(--media-popover-side-offset)]',
									'max-h-[min(var(--media-menu-available-height,--spacing(64)),--spacing(64))] overscroll-none',
									'h-(--media-menu-height) w-(--media-menu-width)',
									'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
								]}
							>
								<media-menu-content class={menuContent}>
									<span class={legend} aria-hidden="true">
										<media-text token="menu.settings">Settings</media-text>
									</span>
									{#each submenus as submenu (submenu.key)}
										{@const label = menuLabels[submenu.key]}
										{@const contentId = id(`menu-${submenu.key}`)}
										<media-menu-item commandfor={contentId} class={menuTrigger}>
											<span><media-text token="menu.{submenu.key}">{label}</media-text>:</span>
											<span class={selectBox}>
												<span data-part="value" class={selectValue}></span>
												<span class={selectArrow} aria-hidden="true">&#9660;</span>
											</span>
										</media-menu-item>
										<media-menu-content id={contentId} class={menuContent}>
											<span class={legend} aria-hidden="true">
												<media-text token="menu.{submenu.key}">{label}</media-text>
											</span>
											<!-- back is a link, blue and underlined; red while active, like Netscape's ALINK -->
											<media-menu-item class={[menuRow, 'min-h-0 w-auto self-start']}>
												<span
													class={[
														'text-link group-active/menu-row:text-red underline decoration-1 underline-offset-2',
														'group-data-highlighted/menu-row:outline-blue group-data-highlighted/menu-row:outline-2 group-data-highlighted/menu-row:outline-offset-2',
														'forced-colors:text-[LinkText]'
													]}
												>
													<span aria-hidden="true">&laquo; Back</span>
													<span class="sr-only"
														><media-text token="menu.{submenu.key}">{label}</media-text></span
													>
												</span>
											</media-menu-item>
											<media-menu-separator class="hidden"></media-menu-separator>
											<svelte:element this={submenu.group} class={listbox}>
												<template>
													<media-menu-radio-item class={radioItem}>
														{#if submenu.key === 'quality'}
															<span class="me-auto">
																<span data-part="label"></span>
																<sup
																	data-part="tier"
																	class="ps-0.5 text-[9px] leading-none empty:hidden"
																></sup>
															</span>
														{:else}
															<span data-part="label" class="me-auto"></span>
														{/if}
														{#if submenu.key === 'quality' || submenu.key === 'captions'}
															<span data-part="badge" class={[menuBadge, 'empty:hidden']}></span>
														{/if}
														<media-menu-item-indicator force-mount class="hidden"
														></media-menu-item-indicator>
													</media-menu-radio-item>
												</template>
											</svelte:element>
										</media-menu-content>
									{/each}
								</media-menu-content>
							</media-menu>
						</div>
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

	<!-- transient feedback, stamped in as little tables; hidden from AT because the status announcer speaks the same events -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 z-20 grid grid-cols-3 items-center justify-items-center forced-colors:z-40"
	>
		<media-volume-indicator
			class={[
				banner,
				'group/volume-status media-max-md:mt-[48px] col-span-full col-start-1 row-start-1 mt-[64px] self-start'
			]}
		>
			<media-volume-indicator-fill
				class={[
					'flex items-stretch gap-[2px] rtl:flex-row-reverse',
					'group-data-max/volume-status:animate-[table-plain-shake_300ms_linear] group-data-min/volume-status:animate-[table-plain-shake_300ms_linear] motion-reduce:animate-none!'
				]}
			>
				<span class={[bannerCell, 'w-[5.5em] justify-center px-1']}>
					<media-icon
						family="scaffold"
						name="volume-high"
						class="hidden size-[20px] shrink-0 group-data-[level=high]/volume-status:block"
					></media-icon>
					<media-icon
						family="scaffold"
						name="volume-low"
						class="hidden size-[20px] shrink-0 group-data-[level=low]/volume-status:block"
					></media-icon>
					<media-icon
						family="scaffold"
						name="volume-off"
						class="hidden size-[20px] shrink-0 group-data-[level=off]/volume-status:block"
					></media-icon>
					<media-volume-indicator-value class={[mono, 'text-[18px] tabular-nums']}
					></media-volume-indicator-value>
				</span>
				<!-- a row of twenty cells, filled link blue up to the level -->
				<span
					class={[
						inset,
						'media-max-md:w-[64px] relative w-[124px] p-[3px]',
						'group-data-max/volume-status:border-maroon'
					]}
				>
					<span class="relative block size-full">
						<span
							class="absolute inset-y-0 left-0 w-(--media-volume-fill,0%) bg-(--tp-fill) forced-colors:bg-[Highlight]"
						></span>
						<span
							class="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_10px,var(--tp-page)_10px_12px)]"
						></span>
					</span>
				</span>
			</media-volume-indicator-fill>
		</media-volume-indicator>

		<media-status-indicator
			actions="toggleSubtitles,toggleFullscreen,togglePictureInPicture"
			class={[
				banner,
				'group/input-status media-max-md:mt-[48px] col-span-full col-start-1 row-start-1 mt-[64px] self-start'
			]}
		>
			<span class={bannerCell}>
				{#each [['captions-on', 'captions-on'], ['captions-off', 'captions-off'], ['fullscreen-enter', 'fullscreen'], ['fullscreen-exit', 'exit-fullscreen'], ['pip-enter', 'pip'], ['pip-exit', 'exit-pip']] as [name, status] (name)}
					<media-icon
						family="scaffold"
						{name}
						class={[
							'hidden size-[20px] shrink-0',
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
			</span>
		</media-status-indicator>

		<media-seek-indicator
			class={[
				banner,
				'group/seek-status col-start-2 row-start-1 mx-6',
				'data-[direction=backward]:col-start-1 data-[direction=backward]:justify-self-start rtl:data-[direction=backward]:col-start-3 rtl:data-[direction=backward]:justify-self-end',
				'data-[direction=forward]:col-start-3 data-[direction=forward]:justify-self-end rtl:data-[direction=forward]:col-start-1 rtl:data-[direction=forward]:justify-self-start',
				'data-[direction=forward]:transform-[rotate(2deg)] data-[direction=forward]:[--table-plain-stamp-tilt:12deg]'
			]}
		>
			<span
				class={[
					bannerCell,
					'gap-[6px] group-data-[direction=backward]/seek-status:flex-row-reverse'
				]}
			>
				<media-seek-indicator-value class={[mono, 'tabular-nums']}></media-seek-indicator-value>
				<span class="text-[12px] leading-none">
					<span class="hidden group-data-[direction=forward]/seek-status:inline"
						>&#9654;&#9654;</span
					>
					<span class="hidden group-data-[direction=backward]/seek-status:inline"
						>&#9664;&#9664;</span
					>
				</span>
			</span>
		</media-seek-indicator>
	</div>
</media-container>

<style>
	/*
	 * The rubber stamp: slams down oversized and tilted, overshoots, wobbles, settles on its resting
	 * tilt (the element's own transform, which the missing 100% keyframe interpolates back to).
	 */
	@keyframes -global-table-plain-stamp {
		0% {
			opacity: 0;
			transform: scale(2.6) rotate(var(--table-plain-stamp-tilt, -12deg));
		}
		40% {
			opacity: 1;
			transform: scale(0.88) rotate(1deg);
		}
		58% {
			transform: scale(1.07) rotate(-3deg);
		}
		76% {
			transform: scale(0.97) rotate(-1deg);
		}
	}

	/* Volume can't go further: the stamp rattles in place. */
	@keyframes -global-table-plain-shake {
		0%,
		100% {
			translate: 0;
		}
		20%,
		60% {
			translate: -4px 0;
		}
		40%,
		80% {
			translate: 4px 0;
		}
	}
</style>
