<!--
	Lab skin: table-tabs ("Halfway"). Forked from the table skin, wearing the tabs skin's surface.
	Bones from the table skin: the chrome is a flat `<table border=1 cellspacing=2>` — every control
	is a bordered cell, the timeline spans the top row, the time sits in its own Courier cell — and
	the menus are `<fieldset>`/`<legend>` with `<select size=N>` listboxes.
	Skin from $lib/components/Tabs.svelte: flat gainsboro cells with 1px silver borders (no bevels),
	white on hover/focus, blue focus rings, and an expanded control turns into the active tab whose
	panel opens right on top of it.
	Flourish: the settings menu slides between fieldsets exactly like Tabs.svelte panels (25% nudge,
	fade, eased height); feedback indicators press in like a (calmed-down) rubber stamp.
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

	// == fonts (spelled out; the site's font utilities are being fixed separately) ==
	const serif = "font-['Times_New_Roman',Times,serif]";
	const sans = 'font-[Helvetica,Arial,sans-serif]';
	const mono = "font-['Courier_New',Courier,monospace]";

	// == palette, as in Tabs.svelte ==
	// --tt-page: the page behind a table (and an active tab); --tt-face: a cell / inactive tab;
	// --tt-edge: every 1px rule; --tt-quiet: secondary text; --tt-played: the timeline ("visited").
	const palette = [
		'[--tt-page:var(--color-white)] [--tt-face:var(--color-gainsboro)] [--tt-edge:var(--color-silver)]',
		'[--tt-text:var(--color-black)] [--tt-quiet:var(--color-gray)] [--tt-played:var(--color-visited)] [--tt-mark:var(--color-blue)]',
		'dark:[--tt-page:var(--color-gainsboro)] dark:[--tt-face:var(--color-silver)] dark:[--tt-edge:var(--color-gray)]',
		'dark:[--tt-quiet:#555]',
		'[--media-accent:var(--color-blue)] [--media-ring:var(--color-blue)]'
	];

	// == table ==
	/** A `<table border=1 cellspacing=2>`, flattened: page-colored, 1px silver frame, 2px spacing. */
	const table = [
		'border border-solid border-(--tt-edge) bg-(--tt-page) p-[2px] text-(--tt-text)',
		sans,
		'text-[12px] leading-none',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	/** A plain `<td>`: 1px silver rule on the page. */
	const cell = 'border border-solid border-(--tt-edge) forced-colors:border-[CanvasText]';

	// == shared classes ==
	// Each button *is* a `<td bgcolor=gainsboro>`: the inactive tab of Tabs.svelte. Expanded, it
	// becomes the active tab: page-colored with its top rule opened into the panel above it.
	const button = [
		'relative grid h-[28px] w-[32px] shrink-0 cursor-pointer place-items-center rounded-none p-0',
		'border border-solid border-(--tt-edge) bg-(--tt-face) text-(--tt-text)',
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[3px] pointer-coarse:before:content-['']",
		'hover:bg-(--tt-page) focus-visible:bg-(--tt-page)',
		'aria-expanded:border-t-(--tt-page) aria-expanded:bg-(--tt-page)',
		'outline-none -outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue',
		'aria-disabled:cursor-not-allowed aria-disabled:text-(--tt-quiet)',
		'transition-colors duration-150 motion-reduce:transition-none',
		'forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]',
		'forced-colors:forced-color-adjust-none',
		'forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText] forced-colors:focus-visible:bg-[Highlight] forced-colors:focus-visible:text-[HighlightText]',
		'forced-colors:aria-expanded:bg-[Highlight] forced-colors:aria-expanded:text-[HighlightText] forced-colors:aria-disabled:text-[GrayText]',
		'data-hidden:hidden'
	];
	const centerSeek = [
		'hidden h-[36px]! w-auto! px-[10px]! font-bold pointer-fine:grid media-max-360:hidden! group-not-data-started/controls:hidden!'
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
	/** A tab panel: page-colored, framed in silver. Popups open flush on their trigger. */
	const panel = [
		'rounded-none border! border-solid border-(--tt-edge) bg-(--tt-page) text-(--tt-text) shadow-none',
		'[--media-popover-side-offset:0px] [--media-popup-side-offset:var(--media-popover-side-offset)]',
		'[--media-hidden-popup-blur:0px] [--media-hidden-popup-scale:1] [--media-popup-translate-distance:0px]',
		'data-[side=top]:border-b-0!',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	/** Tooltips are a one-cell table on the page, not a system tooltip. */
	const tipBox = [
		'rounded-none border border-solid border-(--tt-edge) bg-(--tt-page) px-[5px] py-[3px] text-[11px] leading-[13px] text-(--tt-text)',
		sans
	];
	const tooltipPopup = [
		popup,
		tipBox,
		'pointer-events-none z-20 whitespace-nowrap [--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:44px]',
		'transition-opacity duration-150 motion-reduce:transition-none',
		'data-open:flex data-open:items-center data-open:gap-[5px]',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	const screenTooltipPopup = [tooltipPopup, '[--media-tooltip-side-offset:6px]!'];
	/** The shortcut is a `<kbd>`: a tiny gainsboro cell in Courier. */
	const tooltipShortcut = [
		'min-w-[1.5em] border border-solid border-(--tt-edge) bg-(--tt-face) px-[3px] text-center text-[11px] empty:hidden',
		mono
	];

	// == feedback (the second flourish) ==
	// The indicators are un-hidden with `data-starting-style` for a couple of frames, then it's removed.
	// The stamp only runs once `data-starting-style` is gone, so a re-opened seek indicator re-stamps.
	// Its 100% keyframe is the resting transform below (a slight, hand-placed tilt).
	const banner = [
		table,
		'pointer-events-none flex items-center gap-[2px] rounded-none',
		'transform-[rotate(-1deg)] transition-opacity duration-200 ease-out',
		'data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-300',
		'not-data-starting-style:animate-[table-tabs-stamp_380ms_cubic-bezier(0.2,0.8,0.3,1)]',
		'motion-reduce:animate-none! motion-reduce:transform-none',
		'media-high-contrast:outline media-high-contrast:outline-current',
		'forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	/** The banner's `<td>`. */
	const bannerCell = [
		cell,
		serif,
		'flex items-center gap-2 px-[8px] py-[5px] text-[19px] leading-none font-bold',
		'media-max-md:px-[5px] media-max-md:py-[3px] media-max-md:text-[15px]'
	];

	// == menus ==
	/**
	 * Each panel is a `<fieldset>` (rule drawn by ::before, legend sat on it). Panels move like
	 * Tabs.svelte panels: a 25% nudge plus a fade while the menu eases to the incoming size.
	 */
	const menuContent = [
		'absolute inset-x-0 top-0 max-h-full overflow-auto overscroll-none outline-hidden',
		'flex flex-col gap-[7px] px-[13px] pt-[19px] pb-[13px]',
		"before:pointer-events-none before:absolute before:inset-x-[6px] before:top-[10px] before:bottom-[6px] before:content-['']",
		'before:border before:border-solid before:border-(--tt-edge) forced-colors:before:border-[CanvasText]',
		'transform-gpu transition-[transform,opacity] duration-300 ease-out motion-reduce:duration-0',
		'not-data-submenu:data-child-open:transform-[translateX(-25%)] not-data-submenu:data-child-open:opacity-0',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(25%)]',
		'data-submenu:z-10',
		'data-submenu:media-transitioning:transform-[translateX(25%)] data-submenu:media-transitioning:opacity-0',
		'data-submenu:media-transitioning:rtl:transform-[translateX(-25%)] data-submenu:media-transitioning:pointer-events-none'
	];
	const legend = [
		'pointer-events-none absolute start-[11px] top-[3px] bg-(--tt-page) px-[3px] text-[14px] leading-[14px] font-bold',
		serif
	];
	/** Root rows: `Label: [ value |▾]`, the value drawn as a closed `<select>`. */
	const menuRow =
		'group/menu-row flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-none min-h-[24px] w-full shrink-0 text-start outline-none';
	const menuTrigger = [
		menuRow,
		'data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden'
	];
	const selectBox = [
		'ms-auto flex h-[22px] min-w-[7.5rem] items-stretch border border-solid border-(--tt-quiet) bg-(--tt-page)',
		'group-data-highlighted/menu-row:outline-2 group-data-highlighted/menu-row:outline-offset-1 group-data-highlighted/menu-row:outline-blue',
		'forced-colors:border-[CanvasText] forced-colors:group-data-highlighted/menu-row:outline-[Highlight]'
	];
	const selectValue = 'flex flex-1 items-center truncate px-[5px] leading-[14px]';
	/** The flat ▾ cell at the end of a closed `<select>`. */
	const selectArrow = [
		'grid w-[18px] shrink-0 place-items-center border-s border-solid border-(--tt-edge) bg-(--tt-face) text-[9px] leading-none',
		'group-data-highlighted/menu-row:bg-(--tt-page)'
	];
	/** A `<select size=N>`: the checked option is the active tab of a vertical tab strip. */
	const listbox = [
		'flex max-h-[9.5rem] min-w-[9rem] flex-col overflow-y-auto border border-solid border-(--tt-quiet) bg-(--tt-page) p-[2px]',
		'[scrollbar-color:var(--tt-edge)_var(--tt-page)] forced-colors:border-[CanvasText]'
	];
	const radioItem = [
		'group/menu-radio flex cursor-pointer items-center justify-between gap-3 rounded-none min-h-[20px] w-full shrink-0 px-[4px] py-[2px] leading-[14px]',
		'border border-solid border-transparent',
		'aria-checked:border-(--tt-edge) aria-checked:bg-(--tt-face)',
		'outline-none data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-blue',
		'forced-colors:aria-checked:bg-[Highlight] forced-colors:aria-checked:text-[HighlightText]',
		'data-custom:italic'
	];
	const menuBadge = [
		'border border-solid border-(--tt-edge) bg-(--tt-page) px-[3px] text-[10px] leading-[12px]',
		mono
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
		'media-skin table-tabs-skin',
		palette,
		'rounded-media-player text-media text-media-foreground @container/media-root relative block h-full w-full overflow-hidden [--spacing:var(--media-spacing)]',
		sans,
		'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:-outline-offset-2',
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

	<!-- error dialog: a page-colored box, heading ruled off with an <hr> -->
	<media-error-dialog>
		<media-dialog-backdrop
			class="absolute inset-0 z-40 bg-black/60 not-data-open:hidden data-[scope=document]:fixed"
		></media-dialog-backdrop>
		<media-dialog-popup
			class={[
				table,
				'absolute top-1/2 left-1/2 z-50 grid max-h-[calc(100%-32px)] w-[calc(100%-32px)] max-w-80 transform-[translate(-50%,-50%)] gap-[10px] overflow-auto p-[14px] not-data-open:hidden',
				'data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-32px)]',
				'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:-outline-offset-4'
			]}
		>
			<media-dialog-title
				class={[
					serif,
					'border-b border-solid border-(--tt-edge) pb-[8px] text-[20px] leading-[24px] font-bold'
				]}
			></media-dialog-title>
			<media-dialog-description class={[serif, 'text-[15px] leading-[19px]']}
			></media-dialog-description>
			<media-dialog-close class={[button, 'w-auto! justify-self-end px-[14px]!']}
			></media-dialog-close>
		</media-dialog-popup>
	</media-error-dialog>

	<media-controls>
		<!-- buffering, while controls are hidden -->
		<media-controls-group class="group/buffering-controls contents">
			<media-buffering-indicator
				class="pointer-events-none absolute inset-0 z-40 grid place-items-center not-data-visible:hidden not-data-visible:[--media-spinner-animation:none] motion-reduce:[--media-spinner-animation:none]"
			>
				<span class={table}>
					<span
						class={[cell, serif, 'flex items-center gap-2 px-[8px] py-[5px] text-[15px] italic']}
					>
						<media-icon family="scaffold" name="spinner" class="size-[16px]"></media-icon>
						Loading&hellip;
					</span>
				</span>
			</media-buffering-indicator>
		</media-controls-group>

		<media-controls-content class="group/controls pointer-events-none absolute inset-0 z-30">
			<media-tooltip-group>
				<!-- top: two small tables — the title in a one-cell table, the screen controls in another -->
				<media-controls-group
					class={[
						'absolute inset-x-[8px] top-[8px] flex items-start justify-between gap-[8px] rtl:flex-row-reverse',
						'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0',
						'not-data-started:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<div class="media-max-3xs:invisible flex min-w-0">
						<div class={[table, 'pointer-events-none flex min-w-0']}>
							<media-title
								class={[
									cell,
									serif,
									'min-w-0 truncate px-[7px] py-[4px] text-[15px] leading-[18px] font-bold not-data-visible:opacity-0 empty:hidden',
									'forced-colors:text-[CanvasText]'
								]}
							></media-title>
						</div>
					</div>

					<div
						class={[
							table,
							'pointer-events-auto flex shrink-0 gap-[2px] group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse'
						]}
					>
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
					</div>
				</media-controls-group>

				<!-- center: a three-cell table — [◂◂ 10] [ ▷ Play ] [10 ▸▸] -->
				<media-buffering-indicator class="group/center-buffering contents">
					<media-controls-group
						class={[
							table,
							'pointer-events-auto absolute top-1/2 left-1/2 flex transform-[translate(-50%,-50%)] items-stretch gap-[2px] group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
							'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 group-data-visible/center-buffering:hidden! motion-reduce:duration-0'
						]}
					>
						<media-seek-button seconds={-10} id={id('center-back')} class={[button, centerSeek]}>
							<span class="flex items-center gap-[3px] text-[13px]">
								<span aria-hidden="true" class="text-[9px]">&#9664;&#9664;</span>10
							</span>
						</media-seek-button>
						{@render tooltip('center-back', { disabled: true })}

						<media-play-button
							id={id('center-play')}
							class={[
								button,
								'group/play media-max-360:h-[34px]! media-max-360:px-[10px]! h-[44px]! w-auto! px-[18px]!'
							]}
						>
							<span
								class="media-max-360:text-[14px] flex items-center gap-[8px] text-[18px] font-bold"
							>
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

						<media-seek-button seconds={10} id={id('center-forward')} class={[button, centerSeek]}>
							<span class="flex items-center gap-[3px] text-[13px]">
								10<span aria-hidden="true" class="text-[9px]">&#9654;&#9654;</span>
							</span>
						</media-seek-button>
						{@render tooltip('center-forward', { disabled: true })}
					</media-controls-group>
				</media-buffering-indicator>

				<!-- bottom: <table border=1 cellspacing=2> -->
				<div
					class={[
						table,
						'pointer-events-auto absolute inset-x-[8px] bottom-[8px] flex flex-col gap-[2px] group-not-data-visible/controls:pointer-events-none',
						'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<!-- <tr><td colspan=5> the timeline -->
					<div class={[cell, 'flex items-center px-[7px] py-[4px]']}>
						<media-time-slider
							thumb-alignment="edge"
							class={[
								'group/slider relative flex h-[18px] min-w-12 flex-1 cursor-pointer items-center',
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
										<!-- a gainsboro groove; buffered = a run of silver cells; played = visited purple -->
										<media-slider-track
											class={[
												'absolute inset-x-0 isolate h-[10px] rounded-none',
												'before:clip-media-chapter-track-x before:absolute before:inset-y-0 before:rounded-none before:border before:border-solid before:border-(--tt-edge) before:bg-(--tt-face)',
												'forced-colors:before:bg-[Canvas] forced-colors:before:opacity-100! forced-colors:before:forced-color-adjust-none',
												'forced-colors:before:border-[CanvasText]'
											]}
										>
											<media-slider-buffer
												class={[
													'clip-media-x-[--media-slider-buffer] absolute inset-y-[2px] rounded-none',
													'bg-[repeating-linear-gradient(90deg,var(--tt-edge)_0_4px,transparent_4px_6px)]',
													'forced-colors:opacity-100! forced-colors:forced-color-adjust-none',
													'forced-colors:bg-[repeating-linear-gradient(135deg,CanvasText_0px,CanvasText_1px,Canvas_1px,Canvas_3px)]'
												]}
											></media-slider-buffer>
											<media-slider-fill
												class={[
													'clip-media-x-[--media-slider-fill] absolute inset-y-0 rounded-none bg-(--tt-played) forced-colors:forced-color-adjust-none',
													'group-data-dragging/slider:clip-media-x-[--media-slider-pointer]',
													'forced-colors:bg-[Canvas] forced-colors:bg-[linear-gradient(Highlight,Highlight)]'
												]}
											></media-slider-fill>
										</media-slider-track>
									</div>
								</template>
							</media-time-slider-chapters>
							<!-- the thumb is a tiny tab -->
							<media-slider-thumb
								class={[
									'absolute left-[var(--media-slider-fill,0%)] h-[18px] w-[10px] transform-[translateX(-50%)] rounded-none',
									'border border-solid border-(--tt-quiet) bg-(--tt-face)',
									'group-hover/slider:bg-(--tt-page) group-data-dragging/slider:bg-(--tt-page)',
									'group-data-dragging/slider:left-(--media-slider-pointer)',
									'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
									'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none',
									'forced-colors:border-[CanvasText]'
								]}
							></media-slider-thumb>
							<media-slider-preview
								class={[
									'pointer-events-none bottom-[calc(100%+16px)] grid max-w-39 origin-bottom justify-items-center',
									'opacity-0 group-data-disabled/slider:hidden',
									'group-data-pointing/slider:opacity-100',
									'group-data-dragging/slider:opacity-100'
								]}
							>
								<media-slider-thumbnail
									class={[table, 'block max-w-39 overflow-hidden rounded-none border-b-0']}
								>
									<img alt="" aria-hidden="true" decoding="async" class="block" />
								</media-slider-thumbnail>
								<div class={[tipBox, 'flex max-w-full min-w-0 items-center gap-2']}>
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
						<!-- the volume popover is the mute cell's tab panel: same width, joined at the seam -->
						<media-volume-popover
							id={id('volume')}
							open-on-hover
							delay={200}
							close-delay={100}
							side="top"
							align="center"
							class={[popup, panel, 'z-20 box-border h-[112px] w-[32px] px-0 py-[8px]']}
						>
							<media-volume-slider
								orientation="vertical"
								thumb-alignment="edge"
								class="group/volume relative flex size-full cursor-pointer justify-center data-disabled:cursor-not-allowed data-disabled:opacity-40"
							>
								<media-slider-track
									class={[
										'absolute bottom-0 left-1/2 h-full w-[8px] transform-[translateX(-50%)] overflow-hidden rounded-none forced-colors:forced-color-adjust-none',
										'border border-solid border-(--tt-edge) bg-(--tt-face)',
										'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]'
									]}
								>
									<media-slider-fill
										class="absolute bottom-0 left-0 h-[var(--media-slider-fill,0%)] w-full rounded-none bg-(--tt-mark) forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none"
									></media-slider-fill>
								</media-slider-track>
								<media-slider-thumb
									class={[
										'absolute bottom-[var(--media-slider-fill,0%)] left-1/2 h-[10px] w-[18px] transform-[translate(-50%,50%)] rounded-none',
										'border border-solid border-(--tt-quiet) bg-(--tt-face) group-hover/volume:bg-(--tt-page)',
										'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
										'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none',
										'forced-colors:border-[CanvasText]'
									]}
								></media-slider-thumb>
							</media-volume-slider>
						</media-volume-popover>

						<!-- the time lives in its own <td>, in Courier -->
						<div class={[cell, 'flex min-w-0 flex-1 items-center']}>
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
										'media-xs:hidden focus-visible:outline-blue cursor-pointer rounded-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
										'data-disabled:cursor-not-allowed data-disabled:opacity-40 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
									]}
								></media-time>
								<media-time
									type="current"
									class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time>
								<media-time-separator
									class="media-xs:inline hidden text-(--tt-quiet) data-unavailable:opacity-50"
								></media-time-separator>
								<media-time
									type="duration"
									class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time>
							</media-time-group>
						</div>

						<media-captions-button
							id={id('captions')}
							class={[
								button,
								'group/captions media-max-3xs:hidden',
								// an active toggle stays "selected": page-colored, like the active tab
								'data-active:bg-(--tt-page)'
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

						<!--
							The gear cell is `Settings…` wide where there's room, icon-only where there isn't. Its
							width lives in --tt-gear-w so the menu can leave exactly that gap in its bottom rule.
						-->
						<div
							class="media-max-3xs:hidden media-max-sm:[--tt-gear-w:32px] flex [--tt-gear-w:92px]"
						>
							<button
								type="button"
								commandfor={id('menu')}
								id={id('settings')}
								class={[button, 'w-(--tt-gear-w)!']}
							>
								<span class="flex items-center gap-[5px]">
									<media-icon family="scaffold" name="gear" class="size-[14px]"></media-icon>
									<span class="media-max-sm:hidden" aria-hidden="true">Settings&hellip;</span>
								</span>
								<media-text token="menu.settings" class="sr-only">Settings</media-text>
							</button>
							<media-tooltip trigger={id('settings')} side="top" class={tooltipPopup}>
								<media-text token="menu.settings">Settings</media-text>
							</media-tooltip>

							<!--
								The menu is the gear cell's tab panel: flush on the button (offset 0, aligned to its end),
								the button opens its top rule, and the menu's bottom rule is drawn by ::after with a
								button-wide gap, so the two read as one shape.
							-->
							<media-menu
								id={id('menu')}
								side="top"
								align="end"
								class={[
									popup,
									panel,
									'z-20 m-0 box-content max-w-(--media-menu-available-width) min-w-56 overflow-hidden! p-0 text-[12px]',
									'[--media-popover-boundary-offset:0px]',
									'max-h-[min(var(--media-menu-available-height,--spacing(64)),--spacing(64))] overscroll-none',
									'h-(--media-menu-height) w-(--media-menu-width)',
									'transition-[opacity,width,height] duration-300 ease-out motion-reduce:duration-0',
									"after:pointer-events-none after:absolute after:start-0 after:bottom-0 after:z-20 after:hidden after:h-px after:bg-(--tt-edge) after:content-['']",
									'after:end-[calc(var(--tt-gear-w)-2px)] data-[side=top]:after:block',
									'forced-colors:after:bg-[CanvasText]'
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
											<!-- back is a hyperlink, not an OS button -->
											<media-menu-item class={[menuRow, 'min-h-0 w-auto self-start']}>
												<span
													class={[
														serif,
														'text-link text-[14px] leading-[16px] underline underline-offset-2',
														'group-data-highlighted/menu-row:outline-blue group-data-highlighted/menu-row:outline-2 group-data-highlighted/menu-row:outline-offset-2',
														'group-active/menu-row:text-red forced-colors:text-[LinkText]'
													]}
												>
													<span aria-hidden="true">&laquo;</span>
													<media-text token="menu.settings">Settings</media-text>
												</span>
											</media-menu-item>
											<media-menu-separator class="hidden"></media-menu-separator>
											<svelte:element this={submenu.group} class={listbox}>
												<template>
													<media-menu-radio-item class={radioItem}>
														{#if submenu.key === 'quality'}
															<span>
																<span data-part="label"></span>
																<sup
																	data-part="tier"
																	class="ps-0.5 text-[9px] leading-none empty:hidden"
																></sup>
															</span>
														{:else}
															<span data-part="label"></span>
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

	<!-- transient feedback, pressed in like a stamp; hidden from AT because the status announcer speaks the same events -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 z-20 grid grid-cols-3 items-center justify-items-center forced-colors:z-40"
	>
		<media-volume-indicator
			class={[
				banner,
				'group/volume-status media-max-md:mt-[48px] col-span-full col-start-1 row-start-1 mt-[56px] self-start'
			]}
		>
			<media-volume-indicator-fill
				class={[
					'flex items-stretch gap-[2px] rtl:flex-row-reverse',
					'group-data-max/volume-status:animate-[table-tabs-shake_300ms_linear] group-data-min/volume-status:animate-[table-tabs-shake_300ms_linear] motion-reduce:animate-none!'
				]}
			>
				<span class={[bannerCell, 'w-[5.6em] justify-center px-1']}>
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
					<media-volume-indicator-value class={[mono, 'tabular-nums']}
					></media-volume-indicator-value>
				</span>
				<!-- a row of twenty little cells, filled blue up to the level -->
				<span class={[cell, 'media-max-md:w-[66px] relative flex w-[126px] items-center p-[3px]']}>
					<span class="media-max-md:h-[12px] relative block h-[16px] w-full bg-(--tt-face)">
						<span
							class="absolute inset-y-0 left-0 w-(--media-volume-fill,0%) bg-(--tt-mark) forced-colors:bg-[Highlight]"
						></span>
						<span
							class="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_4px,var(--tt-page)_4px_6px)]"
						></span>
					</span>
				</span>
			</media-volume-indicator-fill>
		</media-volume-indicator>

		<media-status-indicator
			actions="toggleSubtitles,toggleFullscreen,togglePictureInPicture"
			class={[
				banner,
				'group/input-status media-max-md:mt-[48px] col-span-full col-start-1 row-start-1 mt-[56px] self-start'
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
				'data-[direction=forward]:transform-[rotate(1deg)] data-[direction=forward]:[--table-tabs-stamp-tilt:5deg]'
			]}
		>
			<span
				class={[
					bannerCell,
					'gap-[6px] group-data-[direction=backward]/seek-status:flex-row-reverse'
				]}
			>
				<media-seek-indicator-value class={[mono, 'tabular-nums']}></media-seek-indicator-value>
				<span class="text-[11px] leading-none">
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
	 * The stamp, calmed down: pressed in from a little above the page with a slight twist, one small
	 * overshoot, then it settles on its resting tilt (the element's own transform, which the missing
	 * 100% keyframe interpolates back to).
	 */
	@keyframes -global-table-tabs-stamp {
		0% {
			opacity: 0;
			transform: scale(1.45) rotate(var(--table-tabs-stamp-tilt, -5deg));
		}
		45% {
			opacity: 1;
			transform: scale(0.96) rotate(0deg);
		}
		70% {
			transform: scale(1.02) rotate(-1.5deg);
		}
	}

	/* Volume can't go further: the banner rattles in place. */
	@keyframes -global-table-tabs-shake {
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
