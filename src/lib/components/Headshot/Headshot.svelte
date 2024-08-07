<script lang="ts">
	import { spring } from 'svelte/motion';
	import throttle from 'just-throttle';

	let svgElement: SVGElement;
	let shirtColor: string | null = $state('var(--color-linkText)');
	const showProfilePicture = $derived(shirtColor === null);
	let showShirtColorControls = $state(false);

	// == what happens on mouse move? ==
	// Rectangular coordinates of mouse relative to center of svg
	let svgWidth: number = $state(0);
	let svgHeight: number = $state(0);

	let distanceX = $state(0);
	let distanceY = $state(0);

	let maxDistanceX = $state(1);
	let maxDistanceY = $state(1);

	// This function runs when the user moves their mouse or clicks somewhere on the window
	const onWindowResize = () => {
		const { clientWidth, clientHeight } = svgElement;
		svgWidth = clientWidth;
		svgHeight = clientHeight;

		const { innerWidth, innerHeight } = window;
		maxDistanceX = innerWidth;
		maxDistanceY = innerHeight;
	};
	$effect(onWindowResize); // run once on load
	const throttledOnWindowResize = throttle(onWindowResize, 250);

	const onWindowPointerUpdate = (e: MouseEvent | PointerEvent) => {
		const { x: svgX, y: svgY } = svgElement.getBoundingClientRect();
		const svgCenterX = svgX + svgWidth / 2;
		const svgCenterY = svgY + svgHeight / 2;

		const { x: mouseX, y: mouseY } = e;
		distanceX = mouseX - svgCenterX;
		distanceY = mouseY - svgCenterY;
	};
	const throttledOnWindowPointerUpdate = throttle(onWindowPointerUpdate, 100);

	// In practice, we'll be using these percentages
	// instead of absolute distances in pixels
	// and we won't want transitions to be instant.
	// Here, we make that transformation and store it in a pair of springs
	const mouseSpringOpts = { stiffness: 0.1, damping: 1 };
	const percentXSpring = spring(0, mouseSpringOpts);
	const percentYSpring = spring(0, mouseSpringOpts);
	$effect(() => {
		$percentXSpring = Math.max(Math.min(distanceX / maxDistanceX, 1), -1);
		$percentYSpring = Math.max(Math.min(distanceY / maxDistanceY, 1), -1);
	});
	// clamp the springs to make sure nothing wacky happens
	const percentX = $derived(Math.max(Math.min($percentXSpring, 1.1), -1.1));
	const percentY = $derived(Math.max(Math.min($percentYSpring, 1.1), -1.1));

	// == what happens on mouse click? ==
	let isPoked = $state(false);
	const pokeSpring = spring(0, { stiffness: 0.2, damping: 1 });
	$effect(() => {
		$pokeSpring = isPoked ? 1 : 0;
	});

	let pokeTimeout: ReturnType<typeof setTimeout>;
	$effect(() => () => clearTimeout(pokeTimeout));

	const poke = () => {
		isPoked = true;
		pokeTimeout = setTimeout(() => {
			isPoked = false;
		}, 200);
	};

	// == an option to show reactions ==
	let didReact = $state(false);
	let isReacting = $state(false);
	const reactSpring = spring(0, { stiffness: 0.2, damping: 1 });
	$effect(() => {
		$reactSpring = isReacting ? 1 : 0;
	});
	let changeTimeout: ReturnType<typeof setTimeout>;
	$effect(() => () => clearTimeout(changeTimeout));
	const react = () => {
		isReacting = true;
		didReact = true;
		clearTimeout(changeTimeout);
		changeTimeout = setTimeout(() => {
			isReacting = false;
		}, 650);
	};

	// == let's use our springs to animate the svg ==
	const speed = 66;
	const headX = $derived.by(() => {
		const headXMax = svgWidth / (speed * 6);
		return percentX * headXMax;
	});
	const headY = $derived.by(() => {
		const headYMax = svgHeight / (speed * 6);
		return percentY * headYMax;
	});

	const featuresX = $derived.by(() => {
		const featuresXMax = svgWidth / (speed * 3);
		return percentX * featuresXMax;
	});
	const featuresY = $derived.by(() => {
		const featuresYMax = svgHeight / (speed * 3);
		return percentY * featuresYMax;
	});

	const eyesX = $derived.by(() => {
		const eyesXMax = svgWidth / (speed * 1.5);
		return percentX * eyesXMax;
	});
	const eyesY = $derived.by(() => {
		const eyesYMax = svgHeight / (speed * 1.5);
		const eyesYMouse = percentY * eyesYMax;
		const eyesYChanged = $reactSpring * (svgHeight / (speed * 4.5));
		return eyesYMouse + eyesYChanged;
	});

	const browsX = $derived(featuresX);
	const browsY = $derived.by(() => {
		const browsYMax = svgHeight / (speed * 3);
		const browsYMin = svgHeight / speed;
		const browsYPoked = $pokeSpring * (-svgHeight / (speed * 3));
		const browsYChanged = $reactSpring * (-svgHeight / (speed * 4.5));
		const browsYMouse = percentY > 0 ? percentY * browsYMax : percentY * browsYMin;
		return browsYPoked + browsYMouse + browsYChanged;
	});

	const earsX = $derived(-headX);
	const earsY = $derived(-headY);

	// Finally, we'll occasionally swap the eyes out for blinking
	let isBlinking = $state(false);
	let blinkTimeout: ReturnType<typeof setTimeout>;
	const openEyes = () => {
		isBlinking = false;
		// Humans blink 15-20 times per minute (once every 3-4 seconds)
		// That's too frequent for here, so we make that 4-8 seconds
		const nextBlinkSeconds = 4 + 4 * Math.random();
		blinkTimeout = setTimeout(closeEyes, nextBlinkSeconds * 1000);
	};
	const closeEyes = () => {
		isBlinking = true;
		blinkTimeout = setTimeout(openEyes, 100);
	};
	$effect(() => {
		closeEyes();
		return () => clearTimeout(blinkTimeout);
	});
</script>

<svelte:window
	onpointermove={throttledOnWindowPointerUpdate}
	onpointerdown={throttledOnWindowPointerUpdate}
	onresize={throttledOnWindowResize}
/>
<div class="flex w-full max-w-64 flex-col">
	<div class="relative">
		<svg
			viewBox="0 0 64 64"
			class="border-silver h-auto w-full border"
			xmlns="http://www.w3.org/2000/svg"
			bind:this={svgElement}
			onpointerdown={poke}
		>
			<title>Darius Cepulis</title>
			<!-- background -->
			<path fill="var(--color-gainsboro)" d="M0 0h64v64H0z" />
			<!-- shirt + neck -->
			<g>
				<path fill="var(--color-wheat)" d="M25 49h14v9H25z" />
				<path
					d="M61 65H2v-1h1v-2h2v-2h2v-2h3v-2h5v-2h6v-2h6v2h2v2h1v2h3v-2h1v-2h2v-2h6v2h6v2h5v2h3v2h2v2h2v2h1v1z"
					fill={shirtColor}
				/>
				<path
					d="M35 54v-1h1v1h-1zm-1 1v-1h1v1h-1zm25 7h1v1h-1v-1zm-11-7h3v1h-3v-1zm-6-1v1h-1v-1h1zm15 6h1v1h-1v-1zm-15-7h3v1h-3v-1zM2 64v1H1v-1h1zm13-9v-1h3v1h-3zm-3 1v-1h3v1h-3zm-2 1v-1h2v1h-2zm-2 1v-1h2v1H8zm-1 1v-1h1v1H7zm-1 1v-1h1v1H6zm-1 1v-1h1v1H5zm-1 1v-1h1v1H4zm-1 1v-1h1v1H3zm-1 1v-1h1v1H2zm59 0h1v1h-1v-1zm-6-6h1v1h-1v-1zm-10-4h3v1h-3v-1zm15 9h1v1h-1v-1zm-2-2h1v1h-1v-1zm-2-2h1v1h-1v-1zm-5-3h2v1h-2v-1zm-18 1v-2h1v2h-1zm7-1v-1h.964v1H40zm-1 1v-1h1v1h-1zm14 0h2v1h-2v-1zm-15 1v-1h1v1h-1zm-1 1v-1h1v1h-1zm-2 0h2v1h-2v-1zm-2-1h2v1h-2v-1zm-1 0v-1h1v1h-1zm-1 0h1v7h-1v-2h-1v-2h1v-3zm-8-2h-.964v-1H23v1zm1 1h-1v-1h1v1zm1 1h-1v-1h1v1zm1 1h-1v-1h1v1zm2 0v1h-2v-1h2zm2-1v1h-2v-1h2zm0-1h1v1h-1v-1zm-1-2h1v2h-1v-2zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-2-1h2v1h-2v-1zm-2 0v-1h1v-2h1v3h-2zm-2 1v-1h2v1h-2zm0 1h1v1h-1v-1zm-3 0v-1h3v1h-3zm22-2h2v1h-2v-1zm-2 0v-3h1v2h1v1h-2zm-2 1v-1h2v1h-2z"
				/>
			</g>
			<!-- ears -->
			<g style="transform:translate3d({earsX}px,{earsY}px,0);">
				<!-- left ear -->
				<g>
					<path fill="var(--color-wheat)" d="M46 31h5v5h-5z" />
					<path
						d="M51 32h1v3h-1v-3zm-1-1h1v1h-1v-1zm0 5v1h-4v-1h4zm0-5h-4v-1h4v1zm1 4v1h-1v-1h1zm-2-2v1h-2v-1h2z"
					/>
				</g>
				<!-- right ear -->
				<g>
					<path fill="var(--color-wheat)" d="M12 31h5v5h-5z" />
					<path
						d="M12 35h1v1h-1v-1zm1-4v-1h4v1h-4zm-1 1v3h-1v-3h1zm0 0v-1h1v1h-1zm1 4h4v1h-4v-1zm1-3h2v1h-2v-1z"
					/>
				</g>
			</g>
			<!-- head -->
			<g style="transform:translate3d({headX}px,{headY}px,0);">
				<!-- face color -->
				<path
					d="M36 50h-9v-1h-2v-2h-3v-1h-1v-2h-2v-4h-2V16h2v-2h2v-1h1v-2h19v2h2v1h1v1h1v1h1v24h-2v4h-2v2h-1v1h-3v2h-2v1z"
					fill="var(--color-wheat)"
				/>
				<!-- beard color -->
				<path
					d="M19 41h-1v-2h2v1h23v-1h2v3h-2v3h-2v2h-3v2h-4v2h-5v-2h-4v-2h-2v-1h-2v-2h-2v-3z"
					fill="var(--color-burlywood)"
				/>
				<!-- hair color -->
				<path
					d="M17 16v6h-2v-8h1V4h2v2h1V4h3V3h2v1h8v2h12v3h1v2h2v1h2v10h-2v-6h-2v-2h-2v-2h-2v-1H22v2h-2v2h-2v1h-1z"
					fill="var(--color-darkgoldenrod)"
				/>
				<!-- outline -->
				<path
					d="M15 22h-1v-8h1v8zm0-8V4h1v10h-1zm1-10V3h1v1h-1zm1 0h1v1h-1V4zm1 1h1v1h-1V5zm1 0V4h2v1h-2zm2-1V1h1v1h2v1h-2v1h-1zm3-1h2v1h-2V3zm2 1h2v1h-2V4zm2 0V3h1v1h-1zm1 0h3v1h-3V4zm3 1h2v1h-2V5zm2 1h10v1H34V6zm10 1h1v2h-1V7zm1 2h1v2h-1V9zm1 2h3v11h-1V12h-2v-1zm2 11v5h-1v11h-1V16h1v6h1zm-2-6h-1v-1h1v1zm-1-1h-1v-1h1v1zm-1-1h-1v-1h1v1zm-1-1h-2v-1h2v1zm-2-1h-2v-1h2v1zm-2-1H24v-1h15v1zm-15 0v1h-2v-1h2zm-2 1v1h-1v-1h1zm-1 1v1h-1v-1h1zm-1 1v1h-1v-1h1zm-1 1v1h-1v-1h1zm-1 1v3h-1v-3h1zm-2 10h-1v-4h1v-3h1v19h-1V26zM18 40h1v2h-1v-2zm3 5h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-2h1v2h-1v-2zm8 7h2v1h-2v-1zm-2-1h2v1h-2v-1zm-2-1h2v1h-2v-1zm-1-1h1v1h-1v-1zm-4-6h-1v-3h1v3zm27 0v-3h1v3h-1zm-1 2v-2h1v2h-1zm-1 2v-2h1v2h-1zm-1 1v-1h1v1h-1zm-1 1v-1h1v1h-1zm-1 1v-1h1v1h-1zm-2 1v-1h2v1h-2zm-2 1v-1h2v1h-2zm-2 1v-1h2v1h-2zm-5 0h5v1h-5v-1z"
				/>
			</g>
			<!-- eyebrows -->
			<path
				d="M20 23v-1h7v1h-7zm7 0h1v1h-1v-1zm-7 0v1h-2v-1h2zm16 0v-1h7v1h-7zm7 0h2v1h-2v-1zm-7 0v1h-1v-1h1z"
				fill="var(--color-darkgoldenrod)"
				style="transform:translate3d({browsX}px,{browsY}px,0);"
			/>
			<!-- eyes -->
			<g fill="var(--color-darkgreen)" style="transform:translate3d({eyesX}px,{eyesY}px,0);">
				{#if isBlinking || isPoked}
					<path d="M40 30h-4v-1h4v1zm0 0h1v1h-1v-1zM23 30v-1h4v1h-4zm0 0v1h-1v-1h1z" />
				{:else}
					<path d="M37 28h3v3h-3zM23 28h3v3h-3z" />
				{/if}
			</g>
			<!-- glasses, nose, mouth -->
			<g style="transform:translate3d({featuresX}px,{featuresY}px,0);" fill="var(--color-black)">
				<!-- glasses -->
				<path
					d="M44 35v1h-1v-1h1zm-10-8v-1h1v1h-1zm2 9h6.843v1H36v-1zm-1-1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1-7h1v7h-1v-7zm-3 0v-1h3v1h-3zm-3 9v1h-6.843v-1H27zm1-1v1h-1v-1h1zm1-1v1h-1v-1h1zm0-7h1v7h-1v-7zm-1-1h1v1h-1v-1zm-2-1h2v1h-2v-1zm-5 0v-1h5v1h-5zm-3 2v-2h3v1h-2v1h-1zm0 6h-1v-6h1v6zm1 2h1v1h-1v-1zm-1-2h1v2h-1v-2zm19-8v-1h5v1h-5zm-2 1v-1h2v1h-2zm10 7v2h-1v-2h1zm0-6h1v6h-1v-6zm-3-2h3v2h-1v-1h-2v-1z"
				/>
				<!-- nose -->
				<path d="M34 38v1h-4v-1h4zm0 0v-1h1v1h-1z" />
				{#if isReacting || $reactSpring > 0.33}
					<!-- ooh -->
					<path
						d="M29 42h2v2h-2z"
						style="transform:translate3d({eyesX * 1.5}px,{eyesY / 2}px,0);"
					/>
				{:else}
					<!-- mouth -->
					<path d="M35 42v-1h1v1h-1zm-7 0h-1v-1h1v1zm0 0h7v1h-7v-1z" />
				{/if}
			</g>
		</svg>
		<enhanced:img
			src="./dithering.jpg"
			id="dithered"
			alt="Darius, dithered"
			class="absolute inset-0"
			hidden={!showProfilePicture}
		/>
		<button
			type="button"
			class="text-silver absolute top-2 right-2 -m-2 flex h-8 w-8 cursor-pointer items-center justify-center bg-clip-content p-2 text-sm hover:bg-white hover:text-black"
			style:background-color={showShirtColorControls ? 'var(--color-white)' : undefined}
			style:color={showShirtColorControls ? 'var(--color-black)' : undefined}
			aria-controls="shirt-color-controls"
			aria-label="Toggle shirt color controls"
			onclick={() => {
				showShirtColorControls = !showShirtColorControls;
				!didReact && react();
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
	<div
		style:grid-template-columns="repeat(14, minmax(0, 1fr))"
		style:transform="scaleY({showShirtColorControls ? 1 : 0})"
		class="border-silver grid origin-top transform-gpu border-x border-b transition-transform duration-200"
		aria-expanded={showShirtColorControls}
		id="shirt-color-controls"
	>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-red)')}
			title="red"
			aria-label="Set shirt color to red"
			class="bg-red aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-maroon)')}
			title="maroon"
			aria-label="Set shirt color to maroon"
			class="bg-maroon aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-yellow)')}
			title="yellow"
			aria-label="Set shirt color to yellow"
			class="bg-yellow aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-olive)')}
			title="olive"
			aria-label="Set shirt color to olive"
			class="bg-olive aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-lime)')}
			title="lime"
			aria-label="Set shirt color to lime"
			class="bg-lime aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-green)')}
			title="green"
			aria-label="Set shirt color to green"
			class="bg-green aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-aqua)')}
			title="aqua"
			aria-label="Set shirt color to aqua"
			class="bg-aqua aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-teal)')}
			title="teal"
			aria-label="Set shirt color to teal"
			class="bg-teal aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-blue)')}
			title="blue"
			aria-label="Set shirt color to blue"
			class="bg-blue aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-navy)')}
			title="navy"
			aria-label="Set shirt color to navy"
			class="bg-navy aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-fuchsia)')}
			title="fuchsia"
			aria-label="Set shirt color to fuchsia"
			class="bg-fuchsia aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-purple)')}
			title="purple"
			aria-label="Set shirt color to purple"
			class="bg-purple aspect-square cursor-pointer"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = 'var(--color-white)')}
			title="white"
			aria-label="Set shirt color to white"
			class="aspect-square cursor-pointer bg-white"
		></button>
		<button
			type="button"
			onclick={() => (shirtColor = null)}
			title="dithered"
			aria-controls="dithered"
			aria-label="Show real profile picture"
			class="aspect-square cursor-pointer bg-white"
		>
			<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" class="h-full w-full">
				<path
					d="M0 0h1v1H0zM2 0h1v1H2zM4 0h1v1H4zM6 0h1v1H6zM8 0h1v1H8zM1 1h1v1H1zM3 1h1v1H3zM5 1h1v1H5zM7 1h1v1H7zM9 1h1v1H9zM0 2h1v1H0zM2 2h1v1H2zM4 2h1v1H4zM6 2h1v1H6zM8 2h1v1H8zM1 3h1v1H1zM3 3h1v1H3zM5 3h1v1H5zM7 3h1v1H7zM9 3h1v1H9zM0 4h1v1H0zM2 4h1v1H2zM4 4h1v1H4zM6 4h1v1H6zM8 4h1v1H8zM1 5h1v1H1zM3 5h1v1H3zM5 5h1v1H5zM7 5h1v1H7zM9 5h1v1H9zM0 6h1v1H0zM2 6h1v1H2zM4 6h1v1H4zM6 6h1v1H6zM8 6h1v1H8zM1 7h1v1H1zM3 7h1v1H3zM5 7h1v1H5zM7 7h1v1H7zM9 7h1v1H9zM0 8h1v1H0zM2 8h1v1H2zM4 8h1v1H4zM6 8h1v1H6zM8 8h1v1H8zM1 9h1v1H1zM3 9h1v1H3zM5 9h1v1H5zM7 9h1v1H7zM9 9h1v1H9zM0 10h1v1H0zM2 10h1v1H2zM4 10h1v1H4zM6 10h1v1H6zM8 10h1v1H8zM1 11h1v1H1zM3 11h1v1H3zM5 11h1v1H5zM7 11h1v1H7zM9 11h1v1H9zM0 12h1v1H0zM2 12h1v1H2zM4 12h1v1H4zM6 12h1v1H6zM8 12h1v1H8zM1 13h1v1H1zM3 13h1v1H3zM5 13h1v1H5zM7 13h1v1H7zM9 13h1v1H9zM0 14h1v1H0zM2 14h1v1H2zM4 14h1v1H4zM6 14h1v1H6zM8 14h1v1H8zM1 15h1v1H1zM3 15h1v1H3zM5 15h1v1H5zM7 15h1v1H7zM9 15h1v1H9zM0 16h1v1H0zM2 16h1v1H2zM4 16h1v1H4zM6 16h1v1H6zM8 16h1v1H8zM1 17h1v1H1zM3 17h1v1H3zM5 17h1v1H5zM7 17h1v1H7zM9 17h1v1H9zM0 18h1v1H0zM2 18h1v1H2zM4 18h1v1H4zM6 18h1v1H6zM8 18h1v1H8zM1 19h1v1H1zM3 19h1v1H3zM5 19h1v1H5zM7 19h1v1H7zM9 19h1v1H9zM10 0h1v1h-1zM12 0h1v1h-1zM14 0h1v1h-1zM16 0h1v1h-1zM18 0h1v1h-1zM11 1h1v1h-1zM13 1h1v1h-1zM15 1h1v1h-1zM17 1h1v1h-1zM19 1h1v1h-1zM10 2h1v1h-1zM12 2h1v1h-1zM14 2h1v1h-1zM16 2h1v1h-1zM18 2h1v1h-1zM11 3h1v1h-1zM13 3h1v1h-1zM15 3h1v1h-1zM17 3h1v1h-1zM19 3h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h1v1h-1zM16 4h1v1h-1zM18 4h1v1h-1zM11 5h1v1h-1zM13 5h1v1h-1zM15 5h1v1h-1zM17 5h1v1h-1zM19 5h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM11 9h1v1h-1zM13 9h1v1h-1zM15 9h1v1h-1zM17 9h1v1h-1zM19 9h1v1h-1zM10 10h1v1h-1zM12 10h1v1h-1zM14 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM11 11h1v1h-1zM13 11h1v1h-1zM15 11h1v1h-1zM17 11h1v1h-1zM19 11h1v1h-1zM10 12h1v1h-1zM12 12h1v1h-1zM14 12h1v1h-1zM16 12h1v1h-1zM18 12h1v1h-1zM11 13h1v1h-1zM13 13h1v1h-1zM15 13h1v1h-1zM17 13h1v1h-1zM19 13h1v1h-1zM10 14h1v1h-1zM12 14h1v1h-1zM14 14h1v1h-1zM16 14h1v1h-1zM18 14h1v1h-1zM11 15h1v1h-1zM13 15h1v1h-1zM15 15h1v1h-1zM17 15h1v1h-1zM19 15h1v1h-1zM10 16h1v1h-1zM12 16h1v1h-1zM14 16h1v1h-1zM16 16h1v1h-1zM18 16h1v1h-1zM11 17h1v1h-1zM13 17h1v1h-1zM15 17h1v1h-1zM17 17h1v1h-1zM19 17h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM14 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM11 19h1v1h-1zM13 19h1v1h-1zM15 19h1v1h-1zM17 19h1v1h-1zM19 19h1v1h-1zM20 20h1v1h-1zM0 20h1v1H0zM2 20h1v1H2zM4 20h1v1H4zM6 20h1v1H6zM8 20h1v1H8zM10 20h1v1h-1zM12 20h1v1h-1zM14 20h1v1h-1zM16 20h1v1h-1zM18 20h1v1h-1zM20 0h1v1h-1zM20 2h1v1h-1zM20 4h1v1h-1zM20 6h1v1h-1zM20 8h1v1h-1zM20 10h1v1h-1zM20 12h1v1h-1zM20 14h1v1h-1zM20 16h1v1h-1zM20 18h1v1h-1z"
				/>
			</svg>
		</button>
	</div>
</div>
