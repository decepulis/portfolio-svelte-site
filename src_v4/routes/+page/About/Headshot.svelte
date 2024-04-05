<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	import { altMode, darkMode } from '$lib/stores';

	const skin = 'hsl(25,85%,82%)';
	const beard = 'hsl(30,50%,65%)';
	const hair = 'hsl(35,35%,50%)';
	const eyes = 'hsl(120,78%,12%)';
	const glasses = 'hsl(30,15%,25%)';
	const shirt = 'rgb(var(--c3))';
	const buttons = 'rgba(var(--bg),0.50)';
	const stripes = 'rgba(var(--bg),0.17)';

	let svgElement: SVGElement;

	// now for some interactivity!
	// What happens on mouse move?
	let svgWidth = 300;
	let svgHeight = 300;

	// Rectangular coordinates of mouse relative to center of svg
	let distanceX = 0;
	let distanceY = 0;

	let maxDistanceX = 1;
	let maxDistanceY = 1;

	// In practice, we'll be using these percentages
	// instead of absolute distances in pixels
	// and we won't want transitions to be instant.
	// Here, we make that transformation and store it in a pair of springs
	const mouseSpringOpts = { stiffness: 0.1, damping: 1 };
	const percentX = spring(0, mouseSpringOpts);
	const percentY = spring(0, mouseSpringOpts);
	$: $percentX = Math.max(Math.min(distanceX / maxDistanceX, 1), -1);
	$: $percentY = Math.max(Math.min(distanceY / maxDistanceY, 1), -1);

	// This function runs when the user moves their mouse or clicks somewhere on the window
	const onWindowPointerUpdate = (e: MouseEvent | PointerEvent) => {
		const { x: mouseX, y: mouseY } = e;
		const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
		const {
			x: svgX,
			y: svgY,
			width: bcrSvgWidth,
			height: bcrSvgHeight
		} = svgElement.getBoundingClientRect();

		svgWidth = bcrSvgWidth;
		svgHeight = bcrSvgHeight;

		const svgCenterX = svgX + svgWidth / 2;
		const svgCenterY = svgY + svgHeight / 2;

		// calculate distance from svg center
		distanceX = mouseX - svgCenterX;
		distanceY = mouseY - svgCenterY;

		// the furthest the mouse can be from the center of the view
		// is the entire width/height of the viewport
		maxDistanceX = windowWidth;
		maxDistanceY = windowHeight;
	};

	// what happens on outfit change?
	let isChanged = false;

	let changeTimeout: ReturnType<typeof setTimeout>;
	onDestroy(() => clearTimeout(changeTimeout));

	const onOutfitChange = () => {
		isChanged = true;
		changeTimeout = setTimeout(() => {
			isChanged = false;
		}, 500);
	};
	// Trigger outfit change whenever system theme changes
	let hasTriggeredOnce = false;
	$: {
		if ($darkMode && $altMode) {
			if (hasTriggeredOnce) onOutfitChange();
			else hasTriggeredOnce = true;
		}
	}

	// What happens on mouse click?
	let isPoked = false;

	let pokeTimeout: ReturnType<typeof setTimeout>;
	onDestroy(() => clearTimeout(pokeTimeout));

	const onSvgClick = () => {
		isPoked = true;
		pokeTimeout = setTimeout(() => {
			isPoked = false;
		}, 200);
	};

	// So we've calculated where the mouse is relative to the center of the svg
	// and stored that in percentX and percentY,
	// and know the state of pokeage...
	// Let's use those numbers to animate a few layers in the svg.
	const changeSpring = spring(0, { stiffness: 0.15, damping: 1 });
	$: $changeSpring = isChanged ? 1 : 0;

	const pokeSpring = spring(0, { stiffness: 0.2, damping: 1 });
	$: $pokeSpring = isPoked ? 1 : 0;

	$: headXMax = svgWidth / 60;
	$: headX = $percentX * headXMax;

	$: headYMax = svgHeight / 60;
	$: headY = $percentY * headYMax;

	$: featuresXMax = svgWidth / 30;
	$: featuresX = $percentX * featuresXMax;

	$: featuresYMax = svgHeight / 30;
	$: featuresY = $percentY * featuresYMax;

	$: eyesXMax = svgWidth / 15;
	$: eyesX = $percentX * eyesXMax;

	// Lower eyes when changed
	$: eyesYMax = svgHeight / 15;
	$: eyesYMouse = $percentY * eyesYMax;
	$: eyesYChanged = $changeSpring * (svgHeight / 30);
	$: eyesY = eyesYMouse + eyesYChanged;

	$: browsX = featuresX;

	// Raise eyebrows when mouse is overhead, when poked, or when changed
	$: browsYMax = featuresYMax;
	$: browsYMin = svgHeight / 10;
	$: browsYPoked = $pokeSpring * (-svgHeight / 30);
	$: browsYChanged = $changeSpring * (-svgHeight / 45);
	$: browsYMouse = $percentY > 0 ? $percentY * browsYMax : $percentY * browsYMin;
	$: browsY = browsYPoked + browsYChanged + browsYMouse;

	$: earsX = -headX;
	$: earsY = -headY;

	// Finally, we'll occasionally swap the eyes out for blinking
	let isBlinking = false;
	let blinkTimeout: ReturnType<typeof setTimeout>;
	const openEyes = () => {
		isBlinking = false;
		// Humans blink 15-20 times per minute (once every 3-4 seconds)
		// That's too frequent for here, so we make that 6-8 seconds
		const nextBlinkSeconds = 6 + 2 * Math.random();
		blinkTimeout = setTimeout(closeEyes, nextBlinkSeconds * 1000);
	};
	const closeEyes = () => {
		isBlinking = true;
		blinkTimeout = setTimeout(openEyes, 100);
	};
	onMount(() => {
		closeEyes();
		return () => clearTimeout(blinkTimeout);
	});
</script>

<svelte:window on:pointerdown={onWindowPointerUpdate} on:pointermove={onWindowPointerUpdate} />

<svg
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xml:space="preserve"
	style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5"
	viewBox="0 0 500 500"
	bind:this={svgElement}
	on:click={onSvgClick}
	on:keydown={onSvgClick}
>
	<defs>
		<!-- collar back shape -->
		<path
			id="reuse-0"
			d="M187.569 374.084c27.18-.094 107.26-.165 124.862-.151 0 0-12.175-6.118-16.768-17.028 0 0-.583-4.64-8.919-2.519 0 0-18.202.909-30.45.909l-12.928.152c-12.248 0-30.62-1.213-30.62-1.213-8.846-2.121-9.186 3.485-9.186 3.485-2.892 9.243-15.991 16.365-15.991 16.365Z"
		>
			<!-- shirt front shape -->
			<path
				id="reuse-1"
				d="m111.699 404.541 100.631-36.73 37.045 84.21 38.717-84.958 100.209 37.478.161.062c27.475 10.77 89.317 104.636 89.317 104.636-12.077 10.152-98.168 7.912-92.37 13.037l-270.478.454.511-.303c5.905-5.22-81.144-3.036-93.221-13.188 0 0 62.09-94.243 89.478-104.698Z"
				style="fill:{shirt};"
			/>
			<!-- face shape -->
			<path
				id="reuse-2"
				d="M240.898 363.74c-20.666-.47-73.705-37.143-80.647-80.845l-5.43-117.267c0-48.405 39.357-69.968 87.666-69.968h18.463c48.309 0 87.665 21.563 87.665 69.968l-5.43 117.267c-6.941 43.702-59.981 80.375-80.646 80.845h-21.641Z"
				style="fill:{skin};"
			/>
		</path>
	</defs>

	<!-- collar back -->
	<use xlink:href="#reuse-0" style="fill:{shirt};" />
	<use xlink:href="#reuse-0" style="fill:#000;fill-opacity:0.21;fill-rule:nonzero" />

	<!-- neck -->
	<path d="M212.14 316.923h75.368V525.98H212.14z" style="fill:{skin};" />

	<!-- shirt front -->
	<use xlink:href="#reuse-1" style="fill:{shirt};fill-rule:nonzero" />

	<!-- flannel pattern -->
	<clipPath id="a">
		<use xlink:href="#reuse-1" clip-rule="nonzero" />
	</clipPath>
	<g clip-path="url(#a)" style="fill:{stripes};">
		<path
			d="M-1.431 346.535h502.862v12.898H-1.431zM-1.431 372.272h502.862v12.898H-1.431zM-1.431 410.725h502.862v12.898H-1.431zM-1.607 436.518h502.862v12.898H-1.607zM-1.431 475.026h502.862v12.898H-1.431zM-1.607 500.818h502.862v12.898H-1.607z"
		/>
		<path
			d="M-1.431 78.209v435.355h14.897V78.209H-1.431ZM28.297 78.209v435.355h14.897V78.209H28.297ZM72.712 78.209v435.355h14.897V78.209H72.712ZM102.504 78.361v435.355h14.897V78.361h-14.897ZM146.983 78.209v435.355h14.898V78.209h-14.898ZM176.775 78.361v435.355h14.898V78.361h-14.898ZM221.535 78.209v435.355h14.898V78.209h-14.898ZM251.263 78.209v435.355h14.898V78.209h-14.898ZM295.678 78.209v435.355h14.898V78.209h-14.898ZM325.47 78.361v435.355h14.898V78.361H325.47ZM369.95 78.209v435.355h14.897V78.209H369.95ZM399.742 78.361v435.355h14.897V78.361h-14.897ZM444.269 78.209v435.355h14.898V78.209h-14.898ZM474.061 78.361v435.355h14.898V78.361h-14.898Z"
		/>
	</g>

	<!-- collar front -->
	<path
		d="M255.784 406.208s25.647-21.961 36.969-48.593c.868-2.042-5.499-3.381-5.499-3.381 8.846-2.121 9.829 3.272 9.829 3.272 4.294 9.043 15.348 16.578 15.348 16.578-5.103 20.911-14.8 40.76-28.579 58.337l-12.418-11.672c-2.224 11.14-5.853 22.191-9.356 33.037l-1.531 4.546s-3.402 32.675-3.402 67.677l-19.053-3.485c0-19.069 1.06-54.99 2.026-61.031-3.794-11.469-8.524-27.125-11.191-41.083l-12.779 12.011c-13.779-17.577-23.476-37.426-28.579-58.337 0 0 13.099-7.122 15.991-16.365 0 0 .34-5.606 9.186-3.485 0 0-6.367 1.339-5.499 3.381 11.322 26.632 36.799 48.744 36.799 48.744s2.273 10.741 5.857 23.59c3.598-12.895 5.881-23.741 5.881-23.741Z"
		style="fill:{shirt};fill-rule:nonzero"
	/>
	<circle cx="241.943" cy="429.566" r="4.366" style="fill:{buttons};" />
	<circle cx="249.824" cy="477.819" r="4.366" style="fill:{buttons};" />

	<!-- ears -->
	<g style="transform:translate3d({earsX}px,{earsY}px,0);">
		<ellipse cx="152.916" cy="260.121" rx="21.681" ry="21.464" style="fill:{skin};" />
		<path
			d="M141.806 262.171c7.782-2.715 12.339-2.863 19.625.335"
			style="fill:none;stroke:#000;stroke-opacity:.51;stroke-width:3px"
		/>
		<ellipse cx="356.777" cy="260.121" rx="21.681" ry="21.464" style="fill:{skin};" />
		<path
			d="M346.153 260.978c7.783-2.714 12.339-2.862 19.626.335"
			style="fill:none;stroke:#000;stroke-opacity:.51;stroke-width:3px"
		/>
	</g>

	<!-- head shape -->
	<g style="transform:translate3d({headX}px,{headY}px,0);">
		<!-- face -->
		<use xlink:href="#reuse-2" style="fill:{skin};" />

		<!-- beard -->
		<clipPath id="b">
			<use xlink:href="#reuse-2" />
		</clipPath>

		<path
			d="M347.455 245.993c0-16.938-9.941 51.868-42.306 72.108-13.093 8.188-1.187-19.355-53.431-20.934-49.093-1.484-48.875 28.195-60.773 19.459-29.013-21.306-32.062-90.283-32.062-73.754l1.616 131.212h188.116l-1.16-128.091Z"
			style="fill:{beard};"
			clip-path="url(#b)"
		/>

		<!-- hair -->
		<path
			d="M146.118 119.933c-2.85-9.124-10.471-38.541-4.919-53.182 1.417-3.736 13.807 10.67 13.622 7.198-.928-17.403 14.36-36.096 14.335-35.943-8.579 53.637 55.375 13.754 96.062 11.518 82.75-4.547 73.866 50.828 73.866 50.828s9.873-2.537 20.332 12.718c12.521 18.263 10.995 33.63 10.995 33.63l-25.346 95.591 3.112-67.207c0-14.562-32.142-57.323-76.14-59.663-26.985-1.434-62.732.015-81.092 9.429-17.771 9.112-29.867 41.173-29.867 50.354l-2.195 67.668-19.6-96.172s-1.16-11.674 6.835-26.767Z"
			style="fill:{hair};"
		/>
	</g>

	<!-- eye brows -->
	<g style="transform:translate3d({browsX}px,{browsY}px,0);">
		<path
			d="M229.818 203.829c-20.802-13.349-46.033-7.088-64.125 2.229M273.618 203.856c20.803-13.348 46.033-7.087 64.125 2.23"
			style="fill:none;stroke:#000;stroke-opacity:.62;stroke-width:4px;"
		/>
	</g>

	<g style="transform:translate3d({eyesX}px,{eyesY}px,0);">
		{#if isBlinking}
			<!-- blink -->
			<g style="fill:none;stroke:{eyes};stroke-width:4px;">
				<path d="M 207.358 232.291 m -10, 0 a 10, 10 0 1, 0 20, 0" />
				<path d="M 292.373 232.291 m -10, 0 a 10, 10 0 1, 0 20, 0" />
			</g>
		{:else}
			<!-- eyes -->
			<g style="fill:{eyes};">
				<circle cx="207.358" cy="232.291" r="10" />
				<circle cx="292.373" cy="232.291" r="10" />
			</g>
		{/if}
	</g>

	<g style="transform:translate3d({featuresX}px,{featuresY}px,0);">
		<!-- mouth -->
		{#if isChanged}
			<ellipse cx="240.207" cy="322.381" rx="12" ry="8" style="fill:#000;fill-opacity:.75" />
		{:else}
			<path
				d="M222.207 312.381
			c13.211 10.96 42.734 8.457 51.515-1.5"
				style="fill:none;stroke:#000;stroke-opacity:.62;stroke-width:3px"
			/>
		{/if}

		<!-- nose -->
		<path
			d="M236.522 285.584c12.053 5.429 19.108 5.725 30.392-.67"
			style="fill:none;stroke:#000;stroke-opacity:.51;stroke-width:3px"
		/>

		<!-- glasses -->
		<path
			d="M265.346 215.904c-4.542-1.743-10.199-2.588-14.59-2.261-4.766.355-7.923 1.015-11.988 3.234-4.066 2.219-30.377-25.59-90.008 2.639l.333 9.984s7.052-1.311 7.839 7.079c.786 8.389 5.354 46.631 42.31 45.278 36.956-1.353 45.821-39.561 44.467-49.771 0 0-3.401-12.134 7.228-13 13.228-1.078 10.49 12.351 10.49 12.351-.67 10.285 10.715 47.75 47.671 46.397 36.956-1.353 38.969-39.835 39.195-48.262.226-8.427 7.349-7.635 7.349-7.635l-.333-9.984c-61.363-23.799-89.963 3.951-89.963 3.951Zm-31.027 38.624c-6.214 14.459-20.289 23.65-35.531 23.201-26.991.003-39.887-29.422-34.877-48.443 5.011-19.021 32.626-19.15 32.626-19.15 58.83-2.746 37.782 44.392 37.782 44.392Zm74.957 19.156c-15.174 1.562-29.826-6.577-36.987-20.546-7.161-13.97-24.134-45.483 34.736-47.047 0 0 27.556-1.892 33.82 16.716 6.263 18.608-4.644 48.905-31.569 50.877Z"
			style="fill:{glasses};"
		/>
	</g>
</svg>

<style>
	svg {
		display: block;
		width: 100%;
	}
</style>
