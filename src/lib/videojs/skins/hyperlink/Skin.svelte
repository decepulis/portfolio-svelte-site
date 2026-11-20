<!--
	Lab skin: hyperlink. Forked from $lib/videojs/scaffold/ScaffoldSkin.svelte.

	Every control is a bracketed text link, HTML 3.2 style: [Play] [Mute] [CC] [Settings].
	The time slider is the control row's underline. Played time is a "visited" link (purple),
	buffered time is an unvisited link (blue), and the rest is a dotted not-yet-loaded line. Point
	at it and it goes wavy like every other link on the site; press it and it turns the classic
	active red.
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
	const serif = "font-[Times,'Times_New_Roman',serif]";
	const mono = "font-['Courier_New',Courier,monospace]";
	// A plain white page-like surface (the site's dark theme is a gainsboro page, not black).
	const paper = 'bg-white text-black dark:bg-gainsboro';
	// A `<table border=1>` box.
	const box = [paper, 'border border-solid border-black'];
	// Classic dotted focus rectangle.
	const focusRing =
		'outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted focus-visible:outline-black';

	// Buttons are links: blue, underlined, wavy on hover (like the rest of the site), red while pressed.
	const button = [
		'relative inline-flex h-8 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-none bg-transparent p-0 text-link',
		"pointer-coarse:before:absolute pointer-coarse:before:-inset-[3px] pointer-coarse:before:content-['']",
		'hover:decoration-wavy focus-visible:decoration-wavy aria-expanded:decoration-wavy active:text-red',
		focusRing,
		'aria-disabled:cursor-not-allowed aria-disabled:text-gray disabled:cursor-not-allowed disabled:text-gray',
		'forced-colors:text-[LinkText] forced-colors:active:text-[ActiveText]',
		'forced-colors:aria-disabled:text-[GrayText] forced-colors:disabled:text-[GrayText]',
		'data-hidden:hidden'
	];
	// Underline lives on the label only, so the brackets stay plain black.
	const linkLabel = 'underline decoration-1 underline-offset-2 [text-decoration-style:inherit]';
	const centerButton = [
		box,
		'm-0! px-3! h-auto! py-1! shadow-[2px_2px_0_black] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0_black]',
		'motion-reduce:active:translate-0'
	];
	const centerSeek = [
		centerButton,
		'hidden! pointer-fine:inline-flex! media-max-360:hidden! group-not-data-started/controls:hidden!'
	];
	const popup = [
		'm-0 overflow-visible text-inherit',
		'transition-[opacity,transform] duration-media-fast ease-out motion-reduce:transition-none',
		'media-transitioning:opacity-0',
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
		'forced-colors:outline'
	];
	// Old system tooltips: light yellow, 1px black border, small sans.
	const tooltipPopup = [
		popup,
		'pointer-events-none z-20 whitespace-nowrap rounded-none border border-solid border-black bg-[lightyellow] px-1.5 py-0.5 font-sans text-[12px] text-black',
		'shadow-none [--media-popup-side-offset:var(--media-tooltip-side-offset)] [--media-tooltip-side-offset:calc(var(--media-spacing)*12)]',
		'data-open:flex data-open:items-center data-open:gap-1'
	];
	const screenTooltipPopup = [
		tooltipPopup,
		'[--media-tooltip-side-offset:calc(var(--media-spacing)*2)]!'
	];
	const tooltipShortcut = [mono, "text-[12px] before:content-['('] after:content-[')']"];
	const indicator = [
		box,
		mono,
		'pointer-events-none flex items-center gap-2 rounded-none px-2 py-0.5 text-[13px]',
		'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]'
	];
	// Menu rows highlight like a Windows 3.1 menu: navy with white text.
	const menuHighlight =
		'data-highlighted:bg-navy data-highlighted:text-white data-highlighted:outline-none forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText]';
	const menuRow = [
		'flex cursor-pointer items-baseline gap-1.5 whitespace-nowrap rounded-none min-h-7 w-full shrink-0 bg-transparent px-2 py-1 text-start',
		focusRing,
		'focus-visible:outline-offset-[-2px]',
		menuHighlight
	];
	const menuTrigger = [
		menuRow,
		'data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden'
	];
	const menuLink =
		'text-link underline decoration-1 underline-offset-2 in-data-highlighted:text-white forced-colors:text-[LinkText]';
	const menuContent = [
		'absolute max-h-full overflow-auto overscroll-none outline-hidden',
		'[clip-path:inset(0)]',
		'flex flex-col p-1 not-data-submenu:inset-x-0 not-data-submenu:top-0',
		'not-data-submenu:data-child-open:transform-[translateX(-100%)]',
		'not-data-submenu:data-child-open:rtl:transform-[translateX(100%)]',
		'not-data-submenu:data-child-open:[clip-path:inset(0_0_0_100%)] not-data-submenu:data-child-open:rtl:[clip-path:inset(0_100%_0_0)]',
		'data-submenu:inset-x-0 data-submenu:top-0 data-submenu:z-10'
	];
	// Radio items: a bulleted list of links. The current one is bold black and not a link.
	const radioItem = [
		'group/menu-radio flex cursor-pointer items-baseline gap-1.5 rounded-none min-h-7 w-full shrink-0 bg-transparent px-2 py-1',
		focusRing,
		'focus-visible:outline-offset-[-2px]',
		menuHighlight,
		'data-custom:italic'
	];
	const menuBadge = [mono, 'text-[11px] uppercase opacity-80'];

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

<!-- `[label]`, where the label may be several state-dependent spans; brackets are decorative. -->
{#snippet link(label: Snippet)}
	<span aria-hidden="true" class="text-black forced-colors:text-[CanvasText]">[</span><span
		class={linkLabel}>{@render label()}</span
	><span aria-hidden="true" class="text-black forced-colors:text-[CanvasText]">]</span>
{/snippet}

{#snippet playLabels(glyphs = false)}
	<span class="hidden group-data-ended/play:inline"
		>{#if glyphs}<span aria-hidden="true" class="no-underline">&#x21BA;&#xFE0E;&nbsp;</span
			>{/if}Replay</span
	>
	<span
		class="hidden group-not-data-ended/play:group-not-data-started/play:inline group-not-data-ended/play:group-data-paused/play:inline"
		>{#if glyphs}<span aria-hidden="true">&#x25B6;&#xFE0E;&nbsp;</span>{/if}Play</span
	>
	<span
		class="hidden group-data-started/play:group-not-data-paused/play:group-not-data-ended/play:inline"
		>{#if glyphs}<span aria-hidden="true">&#x2016;&nbsp;</span>{/if}Pause</span
	>
{/snippet}

<media-container
	class={[
		'media-skin hyperlink-skin',
		'rounded-media-player text-media-foreground @container/media-root relative block h-full w-full overflow-hidden text-[15px] leading-tight',
		serif,
		'[--media-accent:var(--color-link)] [--media-popover-foreground:black] [--media-popover:white] [--media-ring:black]',
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

	<!-- error dialog: a plain alert box -->
	<media-error-dialog>
		<media-dialog-backdrop
			class="absolute inset-0 z-40 bg-black/70 not-data-open:hidden data-[scope=document]:fixed"
		></media-dialog-backdrop>
		<media-dialog-popup
			class={[
				box,
				'absolute top-1/2 left-1/2 z-50 grid max-h-[calc(100%-var(--media-spacing)*8)] w-[calc(100%-var(--media-spacing)*8)] max-w-80 transform-[translate(-50%,-50%)] gap-3 overflow-auto rounded-none p-5 not-data-open:hidden',
				'shadow-[3px_3px_0_black]',
				'data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-var(--media-spacing)*8)]',
				focusRing,
				'forced-colors:border-[CanvasText]'
			]}
		>
			<media-dialog-title class="text-xl leading-7 font-bold"></media-dialog-title>
			<media-dialog-description class="text-[15px]"></media-dialog-description>
			<media-dialog-close
				class={[
					button,
					'justify-self-end underline decoration-1 underline-offset-2',
					"before:text-black before:no-underline before:content-['['] after:text-black after:content-[']']"
				]}
			></media-dialog-close>
		</media-dialog-popup>
	</media-error-dialog>

	<media-controls>
		<!-- buffering, while controls are hidden -->
		<media-controls-group class="group/buffering-controls contents">
			<media-buffering-indicator
				class="pointer-events-none absolute inset-0 z-40 grid place-items-center not-data-visible:hidden"
			>
				<span class={[indicator, 'text-[14px]']}>Transferring data&hellip;</span>
			</media-buffering-indicator>
		</media-controls-group>

		<media-controls-content class="group/controls pointer-events-none absolute inset-0 z-30">
			<media-tooltip-group>
				<!-- top: title and casting -->
				<media-controls-group
					class={[
						'pointer-events-auto absolute inset-x-0 top-0 flex items-start justify-end gap-3 p-3 group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
						'duration-media-controls transition-opacity motion-reduce:transition-none',
						'group-not-data-visible/controls:opacity-0',
						'not-data-started:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<div class="media-max-3xs:hidden pointer-events-none min-w-0 flex-1">
						<media-title
							class={[
								box,
								'inline-block max-w-full truncate px-2 py-0.5 align-top font-bold',
								'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]',
								'not-data-visible:hidden'
							]}
						></media-title>
					</div>

					<div class={[box, 'flex gap-3 px-2 empty:hidden has-[>*:not([data-hidden])]:flex']}>
						<media-airplay-button id={id('airplay')} class={[button, 'group/airplay']}>
							{#snippet airplay()}
								<span class="group-data-[airplay-state=connected]/airplay:hidden">AirPlay</span>
								<span class="hidden group-data-[airplay-state=connected]/airplay:inline"
									>Stop AirPlay</span
								>
							{/snippet}
							{@render link(airplay)}
						</media-airplay-button>
						{@render tooltip('airplay', { class: screenTooltipPopup })}

						<media-cast-button id={id('cast')} class={[button, 'group/cast']}>
							{#snippet cast()}
								<span class="group-data-[cast-state=connected]/cast:hidden">Cast</span>
								<span class="hidden group-data-[cast-state=connected]/cast:inline"
									>Stop casting</span
								>
							{/snippet}
							{@render link(cast)}
						</media-cast-button>
						{@render tooltip('cast', { class: screenTooltipPopup })}
					</div>
				</media-controls-group>

				<!-- center: seek and play -->
				<media-buffering-indicator class="group/center-buffering contents">
					<media-controls-group
						class={[
							'pointer-events-auto absolute top-1/2 left-1/2 flex transform-[translate(-50%,-50%)] items-center gap-4 group-not-data-visible/controls:pointer-events-none rtl:flex-row-reverse',
							'duration-media-controls transition-opacity motion-reduce:transition-none',
							'group-not-data-visible/controls:opacity-0 group-data-visible/center-buffering:hidden!'
						]}
					>
						<media-seek-button seconds={-10} id={id('center-back')} class={[button, centerSeek]}>
							{#snippet back()}<span aria-hidden="true">&laquo;&nbsp;</span>10s{/snippet}
							{@render link(back)}
						</media-seek-button>
						{@render tooltip('center-back', { disabled: true })}

						<media-play-button
							id={id('center-play')}
							class={[
								button,
								centerButton,
								'group/play group-data-ended/play:text-visited media-max-360:text-xl text-3xl'
							]}
						>
							{#snippet centerPlay()}{@render playLabels(true)}{/snippet}
							{@render link(centerPlay)}
						</media-play-button>
						{@render tooltip('center-play', { disabled: true })}

						<media-seek-button seconds={10} id={id('center-forward')} class={[button, centerSeek]}>
							{#snippet forward()}10s<span aria-hidden="true">&nbsp;&raquo;</span>{/snippet}
							{@render link(forward)}
						</media-seek-button>
						{@render tooltip('center-forward', { disabled: true })}
					</media-controls-group>
				</media-buffering-indicator>

				<!-- bottom: a row of links, underlined by the time slider -->
				<div
					class={[
						paper,
						'pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col px-3 pt-0.5 pb-1.5 group-not-data-visible/controls:pointer-events-none',
						'border-t border-solid border-black',
						'duration-media-controls transition-opacity motion-reduce:transition-none',
						'forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]',
						'group-not-data-visible/controls:opacity-0',
						'group-not-data-started/controls:[visibility:var(--media-controls-before-start,hidden)]'
					]}
				>
					<media-controls-group
						class="media-max-sm:gap-2 flex items-center justify-between gap-4 rtl:flex-row-reverse"
					>
						<media-controls-group
							class="media-max-sm:gap-2 flex min-w-0 items-center gap-3 rtl:flex-row-reverse"
						>
							<media-play-button
								id={id('play')}
								class={[button, 'group/play group-data-ended/play:text-visited']}
							>
								{#snippet play()}{@render playLabels()}{/snippet}
								{@render link(play)}
							</media-play-button>
							{@render tooltip('play')}

							<media-mute-button
								commandfor={id('volume')}
								id={id('mute')}
								class={[button, 'group/mute']}
							>
								{#snippet mute()}
									<span class="hidden group-data-muted/mute:inline">Unmute</span>
									<span class="hidden group-not-data-muted/mute:inline">Mute</span>
								{/snippet}
								{@render link(mute)}
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
									box,
									'z-20 h-24 w-8 rounded-none px-2 py-2.5',
									'shadow-[2px_2px_0_black] [--media-popover-side-offset:calc(var(--media-spacing)*3)] [--media-popup-side-offset:var(--media-popover-side-offset)]'
								]}
							>
								<media-volume-slider
									orientation="vertical"
									thumb-alignment="edge"
									class="group/volume relative flex size-full cursor-pointer justify-center data-disabled:cursor-not-allowed data-disabled:opacity-40"
								>
									<media-slider-track
										class={[
											'bg-silver absolute bottom-0 left-1/2 h-full w-0.5 transform-[translateX(-50%)] overflow-hidden rounded-none forced-colors:forced-color-adjust-none',
											'forced-colors:w-1.5 forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]'
										]}
									>
										<media-slider-fill
											class="bg-link group-data-dragging/volume:bg-red absolute bottom-0 left-0 h-[var(--media-slider-fill,0%)] w-full rounded-none forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none"
										></media-slider-fill>
									</media-slider-track>
									<media-slider-thumb
										class={[
											'absolute bottom-[var(--media-slider-fill,0%)] left-1/2 h-0.5 w-3 transform-[translate(-50%,50%)] rounded-none bg-black',
											focusRing,
											'forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none'
										]}
									></media-slider-thumb>
								</media-volume-slider>
							</media-volume-popover>

							<media-time-group
								class={[
									mono,
									'flex h-4 shrink-0 items-center gap-1 px-1 text-[14px] leading-none tabular-nums rtl:flex-row-reverse'
								]}
							>
								<media-time
									type="current"
									toggle
									class={[
										'media-xs:hidden cursor-pointer rounded-none underline decoration-dotted underline-offset-2',
										focusRing,
										'data-disabled:cursor-not-allowed data-disabled:opacity-40 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
									]}
								></media-time>
								<media-time
									type="current"
									class="media-xs:inline hidden data-unavailable:opacity-50"
								></media-time>
								<media-time-separator
									class="media-xs:inline hidden text-[dimgray] data-unavailable:opacity-50"
								></media-time-separator>
								<media-time
									type="duration"
									class="media-xs:inline hidden text-[dimgray] data-unavailable:opacity-50"
								></media-time>
							</media-time-group>
						</media-controls-group>

						<media-controls-group
							class="media-max-sm:gap-2 flex items-center gap-3 rtl:flex-row-reverse"
						>
							<media-captions-button
								id={id('captions')}
								class={[button, 'group/captions media-max-3xs:hidden data-active:font-bold']}
							>
								{#snippet cc()}CC{/snippet}
								{@render link(cc)}
							</media-captions-button>
							{@render tooltip('captions')}

							<button
								type="button"
								commandfor={id('menu')}
								id={id('settings')}
								class={[button, 'media-max-3xs:hidden']}
							>
								{#snippet settings()}
									<span class="media-max-md:hidden" aria-hidden="true">Settings</span>
									<span class="media-md:hidden" aria-hidden="true">Menu</span>
								{/snippet}
								{@render link(settings)}
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
									box,
									'z-20 m-0 max-w-(--media-menu-available-width) min-w-48 overflow-hidden! rounded-none p-0',
									'shadow-[2px_2px_0_black] [--media-popover-side-offset:calc(var(--media-spacing)*3)] [--media-popup-side-offset:var(--media-popover-side-offset)]',
									'max-h-[min(var(--media-menu-available-height,--spacing(60)),--spacing(60))] overscroll-none',
									'h-(--media-menu-height) w-(--media-menu-width)',
									'transition-media-menu-resize motion-reduce:transition-none'
								]}
							>
								<media-menu-content class={menuContent}>
									{#each submenus as submenu (submenu.key)}
										{@const label = menuLabels[submenu.key]}
										{@const contentId = id(`menu-${submenu.key}`)}
										<media-menu-item commandfor={contentId} class={menuTrigger}>
											<span aria-hidden="true" class="w-3 shrink-0 text-center">&bull;</span>
											<media-text token="menu.{submenu.key}" class={menuLink}>{label}</media-text>
											<span
												class="ms-auto inline-flex min-w-0 items-baseline gap-1 ps-4 text-[dimgray] in-data-highlighted:text-white"
											>
												<span data-part="value" class="max-w-24 truncate"></span>
												<span aria-hidden="true" class="rtl:-scale-x-100">&raquo;</span>
											</span>
										</media-menu-item>
										<media-menu-content id={contentId} class={menuContent}>
											<media-menu-item
												class={[menuRow, 'border-silver mb-0.5 border-b border-solid font-bold']}
											>
												<span aria-hidden="true" class="w-3 shrink-0 text-center rtl:-scale-x-100"
													>&laquo;</span
												>
												<media-text token="menu.{submenu.key}">{label}</media-text>
											</media-menu-item>
											<media-menu-separator class="hidden"></media-menu-separator>
											<svelte:element this={submenu.group} class="flex flex-col">
												<template>
													<media-menu-radio-item class={radioItem}>
														<media-menu-item-indicator
															force-mount
															class="w-3 shrink-0 text-center opacity-0 group-aria-checked/menu-radio:opacity-100"
															aria-hidden="true">&bull;</media-menu-item-indicator
														>
														<span
															class={[
																menuLink,
																'group-aria-checked/menu-radio:font-bold group-aria-checked/menu-radio:text-black group-aria-checked/menu-radio:no-underline',
																'in-data-highlighted:text-white!'
															]}
														>
															{#if submenu.key === 'quality'}
																<span data-part="label"></span><sup
																	data-part="tier"
																	class="ps-0.5 text-[10px] leading-none empty:hidden"
																></sup>
															{:else}
																<span data-part="label"></span>
															{/if}
														</span>
														{#if submenu.key === 'quality' || submenu.key === 'captions'}
															<span
																data-part="badge"
																class={[menuBadge, 'ms-auto ps-3 empty:hidden']}
															></span>
														{/if}
													</media-menu-radio-item>
												</template>
											</svelte:element>
										</media-menu-content>
									{/each}
								</media-menu-content>
							</media-menu>

							<media-pip-button id={id('pip')} class={[button, 'group/pip media-max-sm:hidden']}>
								{#snippet pip()}
									<span class="group-data-pip/pip:hidden">PiP</span>
									<span class="hidden group-data-pip/pip:inline">Exit PiP</span>
								{/snippet}
								{@render link(pip)}
							</media-pip-button>
							{@render tooltip('pip')}

							<media-fullscreen-button id={id('fullscreen')} class={[button, 'group/fullscreen']}>
								{#snippet fullscreen()}
									<span class="hidden group-not-data-fullscreen/fullscreen:inline"
										>Full<span class="media-max-md:hidden">&nbsp;screen</span></span
									>
									<span class="hidden group-data-fullscreen/fullscreen:inline"
										>Exit<span class="media-max-md:hidden">&nbsp;full screen</span></span
									>
								{/snippet}
								{@render link(fullscreen)}
							</media-fullscreen-button>
							{@render tooltip('fullscreen')}
						</media-controls-group>
					</media-controls-group>

					<!-- the underline: played = visited purple, buffered = link blue, the rest dotted -->
					<media-time-slider
						thumb-alignment="edge"
						class={[
							'group/slider relative flex h-3 w-full min-w-12 cursor-pointer items-center',
							'data-disabled:cursor-not-allowed data-disabled:opacity-40 forced-colors:data-disabled:text-[GrayText] forced-colors:data-disabled:opacity-100'
						]}
					>
						<media-time-slider-chapters
							class={[
								'hl-underline relative flex h-0.5 w-full items-center',
								'transition-[height] duration-150 ease-out motion-reduce:transition-none',
								'group-focus-within/slider:h-1.5 group-data-dragging/slider:h-1.5 group-data-pointing/slider:h-1.5'
							]}
						>
							<template>
								<div
									class={[
										'clip-media-chapter-x absolute inset-0 flex items-center',
										'[--media-chapter-inset-end:0.75] [--media-chapter-inset-start:0.75]',
										'first-of-type:[--media-chapter-inset-start:0] last-of-type:[--media-chapter-inset-end:0]'
									]}
								>
									<media-slider-track class="absolute inset-0 isolate rounded-none">
										<!-- not yet loaded: a dotted link -->
										<span
											aria-hidden="true"
											class={[
												'clip-media-chapter-track-x absolute inset-y-0',
												'bg-[repeating-linear-gradient(90deg,var(--color-link)_0_2px,transparent_2px_4px)]',
												'forced-colors:bg-[repeating-linear-gradient(90deg,LinkText_0_2px,transparent_2px_4px)] forced-colors:forced-color-adjust-none'
											]}
										></span>
										<media-slider-buffer
											class={[
												'clip-media-x-[--media-slider-buffer] bg-link absolute inset-y-0 rounded-none',
												'forced-colors:bg-[LinkText] forced-colors:forced-color-adjust-none'
											]}
										></media-slider-buffer>
										<media-slider-fill
											class={[
												'clip-media-x-[--media-slider-fill] bg-visited absolute inset-y-0 rounded-none',
												'transition-[right,background-color] duration-250 ease-linear motion-reduce:transition-none',
												'group-data-dragging/slider:clip-media-x-[--media-slider-pointer] group-data-dragging/slider:bg-red group-data-dragging/slider:transition-none',
												'forced-colors:bg-[VisitedText] forced-colors:forced-color-adjust-none'
											]}
										></media-slider-fill>
									</media-slider-track>
								</div>
							</template>
						</media-time-slider-chapters>
						<!-- a text-cursor caret -->
						<media-slider-thumb
							class={[
								'absolute left-[var(--media-slider-fill,0%)] h-3 w-0.5 transform-[translateX(-50%)] rounded-none bg-black',
								'group-data-dragging/slider:left-(--media-slider-pointer)',
								'opacity-0 group-data-dragging/slider:opacity-100 group-data-pointing/slider:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100',
								focusRing,
								'focus-visible:outline-offset-2',
								'forced-colors:bg-[CanvasText] forced-colors:forced-color-adjust-none'
							]}
						></media-slider-thumb>
						<media-slider-preview
							class={[
								'pointer-events-none bottom-[calc(100%+var(--media-spacing)*10)] grid max-w-39 origin-bottom justify-items-center',
								'opacity-0 group-data-disabled/slider:hidden',
								'group-data-pointing/slider:opacity-100',
								'group-data-dragging/slider:opacity-100'
							]}
						>
							<media-slider-thumbnail
								class="block max-w-39 overflow-hidden rounded-none border border-solid border-black bg-black"
							>
								<img alt="" aria-hidden="true" decoding="async" class="block" />
							</media-slider-thumbnail>
							<div
								class={[box, '-mt-px flex max-w-full min-w-0 items-baseline gap-2 px-1.5 py-0.5']}
							>
								<media-slider-value
									type="pointer"
									class={[mono, 'shrink-0 text-[13px] tabular-nums']}
								></media-slider-value>
								<media-time-slider-chapter-title class="min-w-0 truncate italic empty:hidden"
								></media-time-slider-chapter-title>
							</div>
						</media-slider-preview>
					</media-time-slider>
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
		<media-volume-indicator class={[indicator, 'col-start-2 row-start-1 mt-3.5 self-start']}>
			<media-volume-indicator-fill class="flex items-center gap-2 rtl:flex-row-reverse">
				<span class={serif}>Volume:</span>
				<media-volume-indicator-value class="tabular-nums"></media-volume-indicator-value>
			</media-volume-indicator-fill>
		</media-volume-indicator>

		<media-status-indicator
			actions="toggleSubtitles,toggleFullscreen,togglePictureInPicture"
			class={[indicator, serif, 'col-start-2 row-start-1 mt-3 self-start']}
		>
			<media-status-indicator-value></media-status-indicator-value>
		</media-status-indicator>

		<media-seek-indicator
			class={[
				indicator,
				'group/seek-status col-start-2 row-start-1 mx-3 justify-center gap-1!',
				'data-[direction=backward]:col-start-1 data-[direction=backward]:justify-self-start rtl:data-[direction=backward]:col-start-3 rtl:data-[direction=backward]:justify-self-end',
				'data-[direction=forward]:col-start-3 data-[direction=forward]:justify-self-end rtl:data-[direction=forward]:col-start-1 rtl:data-[direction=forward]:justify-self-start'
			]}
		>
			<span class="hidden group-data-[direction=backward]/seek-status:inline">&laquo;</span>
			<media-seek-indicator-value class="tabular-nums"></media-seek-indicator-value>
			<span class="hidden group-data-[direction=forward]/seek-status:inline">&raquo;</span>
		</media-seek-indicator>
	</div>
</media-container>

<style>
	/*
	 * Pointing at the underline makes it go wavy, like every other link on the site
	 * (`hocus:decoration-wavy`). The colored layers inside show through a repeating wave mask.
	 */
	:global(.hyperlink-skin media-time-slider:is([data-pointing], [data-dragging], :focus-within))
		:global(.hl-underline) {
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6' preserveAspectRatio='none'%3E%3Cpath d='M0 4.5C2 4.5 2 1.5 4 1.5S6 4.5 8 4.5' fill='none' stroke='%23000' stroke-width='2.5'/%3E%3C/svg%3E");
		mask-size: 8px 100%;
		mask-repeat: repeat-x;
	}
	@media (forced-colors: active) {
		:global(.hyperlink-skin .hl-underline) {
			mask-image: none !important;
		}
	}
</style>
