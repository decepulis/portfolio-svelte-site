<!--
	The site's Video.js skin: the scaffold skin's markup (see ./register.ts), restyled from period
	sources.
	- The chrome is what a browser drew for `<table border=1 cellspacing=2>` (HTML 3.2: "rendered in
	  bas-relief, raised up with the outer border as a bevel, and individual cells inset into this
	  raised surface"): a 1px outset frame, every cell its own 1px inset box, 2px apart.
	- The bevel belongs to the table only. Controls are flat gainsboro form controls filling their
	  cells (white on hover/focus, like Tabs.svelte), in the system sans-serif that form widgets used.
	  Copy (the title as a bold, centered `<th>`, legends, status) is in the page's Times.
	- The control bar is docked to the bottom edge, like the QuickTime plug-in's controller strip
	  (`<embed controller=true>`): a table row attached beneath the movie, not a floating toolbar.
	- Menus are `<fieldset>`/`<legend>` with `<select size=N>` listboxes, ruled with engraved `<hr>`s.
	Flourish: the settings menu slides between fieldsets like Tabs.svelte panels (25% nudge, fade,
	eased size); feedback indicators press in like a calm rubber stamp.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import './register';

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

	// == fonts ==
	// Copy is the browser's default serif; form controls are the system sans; data is Courier.
	// Spelled out rather than font-serif/font-sans/font-mono until the site theme defines those.
	const serif = "[font-family:Times,'Times_New_Roman',serif]";
	const sans = '[font-family:Helvetica,Arial,sans-serif]';
	const mono = "[font-family:'Courier_New',monospace]";

	// == palette ==
	// --br-page: the page (and a copy cell); --br-face: a form control; --br-hi / --br-lo: the light
	// and dark edges of the table's bas-relief; --br-sel: an unfocused `<select>`'s selected row;
	// --br-played: the timeline ("visited"); --br-mark: volume (link blue).
	const palette = [
		'[--br-page:var(--color-white)] [--br-face:var(--color-gainsboro)] [--br-ink:var(--color-black)]',
		'[--br-hi:var(--color-silver)] [--br-lo:var(--color-gray)] [--br-sel:var(--color-silver)]',
		'[--br-played:var(--color-visited)] [--br-mark:var(--color-link)] [--br-buffer:var(--color-gainsboro)]',
		'dark:[--br-page:var(--color-gainsboro)] dark:[--br-face:var(--color-silver)] dark:[--br-hi:var(--color-white)]',
		'dark:[--br-sel:var(--color-darkgray)] dark:[--br-buffer:var(--color-silver)]',
		'[--media-accent:var(--color-blue)] [--media-ring:var(--color-blue)]'
	];

	// == the table's bas-relief ==
	/** `<table border=1>`: the raised outer frame, light top-left, dark bottom-right. */
	const outset =
		'border border-solid border-t-(--br-hi) border-l-(--br-hi) border-r-(--br-lo) border-b-(--br-lo)';
	/** A `<td>`: inset into the raised surface. */
	const inset =
		'border border-solid border-t-(--br-lo) border-l-(--br-lo) border-r-(--br-hi) border-b-(--br-hi)';
	/** An engraved `<hr>` (no NOSHADE): a 2px groove. */
	const hr = 'h-0 border-t border-b border-solid border-t-(--br-lo) border-b-(--br-page)';

	/** The `<table cellspacing=2>`: page-colored, raised. */
	const table = [
		outset,
		'bg-(--br-page) p-[2px] text-(--br-ink) leading-none',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	/** A `<td>` holding a control: hides itself with its control; the control fills it. */
	const cell = [
		inset,
		'flex items-stretch has-[>[hidden]]:hidden has-[>[data-hidden]]:hidden',
		'forced-colors:border-[CanvasText]'
	];

	// == form controls: flat, gainsboro, sans-serif ==
	const control = [
		sans,
		'relative grid shrink-0 cursor-pointer place-items-center rounded-none bg-(--br-face) text-(--br-ink)',
		'hover:bg-(--br-page) focus-visible:bg-(--br-page) aria-expanded:bg-(--br-page)',
		'outline-none -outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue',
		'aria-disabled:cursor-not-allowed aria-disabled:text-(--br-lo)',
		'transition-colors duration-150 motion-reduce:transition-none',
		'forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:forced-color-adjust-none',
		'forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText] forced-colors:focus-visible:bg-[Highlight] forced-colors:focus-visible:text-[HighlightText]',
		'forced-colors:aria-expanded:bg-[Highlight] forced-colors:aria-expanded:text-[HighlightText] forced-colors:aria-disabled:text-[GrayText]',
		'data-hidden:hidden'
	];
	const button = [
		control,
		'h-[28px] min-w-[30px] px-[6px] text-[13px]',
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[3px] pointer-coarse:before:content-['']"
	];
	/** A standalone `<input type=submit>`, not in a cell: flat, with its own 1px rule. */
	const submit = [control, 'h-[24px] min-w-[72px] border border-solid border-(--br-lo) px-[12px]'];
	const centerSeek = [control, 'px-[10px] text-[13px] font-bold'];
	/** The seek cells only exist for a mouse, with room, once playback has started. */
	const centerSeekCell = [
		cell,
		'hidden pointer-fine:flex media-max-360:hidden! group-not-data-started/controls:hidden!'
	];
	const icon = 'col-start-1 row-start-1 size-[16px]';

	// == popups: each is its own small raised table, set 2px off the control bar ==
	// From a bottom-row trigger's top edge up to the bar's top edge is 34px (its cell's 1px rule, 2px
	// spacing, the 28px timeline row, 2px spacing, the bar's 1px frame); plus the 2px gap: 36px.
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
	const panel = [
		outset,
		'border!',
		'rounded-none bg-(--br-page) text-(--br-ink) shadow-none',
		'[--media-popover-side-offset:36px] [--media-popup-side-offset:var(--media-popover-side-offset)]',
		'[--media-hidden-popup-blur:0px] [--media-hidden-popup-scale:1] [--media-popup-translate-distance:0px]',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	/** Tooltips: a plain one-cell label on the page color, small sans (`<font face=Arial size=1>`). */
	const tipBox = [
		sans,
		'rounded-none border border-solid border-(--br-lo) bg-(--br-page) px-[5px] py-[3px] text-[11px] leading-[13px] text-(--br-ink)'
	];
	const tooltipPopup = [
		popup,
		tipBox,
		'pointer-events-none z-20 whitespace-nowrap',
		'[--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:38px]',
		'transition-opacity duration-150 motion-reduce:transition-none',
		'data-open:flex data-open:items-center data-open:gap-[5px]',
		'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
	];
	const screenTooltipPopup = [tooltipPopup, '[--media-tooltip-side-offset:6px]!'];
	/** The shortcut is a `<kbd>`: Courier in a thin box. */
	const tooltipShortcut = [
		mono,
		'min-w-[1.5em] border border-solid border-(--br-hi) px-[3px] text-center text-[11px] empty:hidden'
	];

	// == feedback stamps (the second flourish) ==
	// The indicators are un-hidden with `data-starting-style` for a couple of frames, then it's removed.
	// The stamp only runs once `data-starting-style` is gone, so a re-opened seek indicator re-stamps.
	// Its 100% keyframe is the resting transform below (a slight, hand-placed tilt).
	const banner = [
		table,
		serif,
		'pointer-events-none flex items-stretch gap-[2px] rounded-none',
		'transform-[rotate(-1deg)] transition-opacity duration-200 ease-out',
		'data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-300',
		'not-data-starting-style:animate-[bas-relief-stamp_400ms_cubic-bezier(0.2,0.8,0.3,1)]',
		'motion-reduce:animate-none! motion-reduce:transform-none',
		'media-high-contrast:outline media-high-contrast:outline-current',
		'forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	/** The stamp's `<th>`: bold Times. */
	const bannerCell = [
		inset,
		'flex items-center gap-2 px-[9px] py-[5px] text-[20px] leading-none font-bold',
		'media-max-md:px-[6px] media-max-md:py-[4px] media-max-md:text-[16px]'
	];

	// == menus ==
	/**
	 * Each panel is a `<fieldset>` (its 2px groove drawn by ::before, the legend sat on it). Panels
	 * move like Tabs.svelte panels: a 25% nudge plus a fade while the menu eases to the incoming size.
	 */
	const menuContent = [
		'absolute inset-x-0 top-0 max-h-full overflow-auto overscroll-none outline-hidden',
		'flex flex-col gap-[7px] px-[14px] pt-[22px] pb-[14px]',
		"before:pointer-events-none before:absolute before:inset-x-[5px] before:top-[11px] before:bottom-[5px] before:content-['']",
		'before:border-2 before:[border-style:groove] before:border-(--br-hi) forced-colors:before:border-[CanvasText]',
		'transform-gpu transition-[transform,opacity] duration-300 ease-out motion-reduce:duration-0',
		'not-data-submenu:data-child-open:transform-[translateX(-25%)] not-data-submenu:data-child-open:opacity-0',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(25%)]',
		'data-submenu:z-10',
		'data-submenu:media-transitioning:transform-[translateX(25%)] data-submenu:media-transitioning:opacity-0',
		'data-submenu:media-transitioning:rtl:transform-[translateX(-25%)] data-submenu:media-transitioning:pointer-events-none'
	];
	/** The `<legend>`: page copy, so Times. */
	const legend = [
		serif,
		'pointer-events-none absolute start-[11px] top-[4px] bg-(--br-page) px-[3px] text-[15px] leading-[15px]'
	];
	const menuRow =
		'group/menu-row flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-none min-h-[24px] w-full shrink-0 text-start outline-none';
	const menuTrigger = [
		menuRow,
		'data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden'
	];
	/** Root rows: `Label: [ value |▾]`, the value a closed `<select>`, flat. */
	const selectBox = [
		'ms-auto flex h-[22px] min-w-[7.5rem] items-stretch border border-solid border-(--br-lo) bg-(--br-page)',
		'group-data-highlighted/menu-row:outline-2 group-data-highlighted/menu-row:outline-offset-1 group-data-highlighted/menu-row:outline-blue',
		'forced-colors:border-[CanvasText] forced-colors:group-data-highlighted/menu-row:outline-[Highlight]'
	];
	const selectValue = 'flex flex-1 items-center truncate px-[5px] leading-[14px]';
	/** The flat ▾ button at the end of a closed `<select>`. */
	const selectArrow = [
		'grid w-[18px] shrink-0 place-items-center border-s border-solid border-(--br-lo) bg-(--br-face) text-[8px] leading-none',
		'group-hover/menu-row:bg-(--br-page) group-data-highlighted/menu-row:bg-(--br-page)'
	];
	/** A `<select size=N>`: a thin box, the selected row gray (as an unfocused listbox draws it). */
	const listbox = [
		'flex max-h-[9.5rem] min-w-[9rem] flex-col overflow-y-auto border border-solid border-(--br-lo) bg-(--br-page) p-px',
		'[scrollbar-color:var(--br-hi)_var(--br-page)] forced-colors:border-[CanvasText]'
	];
	const radioItem = [
		'group/menu-radio flex cursor-pointer items-center justify-between gap-3 rounded-none min-h-[19px] w-full shrink-0 px-[4px] py-[2px] leading-[15px]',
		'aria-checked:bg-(--br-sel)',
		'outline-none data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-blue',
		'forced-colors:aria-checked:bg-[Highlight] forced-colors:aria-checked:text-[HighlightText]',
		'data-custom:italic'
	];
	const menuBadge = [
		mono,
		'border border-solid border-(--br-lo) px-[3px] text-[10px] leading-[12px]'
	];

	const submenus = [
		{ key: 'quality', group: 'media-quality-radio-group' },
		{ key: 'audio', group: 'media-audio-track-radio-group' },
		{ key: 'speed', group: 'media-playback-rate-radio-group' },
		{ key: 'captions', group: 'media-captions-radio-group' }
	] as const;
	const menuLabels = { quality: 'Quality', audio: 'Audio', speed: 'Speed', captions: 'Captions' };

	/** The status indicator's icon for each action it reports (full class names, for Tailwind). */
	const statusIcons = [
		{ name: 'captions-on', show: 'group-data-[status=captions-on]/input-status:block' },
		{ name: 'captions-off', show: 'group-data-[status=captions-off]/input-status:block' },
		{ name: 'fullscreen-enter', show: 'group-data-[status=fullscreen]/input-status:block' },
		{ name: 'fullscreen-exit', show: 'group-data-[status=exit-fullscreen]/input-status:block' },
		{ name: 'pip-enter', show: 'group-data-[status=pip]/input-status:block' },
		{ name: 'pip-exit', show: 'group-data-[status=exit-pip]/input-status:block' }
	];

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
	opts: {
		class?: ClassValue;
		side?: 'top' | 'bottom';
		disabled?: boolean;
		delay?: number;
		sticky?: boolean;
	} = {}
)}
	<media-tooltip
		trigger={id(trigger)}
		side={opts.side ?? 'top'}
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
		'media-skin bas-relief-skin',
		palette,
		sans,
		'text-media text-media-foreground @container/media-root relative block h-full w-full overflow-hidden rounded-none [--spacing:var(--media-spacing)]',
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

	<!-- error dialog: a raised table — bold Times heading, an engraved <hr>, and a flat [ OK ] -->
	<media-error-dialog>
		<media-dialog-backdrop
			class="absolute inset-0 z-40 bg-black/60 not-data-open:hidden data-[scope=document]:fixed"
		></media-dialog-backdrop>
		<media-dialog-popup
			class={[
				table,
				serif,
				'absolute top-1/2 left-1/2 z-50 grid max-h-[calc(100%-32px)] w-[calc(100%-32px)] max-w-80 transform-[translate(-50%,-50%)] gap-[10px] overflow-auto px-[14px] py-[12px] not-data-open:hidden',
				'data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-32px)]',
				'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:-outline-offset-4'
			]}
		>
			<media-dialog-title class="text-[20px] leading-[24px] font-bold"></media-dialog-title>
			<hr class={[hr, 'm-0 -mt-[2px]']} />
			<media-dialog-description class="text-[15px] leading-[19px]"></media-dialog-description>
			<media-dialog-close class={[submit, 'justify-self-end text-[13px]']}></media-dialog-close>
		</media-dialog-popup>
	</media-error-dialog>

	<media-controls>
		<!-- buffering, while controls are hidden -->
		<media-controls-group class="group/buffering-controls contents">
			<media-buffering-indicator
				class="pointer-events-none absolute inset-0 z-40 grid place-items-center not-data-visible:hidden not-data-visible:[--media-spinner-animation:none] motion-reduce:[--media-spinner-animation:none]"
			>
				<span class={[table, 'flex']}>
					<span
						class={[inset, serif, 'flex items-center gap-2 px-[9px] py-[5px] text-[15px] italic']}
					>
						<media-icon family="scaffold" name="spinner" class="size-[16px]"></media-icon>
						Loading&hellip;
					</span>
				</span>
			</media-buffering-indicator>
		</media-controls-group>

		<media-controls-content class="group/controls pointer-events-none absolute inset-0 z-30">
			<media-tooltip-group>
				<!-- top: two small tables — the title in a <th>, the screen controls in their own cells -->
				<media-controls-group
					class={[
						'absolute inset-x-[8px] top-[8px] flex items-start justify-between gap-[8px] rtl:flex-row-reverse',
						'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0',
						'not-data-started:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<div class="media-max-3xs:invisible flex min-w-0">
						<div class={[table, 'pointer-events-none flex min-w-0 has-[media-title:empty]:hidden']}>
							<!-- <th>: bold and centered, by default -->
							<media-title
								class={[
									inset,
									serif,
									'min-w-0 truncate px-[8px] py-[4px] text-center text-[16px] leading-[19px] font-bold not-data-visible:opacity-0',
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
							{@render tooltip('airplay', { class: screenTooltipPopup, side: 'bottom' })}
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
							{@render tooltip('cast', { class: screenTooltipPopup, side: 'bottom' })}
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
							{@render tooltip('pip', { class: screenTooltipPopup, side: 'bottom' })}
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
							{@render tooltip('fullscreen', { class: screenTooltipPopup, side: 'bottom' })}
						</div>
					</div>
				</media-controls-group>

				<!-- center: a one-row table — [◂◂ 10] [ ▷ Play ] [10 ▸▸], each button filling its cell -->
				<media-buffering-indicator class="group/center-buffering contents">
					<media-controls-group
						class={[
							table,
							'pointer-events-auto absolute top-1/2 left-1/2 flex transform-[translate(-50%,-50%)] items-stretch gap-[2px] group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
							'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 group-data-visible/center-buffering:hidden! motion-reduce:duration-0'
						]}
					>
						<div class={centerSeekCell}>
							<media-seek-button seconds={-10} id={id('center-back')} class={centerSeek}>
								<span class="flex items-center gap-[3px]">
									<span aria-hidden="true" class="text-[9px]">&#9664;&#9664;</span>10
								</span>
							</media-seek-button>
							{@render tooltip('center-back', { disabled: true })}
						</div>

						<div class={cell}>
							<media-play-button
								id={id('center-play')}
								class={[
									control,
									'group/play media-max-360:h-[34px] media-max-360:px-[10px] h-[48px] px-[18px]'
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
						</div>

						<div class={centerSeekCell}>
							<media-seek-button seconds={10} id={id('center-forward')} class={centerSeek}>
								<span class="flex items-center gap-[3px]">
									10<span aria-hidden="true" class="text-[9px]">&#9654;&#9654;</span>
								</span>
							</media-seek-button>
							{@render tooltip('center-forward', { disabled: true })}
						</div>
					</media-controls-group>
				</media-buffering-indicator>

				<!--
					bottom: the controller strip, docked to the movie's bottom edge like the QuickTime
					plug-in's — <table border=1 cellspacing=2 width=100%>
				-->
				<div
					class={[
						table,
						'pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col gap-[2px] group-not-data-visible/controls:pointer-events-none',
						'transition-opacity duration-200 group-not-data-visible/controls:opacity-0 motion-reduce:duration-0',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<!-- <tr><td colspan=5> the timeline -->
					<div class={[cell, 'h-[28px] items-center px-[7px]']}>
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
										<!-- an inset groove; buffered = gray stripes; played = visited purple -->
										<media-slider-track
											class={[
												'absolute inset-x-0 isolate h-[10px] rounded-none',
												'before:clip-media-chapter-track-x before:absolute before:inset-y-0 before:rounded-none before:bg-(--br-page)',
												'before:border before:border-solid before:border-t-(--br-lo) before:border-r-(--br-hi) before:border-b-(--br-hi) before:border-l-(--br-lo)',
												'forced-colors:before:bg-[Canvas] forced-colors:before:opacity-100! forced-colors:before:forced-color-adjust-none',
												'forced-colors:before:border-[CanvasText]'
											]}
										>
											<media-slider-buffer
												class={[
													'clip-media-x-[--media-slider-buffer] absolute inset-y-[2px] rounded-none',
													'bg-[repeating-linear-gradient(90deg,var(--br-buffer)_0_3px,transparent_3px_4px)]',
													'forced-colors:opacity-100! forced-colors:forced-color-adjust-none',
													'forced-colors:bg-[repeating-linear-gradient(135deg,CanvasText_0px,CanvasText_1px,Canvas_1px,Canvas_3px)]'
												]}
											></media-slider-buffer>
											<media-slider-fill
												class={[
													'clip-media-x-[--media-slider-fill] absolute inset-y-[2px] rounded-none bg-(--br-played) forced-colors:forced-color-adjust-none',
													'group-data-dragging/slider:clip-media-x-[--media-slider-pointer]',
													'forced-colors:bg-[Canvas] forced-colors:bg-[linear-gradient(Highlight,Highlight)]'
												]}
											></media-slider-fill>
										</media-slider-track>
									</div>
								</template>
							</media-time-slider-chapters>
							<!-- the thumb is a tiny flat button -->
							<media-slider-thumb
								class={[
									'absolute left-[var(--media-slider-fill,0%)] h-[18px] w-[9px] transform-[translateX(-50%)] rounded-none',
									'border border-solid border-(--br-lo) bg-(--br-face)',
									'group-hover/slider:bg-(--br-page) group-data-dragging/slider:bg-(--br-page)',
									'group-data-dragging/slider:left-(--media-slider-pointer)',
									'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
									'forced-colors:border-[CanvasText] forced-colors:bg-[ButtonFace] forced-colors:forced-color-adjust-none'
								]}
							></media-slider-thumb>
							<media-slider-preview
								class={[
									'pointer-events-none bottom-[calc(100%+12px)] grid max-w-39 origin-bottom justify-items-center',
									'opacity-0 group-data-disabled/slider:hidden',
									'group-data-pointing/slider:opacity-100',
									'group-data-dragging/slider:opacity-100'
								]}
							>
								<media-slider-thumbnail
									class={[table, 'block max-w-39 overflow-hidden rounded-none']}
								>
									<img alt="" aria-hidden="true" decoding="async" class={[inset, 'block']} />
								</media-slider-thumbnail>
								<div class={[tipBox, '-mt-px flex max-w-full min-w-0 items-center gap-2']}>
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
							<!-- the volume popover: a one-cell raised table, 2px above the strip -->
							<media-volume-popover
								id={id('volume')}
								open-on-hover
								delay={200}
								close-delay={100}
								side="top"
								align="center"
								class={[popup, panel, 'z-20 box-border flex h-[116px] w-[34px] p-[2px]']}
							>
								<div class={[inset, 'flex flex-1 px-0 py-[8px]']}>
									<media-volume-slider
										orientation="vertical"
										thumb-alignment="edge"
										class="group/volume relative flex size-full cursor-pointer justify-center data-disabled:cursor-not-allowed data-disabled:opacity-40"
									>
										<media-slider-track
											class={[
												inset,
												'absolute bottom-0 left-1/2 h-full w-[8px] transform-[translateX(-50%)] overflow-hidden rounded-none bg-(--br-page) forced-colors:forced-color-adjust-none',
												'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]'
											]}
										>
											<media-slider-fill
												class="absolute bottom-0 left-0 h-[var(--media-slider-fill,0%)] w-full rounded-none bg-(--br-mark) forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none"
											></media-slider-fill>
										</media-slider-track>
										<media-slider-thumb
											class={[
												'absolute bottom-[var(--media-slider-fill,0%)] left-1/2 h-[9px] w-[18px] transform-[translate(-50%,50%)] rounded-none',
												'border border-solid border-(--br-lo) bg-(--br-face) group-hover/volume:bg-(--br-page)',
												'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-1',
												'forced-colors:border-[CanvasText] forced-colors:bg-[ButtonFace] forced-colors:forced-color-adjust-none'
											]}
										></media-slider-thumb>
									</media-volume-slider>
								</div>
							</media-volume-popover>
						</div>

						<!-- the time: data, in its own page-colored <td>, in Courier -->
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
										'media-xs:hidden focus-visible:outline-blue cursor-pointer rounded-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
										'data-disabled:cursor-not-allowed data-disabled:opacity-40 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
									]}
								></media-time>
								<media-time
									type="current"
									class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time>
								<media-time-separator
									class="media-xs:inline hidden text-(--br-lo) data-unavailable:opacity-50"
								></media-time-separator>
								<media-time
									type="duration"
									class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time>
							</media-time-group>
						</div>

						<div class={[cell, 'media-max-3xs:hidden']}>
							<media-captions-button
								id={id('captions')}
								class={[
									button,
									'group/captions',
									// an active toggle stays "down": page-colored, like an expanded control
									'data-active:bg-(--br-page)'
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
							<button
								type="button"
								commandfor={id('menu')}
								id={id('settings')}
								class={[button, 'px-[8px]']}
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
								The menu is its own raised table, 2px above the strip and aligned to the gear cell's
								end. Video.js clamps (never flips) a popup that doesn't fit, which would slide it off
								that edge, so its width is capped at the room it has; its 1px borders sit outside
								--media-menu-width, so that's 2px less.
							-->
							<media-menu
								id={id('menu')}
								side="top"
								align="end"
								class={[
									popup,
									panel,
									sans,
									'z-20 m-0 box-content overflow-hidden! p-0 text-[13px]',
									'max-w-[calc(var(--media-menu-available-width,100cqw)-2px)] min-w-[min(--spacing(56),calc(var(--media-menu-available-width,100cqw)-2px))]',
									'[--media-popover-boundary-offset:0px]',
									'max-h-[min(var(--media-menu-available-height,--spacing(64)),--spacing(64))] overscroll-none',
									'h-(--media-menu-height) w-(--media-menu-width)',
									'transition-[opacity,width,height] duration-300 ease-out motion-reduce:duration-0'
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
											<!-- back is a nav-bar link: [ « Settings ], blue and underlined, red while active (ALINK) -->
											<media-menu-item
												class={[menuRow, 'min-h-0 w-auto gap-[4px]! self-start text-[12px]']}
											>
												<span aria-hidden="true">[</span>
												<span
													class={[
														'text-link underline underline-offset-2',
														'group-data-highlighted/menu-row:outline-blue group-data-highlighted/menu-row:outline-2 group-data-highlighted/menu-row:outline-offset-1',
														'group-active/menu-row:text-red forced-colors:text-[LinkText]'
													]}
												>
													<span aria-hidden="true">&laquo;</span>
													<media-text token="menu.settings">Settings</media-text>
												</span>
												<span aria-hidden="true">]</span>
											</media-menu-item>
											<media-menu-separator class={['block', hr]}></media-menu-separator>
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
					'group-data-max/volume-status:animate-[bas-relief-shake_300ms_linear] group-data-min/volume-status:animate-[bas-relief-shake_300ms_linear] motion-reduce:animate-none!'
				]}
			>
				<span class={[bannerCell, 'w-[5.4em] justify-center px-1']}>
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
					<media-volume-indicator-value class="tabular-nums"></media-volume-indicator-value>
				</span>
				<!-- a row of little cells, filled link blue up to the level -->
				<span
					class={[inset, 'media-max-md:w-[66px] relative flex w-[126px] items-stretch p-[3px]']}
				>
					<span class="relative block w-full bg-(--br-face)">
						<span
							class="absolute inset-y-0 left-0 w-(--media-volume-fill,0%) bg-(--br-mark) forced-colors:bg-[Highlight]"
						></span>
						<span
							class="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_4px,var(--br-page)_4px_6px)]"
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
				{#each statusIcons as { name, show } (name)}
					<media-icon family="scaffold" {name} class={['hidden size-[20px] shrink-0', show]}
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
				'data-[direction=forward]:transform-[rotate(1deg)] data-[direction=forward]:[--bas-relief-stamp-tilt:5deg]'
			]}
		>
			<span
				class={[
					bannerCell,
					'gap-[6px] group-data-[direction=backward]/seek-status:flex-row-reverse'
				]}
			>
				<media-seek-indicator-value class="tabular-nums"></media-seek-indicator-value>
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
	@keyframes -global-bas-relief-stamp {
		0% {
			opacity: 0;
			transform: scale(1.45) rotate(var(--bas-relief-stamp-tilt, -5deg));
		}
		45% {
			opacity: 1;
			transform: scale(0.96) rotate(0deg);
		}
		70% {
			transform: scale(1.02) rotate(-1.5deg);
		}
	}

	/* Volume can't go further: the stamp rattles in place. */
	@keyframes -global-bas-relief-shake {
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
