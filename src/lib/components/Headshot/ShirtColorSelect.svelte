<script lang="ts">
	type Props = {
		id?: string;
		show: boolean;
		shirtColor: string;
	};
	let { id, show, shirtColor = $bindable() }: Props = $props();

	// each swatch names its class in full, so Tailwind keeps the color (the shirt's fill uses it too)
	const colors = [
		{ name: 'red', bg: 'bg-red' },
		{ name: 'maroon', bg: 'bg-maroon' },
		{ name: 'yellow', bg: 'bg-yellow' },
		{ name: 'olive', bg: 'bg-olive' },
		{ name: 'lime', bg: 'bg-lime' },
		{ name: 'green', bg: 'bg-green' },
		{ name: 'aqua', bg: 'bg-aqua' },
		{ name: 'teal', bg: 'bg-teal' },
		{ name: 'blue', bg: 'bg-blue' },
		{ name: 'navy', bg: 'bg-navy' },
		{ name: 'fuchsia', bg: 'bg-fuchsia' },
		{ name: 'purple', bg: 'bg-purple' },
		{ name: 'white', bg: 'bg-white' },
		{ name: 'black', bg: 'bg-black' }
	];

	// The picked swatch steps forward in a black-and-white frame, which reads on any color.
	// The frame is drawn over the swatch (::after), so it covers the dithered picture too.
	// Keyboard focus adds the site's dotted ring around it.
	const swatch = [
		'relative aspect-square cursor-pointer outline-offset-2',
		'has-checked:z-10 has-checked:scale-105',
		'has-checked:after:absolute has-checked:after:inset-0',
		'has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)]',
		'has-focus-visible:focus-ring has-focus-visible:z-10'
	];
</script>

<fieldset
	style:grid-template-columns="repeat(15, minmax(0, 1fr))"
	style:transform="scaleY({show ? 1 : 0})"
	class="border-silver dark:border-gray relative grid origin-top transform-gpu border-x border-b transition-transform duration-200"
	inert={!show}
	{id}
>
	<legend class="sr-only">Shirt color</legend>
	{#each colors as { name, bg } (name)}
		<label class={[swatch, bg]} title={name} aria-label="Set shirt color to {name}">
			<input
				type="radio"
				class="sr-only"
				name="shirtColor"
				bind:group={shirtColor}
				value="var(--color-{name})"
			/>
		</label>
	{/each}
	<label class={[swatch, 'bg-white']} title="dithered" aria-label="Show dithered profile picture">
		<input type="radio" class="sr-only" name="shirtColor" bind:group={shirtColor} value="" />
		<enhanced:img src="./dithering-button.svg" alt="" class="absolute inset-0" loading="lazy" />
	</label>
</fieldset>
