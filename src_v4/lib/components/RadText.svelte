<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { reduceMotion } from '$lib/stores';

	export let text: string;

	// Use scroll value to manage springs
	let scrollY: number;

	const scrollSpring0 = spring({ scrollY: 0 }, { stiffness: 0.05, damping: 1 });
	const scrollSpring1 = spring({ scrollY: 0 }, { stiffness: 0.075, damping: 1 });
	const scrollSpring2 = spring({ scrollY: 0 }, { stiffness: 0.1, damping: 1 });
	const scrollSpring3 = spring({ scrollY: 0 }, { stiffness: 0.15, damping: 1 });
	const scrollSpring4 = spring({ scrollY: 0 }, { stiffness: 0.2, damping: 1 });
	let isSpringing = false;
	$: {
		isSpringing = true;

		scrollSpring0.set({ scrollY }).then(() => (isSpringing = false));
		scrollSpring1.set({ scrollY });
		scrollSpring2.set({ scrollY });
		scrollSpring3.set({ scrollY });
		scrollSpring4.set({ scrollY });
	}

	let container: HTMLSpanElement;
	let canvas: HTMLCanvasElement;

	let canvasWidth: number;
	let canvasHeight: number;
	let dpr = 2;

	let font: string;
	const updateCanvasSizeAndScale = (width: number, height: number) => {
		// Set display size (css pixels).
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		// Set actual size in memory (scaled to account for extra pixel density).
		dpr = window.devicePixelRatio ?? 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;

		// Normalize coordinate system to use css pixels.
		canvas.getContext('2d').scale(dpr, dpr);
	};
	const updateCanvasFont = () => {
		// firefox doesn't support grabbing just .getPropertyValue('font')
		const canvasComputedStyle = window.getComputedStyle(canvas);
		const fontStyle = canvasComputedStyle.getPropertyValue('font-style');
		const fontVariant = canvasComputedStyle.getPropertyValue('font-variant');
		const fontWeight = canvasComputedStyle.getPropertyValue('font-weight');
		const fontSize = canvasComputedStyle.getPropertyValue('font-size');
		const lineHeight = canvasComputedStyle.getPropertyValue('line-height');
		const fontFamily = canvasComputedStyle.getPropertyValue('font-family');

		font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
	};
	$: {
		// This hook runs whenever canvasWidth or canvasHeight change
		if (typeof canvas === 'undefined') break $;
		updateCanvasSizeAndScale(canvasWidth, canvasHeight);
		updateCanvasFont();
	}
	onMount(() => {
		// What's this all going to look like, anyways?

		// Animation loop!
		let frame: ReturnType<typeof requestAnimationFrame>;

		function loop() {
			frame = requestAnimationFrame(loop);

			const ctx = canvas.getContext('2d');

			ctx.font = font;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'alphabetic';

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const textMetrics = ctx.measureText(text);

			const baseXOffset = canvasWidth / 2;
			const baseYOffset =
				//  I have no clue how or why this incantation works
				//  and at this point I'm too afraid to ask
				canvasHeight / 2 + scrollY + textMetrics.actualBoundingBoxAscent / 2 + 1.75;

			if (!$reduceMotion) {
				const documentComputedStyle = window.getComputedStyle(document.documentElement);
				ctx.fillStyle = `rgb(${documentComputedStyle.getPropertyValue('--c5')})`;
				ctx.fillText(text, baseXOffset, baseYOffset - $scrollSpring0.scrollY);
				ctx.fillStyle = `rgb(${documentComputedStyle.getPropertyValue('--c4')})`;
				ctx.fillText(text, baseXOffset, baseYOffset - $scrollSpring1.scrollY);
				ctx.fillStyle = `rgb(${documentComputedStyle.getPropertyValue('--c3')})`;
				ctx.fillText(text, baseXOffset, baseYOffset - $scrollSpring2.scrollY);
				ctx.fillStyle = `rgb(${documentComputedStyle.getPropertyValue('--c2')})`;
				ctx.fillText(text, baseXOffset, baseYOffset - $scrollSpring3.scrollY);
				ctx.fillStyle = `rgb(${documentComputedStyle.getPropertyValue('--c1')})`;
				ctx.fillText(text, baseXOffset, baseYOffset - $scrollSpring4.scrollY);
			}
		}

		loop();

		return () => cancelAnimationFrame(frame);
	});
</script>

<span class="rad-container" bind:this={container}>
	<div class="canvas-container" bind:offsetWidth={canvasWidth} bind:offsetHeight={canvasHeight}>
		<canvas bind:this={canvas} class:show={isSpringing} />
	</div>
	<span class="text-container">{text}</span>
</span>

<svelte:window bind:scrollY />

<style>
	.rad-container {
		white-space: nowrap;
		position: relative;
		display: inline-block;
	}
	.text-container {
		position: relative;
	}
	.canvas-container {
		pointer-events: none;
		position: absolute;
		width: 100%;
		left: 0;

		/*  This happens to work because the text is centered;
			If I reuse this component, I should rethink this */
		height: calc(100 * var(--load-vh, 1vh));
		top: calc(-50 * var(--load-vh, 1vh) + 50%);
	}
	canvas {
		opacity: 0;
		transition: opacity var(--transition-speed-medium);
	}
	canvas.show {
		opacity: 1;
		transition: opacity 0s; /* appear immediately on start */
	}
</style>
