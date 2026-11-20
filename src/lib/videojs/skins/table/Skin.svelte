<!--
	Lab skin: table. Forked from $lib/videojs/scaffold/ScaffoldSkin.svelte.
	The chrome is laid out like a `<table border=1 cellspacing=2 cellpadding=3>`: a raised silver
	table with inset cells, one control per cell and the timeline in a full-width (colspan) row.
	Menus are a `<fieldset>`/`<legend>` with `<select size=N>` listboxes; buttons wear the raised
	Netscape/Win95 bevel. The flourish: feedback indicators stamp in like rubber-stamped banners.
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

	// == bevel palette ==
	// --t-face: button face / table background; --t-light & --t-hilite: lit edges;
	// --t-shadow & --t-dark: shaded edges; --t-text: text on the face; --t-well: inset wells (time, listbox);
	// --t-select: the selected listbox row and slider fill; --t-buffer: buffered-range stripes.
	const palette = [
		'[--t-face:var(--color-silver)] [--t-light:var(--color-white)] [--t-hilite:var(--color-gainsboro)]',
		'[--t-shadow:var(--color-gray)] [--t-dark:var(--color-black)] [--t-text:var(--color-black)]',
		'[--t-well:var(--color-white)] [--t-well-text:var(--color-black)] [--t-select:var(--color-navy)] [--t-buffer:var(--color-gainsboro)]',
		'dark:[--t-face:var(--color-gray)] dark:[--t-light:var(--color-darkgray)] dark:[--t-hilite:var(--color-silver)]',
		'dark:[--t-shadow:#404040] dark:[--t-dark:var(--color-black)] dark:[--t-text:var(--color-white)]',
		'dark:[--t-well:var(--color-black)] dark:[--t-well-text:var(--color-white)] dark:[--t-select:var(--color-teal)] dark:[--t-buffer:#333]'
	];

	// == bevels ==
	/** Raised: white top-left, gray/black bottom-right (an `<input type=button>`). */
	const raised =
		'border border-solid border-t-(--t-light) border-l-(--t-light) border-r-(--t-dark) border-b-(--t-dark) shadow-[inset_-1px_-1px_var(--t-shadow),inset_1px_1px_var(--t-hilite)]';
	/** Inset 1px, like a `<td>` inside a `<table border=1>`. */
	const insetThin =
		'border border-solid border-t-(--t-shadow) border-l-(--t-shadow) border-r-(--t-light) border-b-(--t-light)';
	/** Inset 2px, like a `<select>` or `<textarea>`. */
	const insetWell = [
		insetThin,
		'shadow-[inset_1px_1px_var(--t-dark),inset_-1px_-1px_var(--t-hilite)] bg-(--t-well) text-(--t-well-text)'
	];

	// == table ==
	/** The `<table>`: raised outer border, cellspacing=2. */
	const table = [
		raised,
		'bg-(--t-face) p-[2px] text-(--t-text) font-sans text-[12px] leading-none',
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	/** A `<td>`: inset 1px border, cellpadding=3. Hides itself when its control is hidden. */
	const cell = [
		insetThin,
		'flex items-center p-[3px] has-[>[hidden]]:hidden has-[>[data-hidden]]:hidden'
	];

	// == shared classes ==
	const button = [
		'relative grid h-[24px] min-w-[30px] shrink-0 cursor-pointer place-items-center rounded-none px-1 text-(--t-text)',
		'bg-(--t-face)',
		raised,
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[4px] pointer-coarse:before:content-['']",
		// pressed bevel while held down, or while its popup is open
		'active:border-t-(--t-dark) active:border-l-(--t-dark) active:border-r-(--t-light) active:border-b-(--t-light) active:shadow-[inset_1px_1px_var(--t-shadow),inset_-1px_-1px_var(--t-hilite)]',
		'aria-expanded:border-t-(--t-dark) aria-expanded:border-l-(--t-dark) aria-expanded:border-r-(--t-light) aria-expanded:border-b-(--t-light) aria-expanded:shadow-[inset_1px_1px_var(--t-shadow),inset_-1px_-1px_var(--t-hilite)]',
		'active:[&>*]:translate-x-px active:[&>*]:translate-y-px aria-expanded:[&>*]:translate-x-px aria-expanded:[&>*]:translate-y-px',
		'outline-none focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-offset-[-5px] focus-visible:outline-(color:--t-text)!',
		'aria-disabled:cursor-not-allowed aria-disabled:text-(--t-shadow) aria-disabled:[filter:drop-shadow(1px_1px_0_var(--t-light))]',
		'forced-colors:border forced-colors:border-solid forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]',
		'forced-colors:forced-color-adjust-none',
		'forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText] forced-colors:focus-visible:bg-[Highlight] forced-colors:focus-visible:text-[HighlightText]',
		'forced-colors:aria-expanded:bg-[Highlight] forced-colors:aria-expanded:text-[HighlightText] forced-colors:aria-disabled:text-[GrayText]',
		'data-hidden:hidden'
	];
	const centerSeek = [
		'hidden h-[32px]! px-2! pointer-fine:grid media-max-360:hidden! group-not-data-started/controls:hidden!',
		'shadow-[inset_-1px_-1px_var(--t-shadow),inset_1px_1px_var(--t-hilite),3px_3px_0_rgb(0_0_0/0.4)]'
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
	/** Classic Windows tooltip: #ffffe1, 1px black, 11px Helvetica, no animation to speak of. */
	const tooltipPopup = [
		popup,
		'pointer-events-none z-20 whitespace-nowrap rounded-none border border-solid border-black bg-[#ffffe1] px-[4px] py-[2px] font-sans text-[11px] leading-[13px] text-black',
		'shadow-[2px_2px_0_rgb(0_0_0/0.35)] [--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:42px]',
		'data-open:flex data-open:items-center data-open:gap-1',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	const screenTooltipPopup = [tooltipPopup, '[--media-tooltip-side-offset:6px]!'];
	const tooltipShortcut =
		'min-w-[1.5em] font-mono text-[11px] text-gray before:content-["("] after:content-[")"]';

	// == feedback banners (the flourish) ==
	// The indicators are un-hidden with `data-starting-style` for a couple of frames, then it's removed.
	// The stamp animation only runs once `data-starting-style` is gone, so re-opening a seek indicator
	// (which replays on every press) re-stamps it. Its 100% keyframe is the resting transform below.
	const banner = [
		'pointer-events-none flex items-center gap-2 px-3 py-2 rounded-none',
		'bg-(--t-face) text-(--t-text) font-serif text-[20px] leading-none font-bold',
		'border-2 border-solid border-t-(--t-light) border-l-(--t-light) border-r-(--t-dark) border-b-(--t-dark)',
		'shadow-[inset_-2px_-2px_var(--t-shadow),inset_2px_2px_var(--t-hilite),5px_5px_0_rgb(0_0_0/0.45)]',
		'transform-[rotate(-2deg)] transition-opacity duration-200 ease-out',
		'data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-300',
		'not-data-starting-style:animate-[table-stamp_480ms_cubic-bezier(0.2,0.8,0.3,1)]',
		'motion-reduce:animate-none! motion-reduce:transform-none',
		'media-high-contrast:outline media-high-contrast:outline-current',
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	/** The banner's inner `<td>`: a white inset cell like a `<td bgcolor=white>`. */
	const bannerCell = [
		insetWell,
		'flex items-center gap-2 px-[8px] py-[5px] font-serif text-[20px] leading-none'
	];

	// == menus ==
	/** Each menu panel is a `<fieldset>`: groove border drawn by ::before, with a legend on top. */
	const menuContent = [
		'absolute max-h-full overflow-auto overscroll-none outline-hidden',
		'[clip-path:inset(0)]',
		'flex flex-col gap-[6px] px-[14px] pt-[20px] pb-[14px] not-data-submenu:inset-x-0 not-data-submenu:top-0',
		"before:pointer-events-none before:absolute before:inset-x-[6px] before:top-[11px] before:bottom-[6px] before:content-['']",
		'before:border before:border-solid before:border-(--t-shadow) before:shadow-[1px_1px_0_var(--t-light),inset_1px_1px_0_var(--t-light)]',
		'not-data-submenu:data-child-open:transform-[translateX(-100%)]',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(100%)]',
		'not-data-submenu:data-child-open:[clip-path:inset(0_0_0_100%)] not-data-submenu:data-child-open:rtl:[clip-path:inset(0_100%_0_0)]',
		'data-submenu:inset-x-0 data-submenu:top-0 data-submenu:z-10',
		'transition-transform duration-200 ease-out motion-reduce:transition-none'
	];
	const legend =
		'pointer-events-none absolute start-[12px] top-[5px] bg-(--t-face) px-[3px] font-sans text-[12px] leading-[12px] font-bold';
	/** Root rows: `Label: [ value  v]`, the value drawn as a closed `<select>`. */
	const menuRow = [
		'group/menu-row flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-none min-h-[26px] w-full shrink-0 text-start',
		'outline-none'
	];
	const menuTrigger = [
		menuRow,
		'data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden'
	];
	const selectBox = [
		insetWell,
		'ms-auto flex h-[22px] min-w-[7.5rem] items-center gap-1 ps-[3px] pe-[1px]'
	];
	const selectValue = [
		'flex-1 truncate px-[2px] py-[2px] leading-[14px]',
		'group-data-highlighted/menu-row:bg-(--t-select) group-data-highlighted/menu-row:text-white',
		'forced-colors:group-data-highlighted/menu-row:bg-[Highlight] forced-colors:group-data-highlighted/menu-row:text-[HighlightText]'
	];
	/** The little raised ▼ button inside a closed `<select>`. */
	const selectArrow = [
		raised,
		'grid h-[16px] w-[16px] shrink-0 place-items-center bg-(--t-face) text-(--t-text) text-[8px] leading-none',
		'group-active/menu-row:border-t-(--t-shadow) group-active/menu-row:border-l-(--t-shadow) group-active/menu-row:shadow-none'
	];
	/** A `<select size=N>`: white inset box, navy row for the selection, dotted focus ring. */
	const listbox = [
		insetWell,
		'flex max-h-[9.5rem] min-w-[9rem] flex-col overflow-y-auto p-[2px] [scrollbar-color:var(--t-face)_var(--t-hilite)]'
	];
	const radioItem = [
		'group/menu-radio flex cursor-pointer items-center justify-between gap-3 rounded-none min-h-[18px] w-full shrink-0 px-[3px] py-[2px] leading-[14px]',
		'outline-none data-highlighted:outline-1 data-highlighted:outline-dotted data-highlighted:outline-offset-[-1px] data-highlighted:outline-(color:--t-well-text)!',
		'aria-checked:bg-(--t-select) aria-checked:text-white aria-checked:data-highlighted:outline-[#ffffe1]!',
		'forced-colors:aria-checked:bg-[Highlight] forced-colors:aria-checked:text-[HighlightText]',
		'data-custom:italic'
	];
	const menuBadge =
		'border border-solid border-current px-[3px] text-[9px] leading-[11px] font-bold';

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

{#snippet chevron(back = false)}
	<media-icon
		family="scaffold"
		name="chevron"
		class={back
			? 'size-[12px] shrink-0 transform-[rotate(180deg)] rtl:transform-none'
			: 'size-[12px] shrink-0 rtl:transform-[scaleX(-1)]'}
	></media-icon>
{/snippet}

<media-container
	class={[
		'media-skin table-skin',
		palette,
		'rounded-media-player text-media text-media-foreground @container/media-root relative block h-full w-full overflow-hidden font-sans [--spacing:var(--media-spacing)]',
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

	<!-- error dialog: a bevelled alert box with a navy title bar -->
	<media-error-dialog>
		<media-dialog-backdrop
			class="absolute inset-0 z-40 bg-[repeating-conic-gradient(rgb(0_0_0/0.85)_0_25%,rgb(0_0_0/0.55)_0_50%)] bg-size-[2px_2px] not-data-open:hidden data-[scope=document]:fixed"
		></media-dialog-backdrop>
		<media-dialog-popup
			class={[
				table,
				'absolute top-1/2 left-1/2 z-50 grid max-h-[calc(100%-32px)] w-[calc(100%-32px)] max-w-80 transform-[translate(-50%,-50%)] gap-[10px] overflow-auto p-[3px] pb-[10px] not-data-open:hidden',
				'data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-32px)]',
				'focus-visible:outline-media-ring outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px]'
			]}
		>
			<media-dialog-title
				class="bg-navy px-[6px] py-[4px] text-[12px] leading-[14px] font-bold text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]"
			></media-dialog-title>
			<media-dialog-description class="px-[10px] font-serif text-[15px] leading-[19px]"
			></media-dialog-description>
			<media-dialog-close class={[button, 'mx-[10px] w-[75px] justify-self-end']}
			></media-dialog-close>
		</media-dialog-popup>
	</media-error-dialog>

	<media-controls>
		<!-- buffering, while controls are hidden -->
		<media-controls-group class="group/buffering-controls contents">
			<media-buffering-indicator
				class="pointer-events-none absolute inset-0 z-40 grid place-items-center not-data-visible:hidden not-data-visible:[--media-spinner-animation:none] motion-reduce:[--media-spinner-animation:none]"
			>
				<span class={[table, 'flex items-center gap-2 px-3 py-2']}>
					<media-icon family="scaffold" name="spinner" class="size-[16px]"></media-icon>
					Loading&hellip;
				</span>
			</media-buffering-indicator>
		</media-controls-group>

		<media-controls-content class="group/controls pointer-events-none absolute inset-0 z-30">
			<media-tooltip-group>
				<!-- top: a one-row table — a <th> caption with the title, then screen controls -->
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
							insetThin,
							'media-max-3xs:hidden flex min-w-0 flex-1 items-center bg-(--t-hilite) px-[6px] py-[3px] dark:bg-(--t-shadow)'
						]}
					>
						<media-title
							class="pointer-events-none min-w-0 flex-1 truncate font-serif text-[15px] leading-[18px] font-bold not-data-visible:opacity-0 forced-colors:text-[CanvasText]"
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

				<!-- center: one big bevelled [ Play ] button, flanked by seek buttons -->
				<media-buffering-indicator class="group/center-buffering contents">
					<media-controls-group
						class={[
							'pointer-events-auto absolute top-1/2 left-1/2 flex transform-[translate(-50%,-50%)] items-center gap-3 group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
							'transition-opacity duration-150 group-not-data-visible/controls:opacity-0 group-data-visible/center-buffering:hidden! motion-reduce:transition-none'
						]}
					>
						<media-seek-button
							seconds={-10}
							id={id('center-back')}
							class={[button, centerSeek, 'font-bold']}
						>
							<span class="flex items-center gap-[3px]">
								<span aria-hidden="true" class="text-[9px]">&#9664;&#9664;</span>10
							</span>
						</media-seek-button>
						{@render tooltip('center-back', { disabled: true })}

						<media-play-button
							id={id('center-play')}
							class={[
								button,
								'group/play media-max-360:h-[34px]! media-max-360:px-[10px]! h-[44px]! px-[18px]!',
								'shadow-[inset_-1px_-1px_var(--t-shadow),inset_1px_1px_var(--t-hilite),4px_4px_0_rgb(0_0_0/0.45)]!',
								'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[inset_1px_1px_var(--t-shadow),2px_2px_0_rgb(0_0_0/0.45)]!'
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

						<media-seek-button
							seconds={10}
							id={id('center-forward')}
							class={[button, centerSeek, 'font-bold']}
						>
							<span class="flex items-center gap-[3px]">
								10<span aria-hidden="true" class="text-[9px]">&#9654;&#9654;</span>
							</span>
						</media-seek-button>
						{@render tooltip('center-forward', { disabled: true })}
					</media-controls-group>
				</media-buffering-indicator>

				<!-- bottom: <table border=1 cellspacing=2 cellpadding=3> -->
				<div
					class={[
						table,
						'pointer-events-auto absolute inset-x-[8px] bottom-[8px] flex flex-col gap-[2px] group-not-data-visible/controls:pointer-events-none',
						'transition-opacity duration-150 group-not-data-visible/controls:opacity-0 motion-reduce:transition-none',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<!-- <tr><td colspan=6> the timeline -->
					<div class={[cell, 'px-[6px]']}>
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
												'before:clip-media-chapter-track-x before:absolute before:inset-y-0 before:rounded-none before:bg-(--t-well)',
												'before:border before:border-solid before:border-t-(--t-shadow) before:border-r-(--t-light) before:border-b-(--t-light) before:border-l-(--t-shadow)',
												'forced-colors:before:bg-[Canvas] forced-colors:before:opacity-100! forced-colors:before:forced-color-adjust-none',
												'forced-colors:before:border forced-colors:before:border-solid forced-colors:before:border-[CanvasText]'
											]}
										>
											<media-slider-buffer
												class={[
													'clip-media-x-[--media-slider-buffer] absolute inset-y-[1px] rounded-none',
													'bg-[repeating-linear-gradient(90deg,var(--t-buffer)_0_3px,transparent_3px_4px)]',
													'forced-colors:opacity-100! forced-colors:forced-color-adjust-none',
													'forced-colors:bg-[repeating-linear-gradient(135deg,CanvasText_0px,CanvasText_1px,Canvas_1px,Canvas_3px)]'
												]}
											></media-slider-buffer>
											<media-slider-fill
												class={[
													'clip-media-x-[--media-slider-fill] absolute inset-y-[2px] rounded-none bg-(--t-select) forced-colors:forced-color-adjust-none',
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
									raised,
									'absolute left-[var(--media-slider-fill,0%)] h-[20px] w-[11px] transform-[translateX(-50%)] rounded-none bg-(--t-face)',
									'group-data-dragging/slider:left-(--media-slider-pointer)',
									'outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-(color:--t-text)! focus-visible:outline-dotted',
									'forced-colors:bg-[ButtonFace] forced-colors:forced-color-adjust-none',
									'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]'
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
									class={[
										raised,
										'block max-w-39 overflow-hidden rounded-none bg-(--t-face) p-[3px]',
										'shadow-[inset_-1px_-1px_var(--t-shadow),inset_1px_1px_var(--t-hilite),3px_3px_0_rgb(0_0_0/0.4)]'
									]}
								>
									<img alt="" aria-hidden="true" decoding="async" class="block" />
								</media-slider-thumbnail>
								<div
									class="-mt-px flex max-w-full min-w-0 items-center gap-2 border border-solid border-black bg-[#ffffe1] px-[4px] py-[2px] font-sans text-[11px] leading-[13px] text-black shadow-[2px_2px_0_rgb(0_0_0/0.35)]"
								>
									<media-slider-value type="pointer" class="shrink-0 font-mono tabular-nums"
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
									'shadow-[inset_-1px_-1px_var(--t-shadow),inset_1px_1px_var(--t-hilite),3px_3px_0_rgb(0_0_0/0.4)]',
									'[--media-popover-side-offset:42px] [--media-popup-side-offset:var(--media-popover-side-offset)]'
								]}
							>
								<media-volume-slider
									orientation="vertical"
									thumb-alignment="edge"
									class="relative flex size-full cursor-pointer justify-center data-disabled:cursor-not-allowed data-disabled:opacity-40"
								>
									<media-slider-track
										class={[
											insetWell,
											'absolute bottom-0 left-1/2 h-full w-[8px] transform-[translateX(-50%)] overflow-hidden rounded-none forced-colors:forced-color-adjust-none',
											'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]'
										]}
									>
										<media-slider-fill
											class="absolute bottom-0 left-0 h-[var(--media-slider-fill,0%)] w-full rounded-none bg-(--t-select) forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none"
										></media-slider-fill>
									</media-slider-track>
									<media-slider-thumb
										class={[
											raised,
											'absolute bottom-[var(--media-slider-fill,0%)] left-1/2 h-[11px] w-[20px] transform-[translate(-50%,50%)] rounded-none bg-(--t-face)',
											'outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-(color:--t-text)! focus-visible:outline-dotted',
											'forced-colors:bg-[ButtonFace] forced-colors:forced-color-adjust-none',
											'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]'
										]}
									></media-slider-thumb>
								</media-volume-slider>
							</media-volume-popover>
						</div>

						<!-- the time lives in a white <td bgcolor=white>, in Courier -->
						<div class={[cell, 'min-w-0 flex-1 bg-(--t-well) text-(--t-well-text)']}>
							<media-time-group
								class="flex shrink-0 items-center gap-[6px] px-[4px] font-mono text-[13px] leading-none tabular-nums rtl:flex-row-reverse"
							>
								<media-time
									type="current"
									toggle
									class={[
										'media-xs:hidden cursor-pointer rounded-none outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-current! focus-visible:outline-dotted',
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
								class={[button, 'px-[6px]']}
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

							<media-menu
								id={id('menu')}
								side="top"
								align="end"
								class={[
									popup,
									'z-20 m-0 max-w-(--media-menu-available-width) min-w-56 overflow-hidden! rounded-none bg-(--t-face) p-0 font-sans text-[12px] text-(--t-text)',
									'shadow-[inset_1px_1px_var(--t-light),inset_-1px_-1px_var(--t-dark),inset_2px_2px_var(--t-hilite),inset_-2px_-2px_var(--t-shadow),3px_3px_0_rgb(0_0_0/0.4)]',
									'[--media-popover-side-offset:42px] [--media-popup-side-offset:var(--media-popover-side-offset)]',
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
											<media-menu-item class={[menuRow, 'min-h-0 w-auto self-start']}>
												<span
													class={[
														raised,
														'flex h-[22px] items-center gap-[4px] bg-(--t-face) px-[8px]',
														'group-active/menu-row:border-t-(--t-dark) group-active/menu-row:border-r-(--t-light) group-active/menu-row:border-b-(--t-light) group-active/menu-row:border-l-(--t-dark)',
														'group-data-highlighted/menu-row:outline-1 group-data-highlighted/menu-row:outline-offset-[-4px] group-data-highlighted/menu-row:outline-(color:--t-text)! group-data-highlighted/menu-row:outline-dotted'
													]}
												>
													{@render chevron(true)}
													<span class="sr-only"
														><media-text token="menu.{submenu.key}">{label}</media-text></span
													>
													<span aria-hidden="true">Back</span>
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

	<!-- transient feedback, stamped in like banners; hidden from AT because the status announcer speaks the same events -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 z-20 grid grid-cols-3 items-center justify-items-center forced-colors:z-40"
	>
		<media-volume-indicator
			class={[
				banner,
				'group/volume-status col-span-full col-start-1 row-start-1 mt-[60px] self-start'
			]}
		>
			<media-volume-indicator-fill
				class={[
					'flex items-center gap-[10px] rtl:flex-row-reverse',
					'group-data-max/volume-status:animate-[table-shake_300ms_linear] group-data-min/volume-status:animate-[table-shake_300ms_linear] motion-reduce:animate-none!'
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
					<media-volume-indicator-value class="font-mono tabular-nums"
					></media-volume-indicator-value>
				</span>
				<!-- twenty table cells, filled navy up to the level -->
				<span
					class={[
						insetWell,
						'media-max-xs:w-[64px] relative h-[24px] w-[124px] p-[2px]',
						'group-data-max/volume-status:border-maroon'
					]}
				>
					<span class="relative block size-full">
						<span
							class="absolute inset-y-0 left-0 w-(--media-volume-fill,0%) bg-(--t-select) forced-colors:bg-[Highlight]"
						></span>
						<span
							class="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_10px,var(--t-well)_10px_12px)]"
						></span>
					</span>
				</span>
			</media-volume-indicator-fill>
		</media-volume-indicator>

		<media-status-indicator
			actions="toggleSubtitles,toggleFullscreen,togglePictureInPicture"
			class={[
				banner,
				'group/input-status col-span-full col-start-1 row-start-1 mt-[60px] self-start'
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
				'data-[direction=forward]:transform-[rotate(2deg)] data-[direction=forward]:[--table-stamp-tilt:12deg]'
			]}
		>
			<span
				class={[
					bannerCell,
					'gap-[6px] group-data-[direction=backward]/seek-status:flex-row-reverse'
				]}
			>
				<media-seek-indicator-value class="font-mono tabular-nums"></media-seek-indicator-value>
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
	 * The rubber stamp: slams down oversized and tilted, overshoots, wobbles, settles on its resting
	 * tilt (the element's own transform, which the missing 100% keyframe interpolates back to).
	 */
	@keyframes -global-table-stamp {
		0% {
			opacity: 0;
			transform: scale(2.6) rotate(var(--table-stamp-tilt, -12deg));
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

	/* Volume can't go further: the banner rattles in place. */
	@keyframes -global-table-shake {
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
