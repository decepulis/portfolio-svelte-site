<!--
	Lab skin: tabs, with table bones. Forked from the tabs skin ($lib/videojs/skins/tabs).
	Still the Tabs sibling: flat gainsboro tab buttons, popups that open flush from their button like
	an active tab, and Tabs.svelte's sliding, size-easing panels. Borrowed from the table skin, in
	flat 1px web form rather than bevels: the control bar is a `<table border=1 cellspacing=0>` grid
	(timeline as a colspan row, time in its own Courier cell), the settings menu is a
	`<fieldset>`/`<legend>` whose submenus are `<select size=N>` listboxes, and feedback indicators
	drop in as small bordered table cells in bold Times.
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

	// == type ==
	// Spelled out rather than font-serif/sans/mono so the skin doesn't depend on the site's theme.
	const serif = "[font-family:Times,'Times_New_Roman',serif]";
	const sans = '[font-family:Helvetica,Arial,sans-serif]';
	const mono = "[font-family:'Courier_New',Courier,monospace]";

	// == shared classes ==
	// Buttons are the inactive tabs from $lib/components/Tabs.svelte: flat gainsboro, white on
	// hover/focus. An expanded button becomes the *active* tab: page-colored, opened up at the top so
	// it joins the panel (menu/volume popover) that opens above it.
	const buttonBase = [
		'relative grid shrink-0 cursor-pointer place-items-center rounded-none p-0',
		'bg-gainsboro text-black dark:bg-silver',
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[3px] pointer-coarse:before:content-['']",
		'hover:bg-white focus-visible:bg-white dark:hover:bg-gainsboro dark:focus-visible:bg-gainsboro',
		'aria-expanded:bg-white dark:aria-expanded:bg-gainsboro',
		'outline-none -outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue',
		'aria-disabled:cursor-not-allowed aria-disabled:text-gray disabled:cursor-not-allowed disabled:text-gray',
		'forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]',
		'forced-colors:forced-color-adjust-none',
		'forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText] forced-colors:focus-visible:bg-[Highlight] forced-colors:focus-visible:text-[HighlightText]',
		'forced-colors:aria-expanded:bg-[Highlight] forced-colors:aria-expanded:text-[HighlightText] forced-colors:aria-disabled:text-[GrayText] forced-colors:aria-disabled:opacity-100',
		'data-hidden:hidden'
	];
	/** A free-standing tab: its own silver frame, whose top edge opens when expanded. */
	const button = [
		buttonBase,
		'size-8 border border-solid border-silver dark:border-gray',
		'aria-expanded:border-t-white dark:aria-expanded:border-t-gainsboro'
	];
	/**
	 * A tab that *is* a table cell: the table's rules are its frame. When expanded, its popup's
	 * bottom row lies on the rule above it, covering it over the button's width (the open top edge).
	 */
	const cellButton = [buttonBase, 'h-8 w-10'];
	/** Width of a cell button plus the rules on either side: the width of its joined popup. */
	const cellPopupWidth = 'w-[calc(--spacing(10)+2px)]';
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
	/** Page-colored fill for a table cell or anything that must cover a rule (a legend). */
	const page = 'bg-white dark:bg-gainsboro';
	/** A 1px silver rule, as between table cells. */
	const rule = 'border-silver dark:border-gray';

	// == table ==
	// `<table border=1 cellspacing=0>`: the table's own fill shows through 1px gaps between cells,
	// so rules stay single and a hidden cell takes its rule with it. Button cells are filled by
	// their button, like a row of inactive tabs; the rest are page-colored.
	const table = 'grid gap-px border border-solid bg-silver dark:bg-gray ' + rule;
	const cell = [
		page,
		'flex items-stretch',
		'has-[>[data-hidden]]:hidden has-[>[hidden]:not(media-tooltip)]:hidden'
	];

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
	// Tooltips are a plain bordered label in page colors and Times, not a yellow system tooltip.
	const tooltipBox = [
		serif,
		'rounded-none border border-solid border-gray bg-white px-1.5 py-px text-[calc(var(--media-spacing)*3.5)] leading-snug text-black shadow-none',
		'dark:border-darkgray dark:bg-gainsboro'
	];
	const tooltipPopup = [
		popup,
		tooltipBox,
		'pointer-events-none z-20 whitespace-nowrap',
		'[--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:calc(var(--media-spacing)*10)]',
		'data-open:flex data-open:items-center data-open:gap-1.5'
	];
	const screenTooltipPopup = [
		tooltipPopup,
		'[--media-tooltip-side-offset:calc(var(--media-spacing)*2)]!'
	];
	// The shortcut is a little `<kbd>` cell in Courier.
	const tooltipShortcut = [
		mono,
		'min-w-[1.5em] border border-solid bg-gainsboro px-0.5 text-center text-media-xs leading-tight empty:hidden dark:bg-silver',
		rule
	];

	// == feedback (the second, smaller flourish) ==
	// A one-row bordered table in bold Times that drops in from above with a small overshoot.
	// Indicators are un-hidden with `data-starting-style` for a couple of frames, and the drop only
	// runs once that attribute is gone, so a seek indicator that re-opens on every press re-drops.
	const indicator = [
		'pointer-events-none flex items-stretch rounded-none p-0',
		panel,
		serif,
		'text-[calc(var(--media-spacing)*4.5)] leading-none font-bold',
		'transition-opacity duration-200 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-300',
		'not-data-starting-style:animate-[tabs-table-drop_420ms_ease-out] motion-reduce:animate-none!',
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	const indicatorCell = 'flex items-center gap-2 px-2.5 py-1.5';
	const indicatorIconBase = [
		'grid place-items-center border-solid bg-gainsboro px-2 dark:bg-silver forced-colors:border-[CanvasText]',
		rule
	];
	const indicatorIconCell = [indicatorIconBase, 'border-e'];

	// == menus ==
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
	// Each panel is a `<fieldset>`: a 1px silver frame (::before) with a bold Times `<legend>`
	// breaking its top edge.
	// The flourish: panels move exactly like Tabs.svelte panels: a 25% nudge plus a fade, while the
	// popup's width and height ease to the incoming panel's size.
	const menuContent = [
		'absolute inset-x-0 top-0 max-h-full overflow-auto overscroll-none outline-hidden',
		'flex flex-col gap-px px-2 pt-4 pb-2 data-submenu:pt-1.5',
		"data-submenu:before:hidden before:pointer-events-none before:absolute before:inset-x-1 before:top-2 before:bottom-1 before:border before:border-solid before:content-['']",
		'before:border-silver dark:before:border-gray forced-colors:before:border-[CanvasText]',
		'transform-gpu transition-[transform,opacity] duration-300 ease-out motion-reduce:duration-0',
		'not-data-submenu:data-child-open:transform-[translateX(-25%)] not-data-submenu:data-child-open:opacity-0',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(25%)]',
		'data-submenu:z-10',
		'data-submenu:media-transitioning:transform-[translateX(25%)] data-submenu:media-transitioning:opacity-0',
		'data-submenu:media-transitioning:rtl:transform-[translateX(-25%)] data-submenu:media-transitioning:pointer-events-none'
	];
	const legend = [
		page,
		serif,
		'absolute start-2.5 top-0 z-10 flex h-4 items-center gap-0.5 px-1 text-[calc(var(--media-spacing)*3.5)] leading-none font-bold whitespace-nowrap'
	];
	// A submenu is a labelled `<select size=N>`; its bold Times label "‹ Speed" is the back button,
	// and turns into a little tab when highlighted.
	const backLabel = [
		serif,
		'mb-1 flex h-6 cursor-pointer items-center gap-0.5 self-start whitespace-nowrap ps-0.5 pe-1.5 text-[calc(var(--media-spacing)*3.5)] leading-none font-bold',
		'border border-solid border-transparent',
		'data-highlighted:border-silver data-highlighted:bg-gainsboro dark:data-highlighted:border-gray dark:data-highlighted:bg-silver',
		'outline-none -outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue',
		'forced-colors:data-highlighted:highlight-media'
	];
	// A `<select size=N>`: a white box with a gray 1px border that scrolls on its own, so the menu
	// around it never has to.
	const listbox = [
		page,
		'flex min-w-32 flex-col overflow-y-auto border border-solid border-gray p-px dark:border-darkgray',
		'max-h-[calc(min(var(--media-menu-available-height,--spacing(56)),--spacing(56))-var(--spacing)*11-3px)]',
		'[scrollbar-color:var(--color-silver)_transparent] [scrollbar-width:thin]'
	];
	const radioItem = [
		menuRow,
		'group/menu-radio min-h-6 justify-between gap-4 px-1.5 aria-checked:font-bold data-custom:italic'
	];
	const menuHint = ['ms-auto inline-flex min-w-0 items-center gap-1 ps-3 text-gray', mono];
	const menuBadge = [
		mono,
		'border border-solid bg-gainsboro px-1 text-media-xs leading-tight font-normal dark:bg-silver',
		rule
	];
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
			? 'size-3.5 shrink-0 transform-[rotate(180deg)] rtl:transform-none'
			: 'size-4 shrink-0 text-black rtl:transform-[scaleX(-1)]'}
	></media-icon>
{/snippet}

<media-container
	class={[
		'media-skin',
		'rounded-media-player text-media @container/media-root relative block h-full w-full overflow-hidden text-white [--spacing:var(--media-spacing)]',
		sans,
		'[--media-accent:var(--color-blue)] [--media-ring:var(--color-blue)]',
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
				'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:-outline-offset-4',
				'forced-colors:border-[CanvasText]'
			]}
		>
			<media-dialog-title class={[serif, 'text-[calc(var(--media-spacing)*5)] leading-7 font-bold']}
			></media-dialog-title>
			<media-dialog-description class={[serif, 'text-[calc(var(--media-spacing)*4)]']}
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
								serif,
								'media-max-3xs:hidden pointer-events-none max-w-full min-w-0 truncate px-2 py-0.5 text-[calc(var(--media-spacing)*4)] leading-snug empty:hidden',
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
							'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 group-data-visible/center-buffering:hidden! motion-reduce:duration-0'
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

				<!-- bottom: <table border=1 cellspacing=0 cellpadding=4>, edge to edge like the panel under a row of tabs -->
				<div
					class={[
						table,
						'pointer-events-auto absolute inset-x-0 bottom-0 group-not-data-visible/controls:pointer-events-none',
						'text-black forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]',
						'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<!-- <tr><td colspan=5> the timeline -->
					<div class={[cell, 'px-2 py-1.5']}>
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
												'before:clip-media-chapter-track-x before:border-silver before:bg-gainsboro dark:before:border-gray dark:before:bg-silver before:absolute before:inset-y-0 before:rounded-none before:border before:border-solid',
												'forced-colors:before:bg-[Canvas] forced-colors:before:opacity-100! forced-colors:before:forced-color-adjust-none',
												'forced-colors:before:border-[CanvasText]'
											]}
										>
											<media-slider-buffer
												class={[
													'clip-media-x-[--media-slider-buffer] bg-silver dark:bg-darkgray absolute inset-y-px rounded-none',
													'forced-colors:opacity-100! forced-colors:forced-color-adjust-none',
													'forced-colors:bg-[repeating-linear-gradient(135deg,CanvasText_0px,CanvasText_1px,Canvas_1px,Canvas_3px)]'
												]}
											></media-slider-buffer>
											<media-slider-fill
												class={[
													'clip-media-x-[--media-slider-fill] bg-blue absolute inset-y-0 rounded-none forced-colors:forced-color-adjust-none',
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
									'border-gray bg-gainsboro dark:bg-silver border border-solid',
									'dark:group-hover/slider:bg-gainsboro dark:group-data-dragging/slider:bg-gainsboro group-hover/slider:bg-white group-data-dragging/slider:bg-white',
									'group-data-dragging/slider:left-(--media-slider-pointer)',
									'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
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
									class="border-gray dark:border-darkgray block max-w-39 overflow-hidden rounded-none border border-b-0 border-solid bg-black"
								>
									<img alt="" aria-hidden="true" decoding="async" class="block" />
								</media-slider-thumbnail>
								<div class={[tooltipBox, 'flex max-w-full min-w-0 items-center gap-2']}>
									<media-slider-value type="pointer" class={['shrink-0 tabular-nums', mono]}
									></media-slider-value>
									<media-time-slider-chapter-title class="min-w-0 truncate empty:hidden"
									></media-time-slider-chapter-title>
								</div>
							</media-slider-preview>
						</media-time-slider>
					</div>

					<!-- <tr> one control per <td> -->
					<media-controls-group class="flex gap-px rtl:flex-row-reverse">
						<div class={cell}>
							<media-play-button id={id('play')} class={[cellButton, 'group/play']}>
								{@render playIcons()}
							</media-play-button>
							{@render tooltip('play')}
						</div>

						<div class={cell}>
							<media-mute-button
								commandfor={id('volume')}
								id={id('mute')}
								class={[cellButton, 'group/mute']}
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
							<!-- the volume popover is the mute button's tab panel: as wide as its cell, its white covering the rule above it -->
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
									cellPopupWidth,
									'z-20 box-border h-28 rounded-none px-0 py-2',
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
											'dark:group-hover/volume:bg-gainsboro group-hover/volume:bg-white',
											'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
											'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none',
											'forced-colors:border-[CanvasText]'
										]}
									></media-slider-thumb>
								</media-volume-slider>
							</media-volume-popover>
						</div>

						<!-- the time gets its own wide <td>, in Courier -->
						<div class={[cell, 'min-w-0 flex-1 px-2.5']}>
							<media-time-group
								class={[
									'flex h-8 shrink-0 items-center gap-1.5 leading-none tabular-nums rtl:flex-row-reverse',
									mono
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
						</div>

						<div class={[cell, 'media-max-3xs:hidden']}>
							<media-captions-button
								id={id('captions')}
								class={[
									cellButton,
									'group/captions',
									// an active toggle stays "pressed": white, like the selected tab
									'dark:data-active:bg-gainsboro data-active:bg-white'
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
						</div>

						<div class={[cell, 'media-max-3xs:hidden']}>
							<button type="button" commandfor={id('menu')} id={id('settings')} class={cellButton}>
								<media-icon family="scaffold" name="gear" class={icon}></media-icon>
								<media-text token="menu.settings" class="sr-only">Settings</media-text>
							</button>
							<media-tooltip trigger={id('settings')} side="top" class={tooltipPopup}>
								<media-text token="menu.settings">Settings</media-text>
							</media-tooltip>

							<!--
								The settings menu is the gear cell's tab panel. It opens flush above the cell and 1px
								past its end, so its bottom and end edges lie on the table's rules; the bottom edge is drawn by
								::after with a button-wide gap, and the panel's white covers the rule over the gear, so
								button and panel read as one shape.
								The seam assumes the menu's end edge stays on the button's end edge, so the menu is
								never allowed to be wider than the room to the button's start side: Video.js would
								otherwise clamp it back inside the player and slide the seam off the button. Its end
								edge already sits on the player's end edge, and its own 1px borders lie outside its
								content box: 2px in all.
							-->
							<media-menu
								id={id('menu')}
								side="top"
								align="end"
								class={[
									popup,
									panel,
									'z-20 m-0 box-content overflow-hidden! rounded-none p-0',
									'max-w-[calc(var(--media-menu-available-width,100cqw)-2px)] min-w-[min(--spacing(44),calc(var(--media-menu-available-width,100cqw)-2px))]',
									'shadow-none [--media-popover-side-offset:0px] [--media-popup-side-offset:var(--media-popover-side-offset)]',
									'[--media-popover-align-offset:1px] rtl:[--media-popover-align-offset:-1px]',
									'[--media-hidden-popup-blur:0px] [--media-hidden-popup-scale:1] [--media-popover-boundary-offset:0px] [--media-popup-translate-distance:0px]',
									'max-h-[min(var(--media-menu-available-height,--spacing(56)),--spacing(56))] overscroll-none',
									'h-(--media-menu-height) w-(--media-menu-width)',
									'transition-[opacity,width,height] duration-300 ease-out motion-reduce:duration-0',
									'data-[side=top]:border-b-0',
									'after:bg-silver dark:after:bg-gray after:pointer-events-none after:absolute after:start-0 after:bottom-0 after:z-20 after:hidden after:h-px',
									'after:end-(--spacing(10)) data-[side=top]:after:block',
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
											<media-icon family="scaffold" name={submenu.icon} class={menuIcon}
											></media-icon>
											<media-text token="menu.{submenu.key}">{label}</media-text>
											<span class={menuHint}>
												<span data-part="value" class="max-w-24 truncate"></span>
												{@render chevron()}
											</span>
										</media-menu-item>
										<media-menu-content id={contentId} class={menuContent}>
											<!-- the select's label doubles as the back button -->
											<media-menu-item class={backLabel}>
												{@render chevron(true)}
												<media-text token="menu.{submenu.key}">{label}</media-text>
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

	<!-- transient feedback; hidden from AT because the status announcer speaks the same events -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 z-20 grid grid-cols-3 items-center justify-items-center forced-colors:z-40"
	>
		<media-volume-indicator
			class={[indicator, 'group/volume-status col-start-2 row-start-1 mt-3.5 self-start']}
		>
			<media-volume-indicator-fill class="flex items-stretch rtl:flex-row-reverse">
				<span class={indicatorIconCell}>
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
				</span>
				<span class={[indicatorCell, 'min-w-[3.25em] justify-end']}>
					<media-volume-indicator-value class="tabular-nums"></media-volume-indicator-value>
				</span>
			</media-volume-indicator-fill>
		</media-volume-indicator>

		<media-status-indicator
			actions="toggleSubtitles,toggleFullscreen,togglePictureInPicture"
			class={[indicator, 'group/input-status col-start-2 row-start-1 mt-3.5 self-start']}
		>
			<span class={indicatorIconCell}>
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
			</span>
			<span class={indicatorCell}>
				<media-status-indicator-value></media-status-indicator-value>
			</span>
		</media-status-indicator>

		<media-seek-indicator
			class={[
				indicator,
				'group/seek-status col-start-2 row-start-1 mx-3',
				'data-[direction=backward]:col-start-1 data-[direction=backward]:justify-self-start rtl:data-[direction=backward]:col-start-3 rtl:data-[direction=backward]:justify-self-end',
				'data-[direction=forward]:col-start-3 data-[direction=forward]:justify-self-end rtl:data-[direction=forward]:col-start-1 rtl:data-[direction=forward]:justify-self-start',
				'data-[direction=backward]:flex-row-reverse'
			]}
		>
			<span class={[indicatorCell, 'tabular-nums']}>
				<media-seek-indicator-value></media-seek-indicator-value>
			</span>
			<span
				class={[
					indicatorIconBase,
					'border-s group-data-[direction=backward]/seek-status:border-s-0 group-data-[direction=backward]/seek-status:border-e'
				]}
			>
				<media-icon
					family="scaffold"
					name="chevron"
					class="size-4.5 group-data-[direction=backward]/seek-status:transform-[scaleX(-1)]"
				></media-icon>
			</span>
		</media-seek-indicator>
	</div>
</media-container>

<style>
	/*
	 * The drop: falls in from just above, overshoots its line by a couple of pixels and settles,
	 * like a table cell landing in a reflowed page. Uses `translate` so it never fights `transform`.
	 */
	@keyframes -global-tabs-table-drop {
		0% {
			opacity: 0;
			translate: 0 -0.75rem;
		}
		55% {
			opacity: 1;
			translate: 0 3px;
		}
		80% {
			translate: 0 -1px;
		}
		100% {
			translate: 0 0;
		}
	}
</style>
