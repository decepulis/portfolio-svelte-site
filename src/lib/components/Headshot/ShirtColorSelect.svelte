<script lang="ts">
	type Props = {
		id?: string;
		show: boolean;
		shirtColor: string;
	};
	let { id, show, shirtColor = $bindable() }: Props = $props();
</script>

<fieldset
	style:grid-template-columns="repeat(15, minmax(0, 1fr))"
	style:transform="scaleY({show ? 1 : 0})"
	class="border-silver dark:border-darkgray relative grid origin-top transform-gpu border-x border-b transition-transform duration-200"
	inert={!show}
	{id}
>
	<label
		class="bg-red aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="red"
		aria-label="Set shirt color to red"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-red)"
			checked={shirtColor === 'var(--color-red)'}
		/>
	</label>
	<label
		class="bg-maroon aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="maroon"
		aria-label="Set shirt color to maroon"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-maroon)"
			checked={shirtColor === 'var(--color-maroon)'}
		/>
	</label>
	<label
		class="bg-yellow aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="yellow"
		aria-label="Set shirt color to yellow"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-yellow)"
			checked={shirtColor === 'var(--color-yellow)'}
		/>
	</label>
	<label
		class="bg-olive aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="olive"
		aria-label="Set shirt color to olive"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-olive)"
			checked={shirtColor === 'var(--color-olive)'}
		/>
	</label>
	<label
		class="bg-lime aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="lime"
		aria-label="Set shirt color to lime"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-lime)"
			checked={shirtColor === 'var(--color-lime)'}
		/>
	</label>
	<label
		class="bg-green aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="green"
		aria-label="Set shirt color to green"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-green)"
			checked={shirtColor === 'var(--color-green)'}
		/>
	</label>
	<label
		class="bg-aqua aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="aqua"
		aria-label="Set shirt color to aqua"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-aqua)"
			checked={shirtColor === 'var(--color-aqua)'}
		/>
	</label>
	<label
		class="bg-teal aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="teal"
		aria-label="Set shirt color to teal"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-teal)"
			checked={shirtColor === 'var(--color-teal)'}
		/>
	</label>
	<label
		class="bg-blue aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="blue"
		aria-label="Set shirt color to blue"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-blue)"
			checked={shirtColor === 'var(--color-blue)'}
		/>
	</label>
	<label
		class="bg-navy aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="navy"
		aria-label="Set shirt color to navy"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-navy)"
			checked={shirtColor === 'var(--color-navy)'}
		/>
	</label>
	<label
		class="bg-fuchsia aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="fuchsia"
		aria-label="Set shirt color to fuchsia"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-fuchsia)"
			checked={shirtColor === 'var(--color-fuchsia)'}
		/>
	</label>
	<label
		class="bg-purple aspect-square cursor-pointer focus-within:scale-105 focus-within:outline-2"
		title="purple"
		aria-label="Set shirt color to purple"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-purple)"
			checked={shirtColor === 'var(--color-purple)'}
		/>
	</label>
	<label
		class="aspect-square cursor-pointer bg-white focus-within:scale-105 focus-within:outline-2"
		title="white"
		aria-label="Set shirt color to white"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-white)"
			checked={shirtColor === 'var(--color-white)'}
		/>
	</label>
	<label
		class="aspect-square cursor-pointer bg-black focus-within:scale-105 focus-within:outline-2"
		title="white"
		aria-label="Set shirt color to black"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value="var(--color-black)"
			checked={shirtColor === 'var(--color-black)'}
		/>
	</label>
	<label
		class="relative aspect-square cursor-pointer bg-white focus-within:scale-105 focus-within:outline-2"
		title="dithered"
		aria-label="Show dithered profile picture"
		aria-controls="dithered"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value=""
			checked={shirtColor === ''}
		/>
		<enhanced:img src="./dithering-button.svg" alt="" class="absolute inset-0" />
	</label>
</fieldset>
