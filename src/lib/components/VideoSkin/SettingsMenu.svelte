<!--
	A settings button and its menu. Each panel is a <fieldset>: the root lists settings as closed
	<select>s, and each setting opens as a <select size=N> listbox. The menu keeps one width, so
	panels slide straight across while it eases to the next one's height.
-->
<script lang="ts">
	import Control from './Control.svelte';

	const id = $props.id();

	const settings = [
		{ name: 'quality', label: 'Quality', group: 'media-quality-radio-group' },
		{ name: 'speed', label: 'Speed', group: 'media-playback-rate-radio-group' }
	];

	const panel = [
		'absolute inset-x-0 top-0 max-h-full overflow-y-auto p-1.5',
		'transition-transform duration-300 ease-out motion-reduce:transition-none',
		'data-child-open:-translate-x-full',
		'data-submenu:data-starting-style:translate-x-full data-submenu:data-ending-style:translate-x-full',
		'data-starting-style:pointer-events-none data-ending-style:pointer-events-none'
	];
	const fieldset =
		'grid gap-1.5 border-2 border-silver px-3 pt-1 pb-3 [border-style:groove] dark:border-white';
	const legend = 'px-1 font-serif text-sm';
</script>

<Control as="button" type="button" commandfor={id} aria-label="Settings" class="px-2">
	<media-icon family="scaffold" name="gear" class="block size-3.5 *:size-full"></media-icon>
	<span aria-hidden="true" class="@max-sm:hidden">Settings&hellip;</span>
</Control>

<media-menu
	{id}
	side="top"
	align="end"
	class={[
		// text-start, because browsers still read align="end" as HTML 3.2's align attribute
		'raised dark:bg-gainsboro m-0 box-content overflow-hidden bg-white p-0 text-start text-xs text-black',
		'h-(--media-menu-height) w-56 transition-[height] duration-300 ease-out motion-reduce:transition-none',
		// Video.js nudges a popup that doesn't fit rather than flipping it, so keep it small enough to
		// stay aligned with its button. Its border sits outside the size Video.js measures.
		'max-h-[calc(var(--media-menu-available-height)-2px)] max-w-[calc(var(--media-menu-available-width)-2px)]'
	]}
>
	<media-menu-content class={panel}>
		<fieldset class={fieldset}>
			<legend class={legend}>Settings</legend>
			{#each settings as { name, label } (name)}
				<media-menu-item
					commandfor="{id}-{name}"
					class="group/item flex cursor-pointer items-center gap-3 outline-none data-[availability=unavailable]:hidden"
				>
					{label}:
					<span
						class="border-gray dark:bg-gainsboro ms-auto flex h-5 min-w-28 border bg-white outline-offset-1 group-data-highlighted/item:outline-2"
					>
						<span data-part="hint" class="flex flex-1 items-center px-1"></span>
						<span
							aria-hidden="true"
							class="border-gray bg-gainsboro dark:bg-silver grid w-4 place-items-center border-l text-[8px] group-hover/item:bg-white"
						>
							&#9660;
						</span>
					</span>
				</media-menu-item>
			{/each}
		</fieldset>
	</media-menu-content>

	{#each settings as { name, label, group } (name)}
		<media-menu-content id="{id}-{name}" class={panel}>
			<fieldset class={fieldset}>
				<legend class={legend}>{label}</legend>
				<!-- back is a link, red while pressed, like an <a> in a [ nav | bar ] -->
				<media-menu-item class="group/back cursor-pointer justify-self-start outline-none">
					[
					<span
						class="text-link group-active/back:text-red underline outline-offset-1 group-data-highlighted/back:outline-2"
					>
						&laquo; Settings
					</span>
					]
				</media-menu-item>
				<hr class="border-t-gray border-b border-b-white" />
				<svelte:element
					this={group}
					class="border-gray dark:bg-gainsboro flex max-h-36 flex-col overflow-y-auto border bg-white p-px"
				>
					<template>
						<media-menu-radio-item
							class="aria-checked:bg-silver dark:aria-checked:bg-darkgray cursor-pointer px-1 py-0.5 -outline-offset-2 outline-none data-highlighted:outline-2"
						>
							<span data-part="label"></span>
						</media-menu-radio-item>
					</template>
				</svelte:element>
			</fieldset>
		</media-menu-content>
	{/each}
</media-menu>
