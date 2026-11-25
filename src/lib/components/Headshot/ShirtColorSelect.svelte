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
	class="border-silver dark:border-gray relative grid origin-top transform-gpu border-x border-b transition-transform duration-200"
	inert={!show}
	{id}
>
	<legend class="sr-only">Shirt color</legend>
	<label
		class="bg-red has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-maroon has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-yellow has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-olive has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-lime has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-green has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-aqua has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-teal has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-blue has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-navy has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-fuchsia has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="bg-purple has-focus-visible:focus-ring relative aspect-square cursor-pointer outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="has-focus-visible:focus-ring aspect-square cursor-pointer bg-white outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
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
		class="has-focus-visible:focus-ring aspect-square cursor-pointer bg-black outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
		title="black"
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
		class="has-focus-visible:focus-ring relative aspect-square cursor-pointer bg-white outline-offset-2 has-checked:z-10 has-checked:scale-105 has-checked:after:absolute has-checked:after:inset-0 has-checked:after:shadow-[inset_0_0_0_2px_var(--color-black),inset_0_0_0_3px_var(--color-white)] has-focus-visible:z-10"
		title="dithered"
		aria-label="Show dithered profile picture"
	>
		<input
			type="radio"
			class="sr-only"
			name="shirtColor"
			bind:group={shirtColor}
			value=""
			checked={shirtColor === ''}
		/>
		<enhanced:img src="./dithering-button.svg" alt="" class="absolute inset-0" loading="lazy" />
	</label>
</fieldset>
