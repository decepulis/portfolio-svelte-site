<script lang="ts">
	import InteractiveHeadshot from './InteractiveHeadshot.svelte';
	import ShirtColorSelect from './ShirtColorSelect.svelte';

	let shirtColor = $state('var(--color-blue)');
	const showProfilePicture = $derived(shirtColor === '');
	let showShirtColorControls = $state(false);

	let headshot: InteractiveHeadshot;
</script>

<div class="flex w-full max-w-64 flex-col">
	<div class="relative">
		<InteractiveHeadshot {shirtColor} bind:this={headshot} />
		<enhanced:img
			src="./dithering.jpg"
			id="dithered"
			alt="Darius, dithered"
			class="border-silver dark:border-darkgray absolute inset-0"
			hidden={!showProfilePicture}
			loading="lazy"
		/>
		<button
			type="button"
			class="text-silver dark:text-darkgray hocus:text-black absolute top-2 right-2 -m-2 flex h-8 w-8 cursor-pointer items-center justify-center bg-clip-content p-2 text-sm"
			style:color={showShirtColorControls ? 'var(--color-black)' : undefined}
			aria-controls="shirt-color-controls"
			aria-expanded={showShirtColorControls}
			aria-label="Toggle shirt color controls"
			onclick={() => {
				showShirtColorControls = !showShirtColorControls;
				headshot.react();
			}}
		>
			<span
				class="transform-gpu transition-transform duration-200"
				style:transform="rotate({showShirtColorControls ? '0' : '-90deg'})"
			>
				&#9660;
			</span>
		</button>
	</div>
	<ShirtColorSelect id="shirt-color-controls" show={showShirtColorControls} bind:shirtColor />
</div>
