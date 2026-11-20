<!--
	Lab skin: netscape. Forked from $lib/videojs/scaffold/ScaffoldSkin.svelte.
	Plain Windows 95 / Netscape Navigator chrome (silver bevelled buttons, a navy title bar, a
	status bar) with the craft spent on the time slider: a `<table border=1>` of chapter cells,
	each a sunken progress groove whose fill is drawn as whole navy blocks (the fill width is
	snapped to the block pitch with CSS `round()`), a dithered buffer, a framed thumbnail with a
	Times caption, and a stepped Netscape-style throbber while buffering.
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

	// == fonts ==
	// Spelled out because the site's `font-sans`/`font-serif` resolve to Tailwind's defaults.
	const sans = "font-['Helvetica',Arial,sans-serif]";
	const serif = "font-['Times','Times_New_Roman',serif]";

	// == bevels (Windows 95 two-tone borders, drawn as inset box-shadows so they take no space) ==
	const raised =
		'shadow-[inset_-1px_-1px_0_var(--color-black),inset_1px_1px_0_var(--color-white),inset_-2px_-2px_0_var(--color-gray),inset_2px_2px_0_var(--color-gainsboro)]';
	/** One-pixel `<table border=1>` edges: the table is raised, its cells are sunken. */
	const tableEdge =
		'shadow-[inset_1px_1px_0_var(--color-white),inset_-1px_-1px_0_var(--color-gray)]';
	const cellEdge =
		'shadow-[inset_1px_1px_0_var(--color-gray),inset_-1px_-1px_0_var(--color-white)]';
	const focusRing =
		'outline-none focus-visible:outline-1 focus-visible:outline-offset-[-5px] focus-visible:outline-dotted';

	// == shared classes ==
	const button = [
		'relative grid size-8 shrink-0 cursor-default place-items-center rounded-none bg-silver p-0 text-black',
		raised,
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[3px] pointer-coarse:before:content-['']",
		// pressed while held, while its popup is open, and while latched on
		'active:pt-px active:pl-px aria-expanded:pt-px aria-expanded:pl-px',
		'active:shadow-[inset_1px_1px_0_var(--color-black),inset_-1px_-1px_0_var(--color-white),inset_2px_2px_0_var(--color-gray),inset_-2px_-2px_0_var(--color-gainsboro)]',
		'aria-expanded:shadow-[inset_1px_1px_0_var(--color-black),inset_-1px_-1px_0_var(--color-white),inset_2px_2px_0_var(--color-gray),inset_-2px_-2px_0_var(--color-gainsboro)]',
		focusRing,
		'aria-disabled:cursor-not-allowed aria-disabled:text-gray disabled:cursor-not-allowed disabled:text-gray',
		'forced-colors:border forced-colors:border-solid forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]',
		'forced-colors:forced-color-adjust-none',
		'forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText] forced-colors:focus-visible:bg-[Highlight] forced-colors:focus-visible:text-[HighlightText]',
		'forced-colors:aria-expanded:bg-[Highlight] forced-colors:aria-expanded:text-[HighlightText] forced-colors:aria-disabled:text-[GrayText] forced-colors:aria-disabled:opacity-100',
		'data-hidden:hidden'
	];
	/** Latched-on toggles (muted, captions) stay pushed in, with the dithered face Windows used. */
	const latchedMuted = [
		'data-muted:pt-px data-muted:pl-px data-muted:bg-size-[2px_2px]',
		'data-muted:shadow-[inset_1px_1px_0_var(--color-black),inset_-1px_-1px_0_var(--color-white),inset_2px_2px_0_var(--color-gray),inset_-2px_-2px_0_var(--color-gainsboro)]',
		'data-muted:bg-[repeating-conic-gradient(var(--color-silver)_0_25%,var(--color-white)_0_50%)]'
	];
	const latchedCaptions = [
		'data-active:pt-px data-active:pl-px data-active:bg-size-[2px_2px]',
		'data-active:shadow-[inset_1px_1px_0_var(--color-black),inset_-1px_-1px_0_var(--color-white),inset_2px_2px_0_var(--color-gray),inset_-2px_-2px_0_var(--color-gainsboro)]',
		'data-active:bg-[repeating-conic-gradient(var(--color-silver)_0_25%,var(--color-white)_0_50%)]'
	];
	const titleButton = 'size-6! [&>media-icon]:size-4';
	const centerSeek = [
		'hidden size-9! pointer-fine:grid media-max-360:hidden! group-not-data-started/controls:hidden!'
	];
	const icon = 'col-start-1 row-start-1 size-4.5';
	const popup = [
		'm-0 overflow-visible border-0 text-inherit',
		'data-[side=top]:origin-bottom data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left',
		'before:pointer-events-auto before:absolute',
		'data-[side=top]:before:inset-x-0 data-[side=top]:before:top-full',
		'data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:bottom-full',
		'data-[side=left]:before:inset-y-0 data-[side=left]:before:left-full',
		'data-[side=right]:before:inset-y-0 data-[side=right]:before:right-full',
		'data-[side=top]:before:h-(--media-popup-side-offset) data-[side=bottom]:before:h-(--media-popup-side-offset)',
		'data-[side=left]:before:w-(--media-popup-side-offset) data-[side=right]:before:w-(--media-popup-side-offset)',
		'forced-colors:outline'
	];
	/** Classic yellow tooltip with a hairline black border. Pops in, no fade. */
	const tooltipPopup = [
		popup,
		sans,
		'pointer-events-none z-20 whitespace-nowrap rounded-none border! border-solid border-black bg-[#ffffe1] px-1 py-px text-xs leading-4 text-black',
		'shadow-none [--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:calc(var(--media-spacing)*10)]',
		'data-open:flex data-open:items-center data-open:gap-1.5'
	];
	const screenTooltipPopup = [
		tooltipPopup,
		'[--media-tooltip-side-offset:calc(var(--media-spacing)*2)]!'
	];
	const tooltipShortcut = [
		'min-w-[1.5em] border border-solid border-gray px-0.5 text-center text-[11px] leading-3.5',
		"font-['Courier_New',monospace]"
	];
	const indicator = [
		'pointer-events-none flex items-center gap-2 rounded-none bg-silver px-2.5 py-1 text-black',
		raised,
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	const menuRow = [
		'flex cursor-default items-center gap-2 whitespace-nowrap rounded-none min-h-7 w-full shrink-0 bg-silver px-2 py-0 text-start text-black',
		'focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-dotted focus-visible:outline-current',
		'data-highlighted:bg-navy data-highlighted:text-white',
		'forced-colors:data-highlighted:highlight-media'
	];
	const menuTrigger = [
		menuRow,
		'data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden'
	];
	const menuContent = [
		'absolute max-h-full overflow-auto overscroll-none outline-hidden',
		'[clip-path:inset(0)]',
		'flex flex-col gap-0 p-[3px] not-data-submenu:inset-x-0 not-data-submenu:top-0',
		'not-data-submenu:data-child-open:transform-[translateX(-100%)]',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(100%)]',
		'not-data-submenu:data-child-open:[clip-path:inset(0_0_0_100%)] not-data-submenu:data-child-open:rtl:[clip-path:inset(0_100%_0_0)]',
		'data-submenu:inset-x-0 data-submenu:top-0 data-submenu:z-10'
	];
	const radioItem = [
		'group/menu-radio flex cursor-default items-center gap-2 rounded-none min-h-7 w-full shrink-0 bg-silver px-2 py-0 text-black',
		'focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-dotted focus-visible:outline-current',
		'data-highlighted:bg-navy data-highlighted:text-white',
		'forced-colors:data-highlighted:highlight-media',
		'data-custom:italic'
	];
	const menuHint = 'ms-auto inline-flex min-w-0 items-center gap-1 ps-4';
	const menuBadge = [
		'px-1 text-[10px] leading-3.5 font-bold',
		cellEdge,
		'group-data-highlighted/menu-radio:shadow-[inset_0_0_0_1px_var(--color-white)]'
	];
	const menuIcon = 'size-4 shrink-0';
	/** A sunken status-bar pane. */
	const statusPane = [
		'flex h-6 min-w-0 items-center px-1.5 text-xs leading-none whitespace-nowrap',
		cellEdge
	];

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
				'absolute bottom-[calc(var(--media-spacing)*-0.75)] text-[calc(var(--media-spacing)*2.25)] font-bold tabular-nums',
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
			: 'size-3.5 shrink-0 rtl:transform-[scaleX(-1)]'}
	></media-icon>
{/snippet}

{#snippet throbber()}
	<!-- The Navigator throbber: a navy tile, a serif N, and a starfield that streams past in steps. -->
	<div class={['bg-silver grid place-items-center gap-1.5 p-1.5 pb-1 text-black', raised]}>
		<div class={['bg-navy relative grid size-12 place-items-center overflow-hidden', cellEdge]}>
			<div
				class="ns-starfield absolute inset-0 motion-safe:animate-[ns-starfield_0.8s_steps(8)_infinite]"
			></div>
			<span
				class={[
					serif,
					'relative text-[40px] leading-none font-bold text-white [text-shadow:2px_2px_0_var(--color-black)]'
				]}
			>
				N
			</span>
		</div>
		<span class={[sans, 'text-[11px] leading-none']}>Buffering&hellip;</span>
	</div>
{/snippet}

<media-container
	class={[
		'media-skin',
		sans,
		'@container/media-root relative block h-full w-full overflow-hidden rounded-none text-[13px] leading-4 text-black [--spacing:var(--media-spacing)]',
		'[--media-accent:var(--color-navy)] [--media-background:var(--color-silver)] [--media-foreground:var(--color-black)]',
		'[--media-popover-foreground:var(--color-black)] [--media-popover:var(--color-silver)] [--media-ring:var(--color-black)]',
		'forced-colors:[--media-accent:Highlight] forced-colors:[--media-background:Canvas] forced-colors:[--media-foreground:CanvasText]',
		'forced-colors:[--media-popover-foreground:CanvasText] forced-colors:[--media-popover:Canvas]',
		'focus-visible:outline-blue outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
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

	<!-- error dialog, as a Windows message box -->
	<media-error-dialog>
		<media-dialog-backdrop
			class="absolute inset-0 z-40 bg-black/60 not-data-open:hidden data-[scope=document]:fixed"
		></media-dialog-backdrop>
		<media-dialog-popup
			class={[
				'bg-silver absolute top-1/2 left-1/2 z-50 grid max-h-[calc(100%-var(--media-spacing)*8)] w-[calc(100%-var(--media-spacing)*8)] max-w-80 transform-[translate(-50%,-50%)] gap-3 overflow-auto rounded-none p-1 pb-3 text-black not-data-open:hidden',
				raised,
				'data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-var(--media-spacing)*8)]',
				'outline-none focus-visible:outline-1 focus-visible:outline-offset-[-4px] focus-visible:outline-dotted',
				'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]'
			]}
		>
			<media-dialog-title
				class="bg-navy block px-1.5 py-1 text-[13px] leading-4 font-bold text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]"
			></media-dialog-title>
			<media-dialog-description class="px-3 text-[13px] leading-5"></media-dialog-description>
			<media-dialog-close class={[button, 'me-2 h-6 w-auto min-w-18 justify-self-end px-3']}
			></media-dialog-close>
		</media-dialog-popup>
	</media-error-dialog>

	<media-controls>
		<!-- buffering, while controls are hidden -->
		<media-controls-group class="group/buffering-controls contents">
			<media-buffering-indicator
				class="pointer-events-none absolute inset-0 z-40 grid place-items-center not-data-visible:hidden group-not-data-visible/buffering-controls:bg-black/40 forced-colors:bg-transparent!"
			>
				{@render throbber()}
			</media-buffering-indicator>
		</media-controls-group>

		<media-controls-content class="group/controls pointer-events-none absolute inset-0 z-30">
			<media-tooltip-group>
				<!-- top: a title bar, with the screen controls as its window buttons -->
				<media-controls-group
					class={[
						'bg-navy pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-end gap-0.5 py-1 ps-2 pe-1 text-white group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
						'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]',
						'group-not-data-visible/controls:opacity-0',
						'not-data-started:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<media-title
						class="media-max-3xs:hidden pointer-events-none min-w-0 flex-1 truncate font-bold not-data-visible:opacity-0"
					></media-title>

					<media-airplay-button id={id('airplay')} class={[button, titleButton, 'group/airplay']}>
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

					<media-cast-button id={id('cast')} class={[button, titleButton, 'group/cast']}>
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

					<media-pip-button id={id('pip')} class={[button, titleButton, 'group/pip']}>
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

					<media-fullscreen-button
						id={id('fullscreen')}
						class={[button, titleButton, 'group/fullscreen']}
					>
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
							'group-not-data-visible/controls:opacity-0 group-data-visible/center-buffering:hidden!'
						]}
					>
						<media-seek-button seconds={-10} id={id('center-back')} class={[button, centerSeek]}>
							{@render seekContent(-10)}
						</media-seek-button>
						{@render tooltip('center-back', { disabled: true })}

						<media-play-button
							id={id('center-play')}
							class={[button, 'group/play media-max-360:size-11! size-14!']}
						>
							{@render playIcons('size-7! media-max-360:size-5.5!')}
						</media-play-button>
						{@render tooltip('center-play', { disabled: true })}

						<media-seek-button seconds={10} id={id('center-forward')} class={[button, centerSeek]}>
							{@render seekContent(10)}
						</media-seek-button>
						{@render tooltip('center-forward', { disabled: true })}
					</media-controls-group>
				</media-buffering-indicator>

				<!-- bottom: the progress bar and a status bar -->
				<div
					class={[
						'bg-silver pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-1.5 group-not-data-visible/controls:pointer-events-none',
						raised,
						'forced-colors:bg-[Canvas]',
						'group-not-data-visible/controls:opacity-0',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)] forced-colors:inset-x-0 forced-colors:bottom-0'
					]}
				>
					<!--
						The time slider is a one-row <table border=1 cellspacing=2>: a raised frame holding one
						sunken cell per chapter. Each cell is a progress groove; fill is navy blocks, buffer is a
						50% dither. The block fill's width is rounded to the 10px block pitch so it only ever
						grows by whole blocks, like a download dialog (the thumb, which tracks exactly, only
						shows while you point at or focus the slider).
					-->
					<media-time-slider
						thumb-alignment="edge"
						class={[
							'group/slider relative flex h-6 w-full min-w-12 cursor-default items-center',
							'data-disabled:cursor-not-allowed data-disabled:opacity-60 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
						]}
					>
						<media-time-slider-chapters
							class={['bg-silver relative block size-full forced-colors:border', tableEdge]}
						>
							<template>
								<div
									class={[
										'clip-media-chapter-x absolute inset-0.5',
										'[--media-chapter-inset-end:0.25] [--media-chapter-inset-start:0.25]',
										'first-of-type:[--media-chapter-inset-start:0] last-of-type:[--media-chapter-inset-end:0]'
									]}
								>
									<media-slider-track
										class={[
											'absolute inset-0 isolate block',
											// the chapter cell's left and right edges, from the left and right of the track
											'[--ns-l:calc(var(--media-slider-chapter-start,0%)+var(--media-spacing)*var(--media-chapter-inset-start,0))]',
											'[--ns-r:calc(100%-var(--media-slider-chapter-end,100%)+var(--media-spacing)*var(--media-chapter-inset-end,0))]',
											'before:clip-media-chapter-track-x before:absolute before:inset-y-0 before:bg-white',
											'before:shadow-[inset_1px_1px_0_var(--color-gray),inset_-1px_-1px_0_var(--color-white)]',
											'forced-colors:before:bg-[Canvas] forced-colors:before:forced-color-adjust-none',
											'forced-colors:before:border forced-colors:before:border-solid forced-colors:before:border-[CanvasText]'
										]}
									>
										<media-slider-buffer
											class={[
												'absolute inset-y-px right-[max(calc(100%-var(--media-slider-buffer,0%)),calc(var(--ns-r)+1px))] left-[calc(var(--ns-l)+1px)] block',
												'bg-[repeating-conic-gradient(var(--color-darkgray)_0_25%,transparent_0_50%)] bg-size-[2px_2px]',
												'forced-colors:forced-color-adjust-none',
												'forced-colors:bg-[repeating-linear-gradient(135deg,CanvasText_0px,CanvasText_1px,Canvas_1px,Canvas_3px)]'
											]}
										></media-slider-buffer>
										<media-slider-fill
											class={[
												'absolute inset-y-px block border-y-2 border-solid border-white',
												'[--ns-v:var(--media-slider-fill,0%)] group-data-dragging/slider:[--ns-v:var(--media-slider-pointer,0%)]',
												'left-[calc(var(--ns-l)+1px)]',
												// snap the width to whole 10px blocks, never past the cell's padding
												'right-[max(calc(100%-var(--ns-l)-1px-round(calc(var(--ns-v)-var(--ns-l)-1px),10px)),calc(var(--ns-r)+1px))]',
												'bg-[repeating-linear-gradient(to_right,var(--color-white)_0_2px,var(--color-navy)_2px_10px)]',
												'forced-colors:forced-color-adjust-none',
												'forced-colors:bg-[repeating-linear-gradient(to_right,Canvas_0_2px,Highlight_2px_10px)]'
											]}
										></media-slider-fill>
									</media-slider-track>
								</div>
							</template>
						</media-time-slider-chapters>
						<!-- a trackbar thumb, shown while pointing, dragging or focused -->
						<media-slider-thumb
							class={[
								'bg-silver absolute left-[var(--media-slider-fill,0%)] h-7 w-3 transform-[translateX(-50%)] rounded-none',
								raised,
								'group-data-dragging/slider:left-(--media-slider-pointer)',
								'opacity-0 group-data-dragging/slider:opacity-100 group-data-pointing/slider:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100',
								'outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted',
								'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none',
								'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]'
							]}
						></media-slider-thumb>
						<!-- the preview: a framed snapshot with a Times caption -->
						<media-slider-preview
							class={[
								'bg-silver pointer-events-none bottom-[calc(100%+var(--media-spacing)*3)] grid max-w-[calc(var(--spacing)*39+8px)] origin-bottom justify-items-center gap-1 p-1',
								raised,
								'opacity-0 group-data-disabled/slider:hidden',
								'group-data-pointing/slider:opacity-100',
								'group-data-dragging/slider:opacity-100'
							]}
						>
							<media-slider-thumbnail
								class={[
									'block max-w-39 overflow-hidden rounded-none bg-black',
									'shadow-[0_0_0_1px_var(--color-gray),1px_1px_0_1px_var(--color-white)]'
								]}
							>
								<img alt="" aria-hidden="true" decoding="async" class="block" />
							</media-slider-thumbnail>
							<div
								class={[
									serif,
									'flex w-full min-w-0 justify-center px-1 pt-0.5 text-sm leading-4 text-black'
								]}
							>
								<div class="flex max-w-full min-w-0 items-baseline gap-1.5">
									<media-slider-value type="pointer" class="shrink-0 tabular-nums"
									></media-slider-value>
									<media-time-slider-chapter-title
										class="min-w-0 truncate italic before:not-italic before:content-['—_'] empty:hidden"
									></media-time-slider-chapter-title>
								</div>
							</div>
						</media-slider-preview>
					</media-time-slider>

					<media-controls-group class="flex items-center gap-1 rtl:flex-row-reverse">
						<media-play-button id={id('play')} class={[button, 'group/play']}>
							{@render playIcons()}
						</media-play-button>
						{@render tooltip('play')}

						<media-mute-button
							commandfor={id('volume')}
							id={id('mute')}
							class={[button, 'group/mute', latchedMuted]}
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
								'bg-silver z-20 h-28 w-8 rounded-none px-1.5 py-2',
								raised,
								'[--media-popover-side-offset:calc(var(--media-spacing)*10)] [--media-popup-side-offset:var(--media-popover-side-offset)]'
							]}
						>
							<media-volume-slider
								orientation="vertical"
								thumb-alignment="edge"
								class="relative flex size-full cursor-default justify-center data-disabled:cursor-not-allowed data-disabled:opacity-60"
							>
								<media-slider-track
									class={[
										'absolute inset-y-0 left-1/2 block w-3 transform-[translateX(-50%)] overflow-hidden rounded-none bg-white',
										cellEdge,
										'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:forced-color-adjust-none'
									]}
								>
									<media-slider-fill
										class={[
											'absolute inset-x-0.5 bottom-0.5 block h-[max(0px,calc(var(--media-slider-fill,0%)-4px))] rounded-none',
											'bg-[repeating-linear-gradient(to_top,var(--color-navy)_0_4px,transparent_4px_6px)]',
											'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none'
										]}
									></media-slider-fill>
								</media-slider-track>
								<media-slider-thumb
									class={[
										'bg-silver absolute bottom-[var(--media-slider-fill,0%)] left-1/2 h-2.5 w-5 transform-[translate(-50%,50%)] rounded-none',
										raised,
										'outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted',
										'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none',
										'forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]'
									]}
								></media-slider-thumb>
							</media-volume-slider>
						</media-volume-popover>

						<!-- status bar: what the browser is doing, then the time -->
						<div aria-hidden="true" class={[statusPane, 'media-max-xs:invisible ms-1 flex-1']}>
							<span
								class="hidden truncate [media-controls-content:not(:has(media-play-button[data-started])):not(:has(media-buffering-indicator[data-visible]))_&]:inline"
							>
								Ready.
							</span>
							<span
								class="hidden truncate [media-controls-content:has(media-buffering-indicator[data-visible])_&]:inline"
							>
								Host contacted. Waiting for reply&hellip;
							</span>
							<span
								class="hidden truncate [media-controls-content:has(media-play-button[data-started]:not([data-paused]):not([data-ended])):not(:has(media-buffering-indicator[data-visible]))_&]:inline"
							>
								Playing&hellip;
							</span>
							<span
								class="hidden truncate [media-controls-content:has(media-play-button[data-started][data-paused]:not([data-ended])):not(:has(media-buffering-indicator[data-visible]))_&]:inline"
							>
								Paused.
							</span>
							<span
								class="hidden truncate [media-controls-content:has(media-play-button[data-ended]):not(:has(media-buffering-indicator[data-visible]))_&]:inline"
							>
								Document: Done
							</span>
						</div>
						<media-time-group
							class={[statusPane, 'shrink-0 gap-1 tabular-nums rtl:flex-row-reverse']}
						>
							<media-time
								type="current"
								toggle
								class={[
									'media-xs:hidden cursor-default rounded-none outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted',
									'data-disabled:cursor-not-allowed data-disabled:opacity-60 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
								]}
							></media-time>
							<media-time type="current" class="media-xs:inline data-unavailable:text-gray hidden"
							></media-time>
							<media-time-separator class="media-xs:inline data-unavailable:text-gray hidden"
							></media-time-separator>
							<media-time type="duration" class="media-xs:inline data-unavailable:text-gray hidden"
							></media-time>
						</media-time-group>

						<media-captions-button
							id={id('captions')}
							class={[button, 'group/captions media-max-3xs:hidden ms-1', latchedCaptions]}
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

						<media-menu
							id={id('menu')}
							side="top"
							align="end"
							class={[
								popup,
								'bg-silver z-20 m-0 max-w-(--media-menu-available-width) min-w-44 overflow-hidden! rounded-none p-0 text-black',
								// the bevel is drawn over the scrolling content so items never cover it
								'after:pointer-events-none after:absolute after:inset-0 after:z-20',
								'after:shadow-[inset_-1px_-1px_0_var(--color-black),inset_1px_1px_0_var(--color-white),inset_-2px_-2px_0_var(--color-gray),inset_2px_2px_0_var(--color-gainsboro)]',
								'[--media-popover-side-offset:calc(var(--media-spacing)*10)] [--media-popup-side-offset:var(--media-popover-side-offset)]',
								'max-h-[min(var(--media-menu-available-height,--spacing(56)),--spacing(56))] overscroll-none',
								'h-(--media-menu-height) w-(--media-menu-width)'
							]}
						>
							<media-menu-content class={menuContent}>
								{#each submenus as submenu (submenu.key)}
									{@const label = menuLabels[submenu.key]}
									{@const contentId = id(`menu-${submenu.key}`)}
									<media-menu-item commandfor={contentId} class={menuTrigger}>
										<media-icon family="scaffold" name={submenu.icon} class={menuIcon}></media-icon>
										<media-text token="menu.{submenu.key}">{label}</media-text>
										<span class={menuHint}>
											<span data-part="value" class="max-w-24 truncate"></span>
											{@render chevron()}
										</span>
									</media-menu-item>
									<media-menu-content id={contentId} class={menuContent}>
										<media-menu-item class={[menuRow, 'font-bold']}>
											{@render chevron(true)}
											<media-text token="menu.{submenu.key}">{label}</media-text>
										</media-menu-item>
										<!-- an etched rule, as in every Windows menu -->
										<media-menu-separator
											class="border-t-gray mx-0.5 my-[3px] block h-0.5 shrink-0 border-t border-b border-solid border-b-white"
										></media-menu-separator>
										<svelte:element this={submenu.group} class="flex flex-col">
											<template>
												<media-menu-radio-item class={radioItem}>
													<!-- the radio bullet sits in the left gutter, Windows-style -->
													<media-menu-item-indicator
														force-mount
														class="grid size-3.5 shrink-0 place-items-center opacity-0 group-aria-checked/menu-radio:opacity-100"
													>
														<span class="size-1.5 rounded-full bg-current"></span>
													</media-menu-item-indicator>
													{#if submenu.key === 'quality'}
														<span>
															<span data-part="label"></span>
															<sup
																data-part="tier"
																class="ps-0.5 pt-px text-[10px] leading-none empty:hidden"
															></sup>
														</span>
													{:else}
														<span data-part="label"></span>
													{/if}
													{#if submenu.key === 'quality' || submenu.key === 'captions'}
														<span data-part="badge" class={[menuBadge, 'ms-auto empty:hidden']}
														></span>
													{/if}
												</media-menu-radio-item>
											</template>
										</svelte:element>
									</media-menu-content>
								{/each}
							</media-menu-content>
						</media-menu>
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
			class={[indicator, 'group/volume-status col-start-2 row-start-1 mt-11 self-start']}
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
			class={[indicator, 'group/input-status col-start-2 row-start-1 mt-11 self-start']}
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

<style>
	/* A 40px tile of pixel stars; the throbber scrolls it one tile diagonally in 8 hard steps. */
	.ns-starfield {
		background-image:
			radial-gradient(circle at 6px 9px, white 1px, transparent 1.5px),
			radial-gradient(circle at 27px 4px, white 0.75px, transparent 1.25px),
			radial-gradient(circle at 18px 22px, aqua 1px, transparent 1.5px),
			radial-gradient(circle at 34px 31px, white 1.25px, transparent 1.75px),
			radial-gradient(circle at 11px 35px, white 0.75px, transparent 1.25px),
			radial-gradient(circle at 30px 15px, white 0.75px, transparent 1.25px),
			radial-gradient(circle at 2px 24px, aqua 0.75px, transparent 1.25px);
		background-size: 40px 40px;
	}
	/* Global so Tailwind's `animate-[ns-starfield_…]` (generated outside this component) can name it. */
	@keyframes -global-ns-starfield {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -40px 40px;
		}
	}
</style>
