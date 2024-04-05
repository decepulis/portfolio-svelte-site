<script lang="ts">
	import { spring } from 'svelte/motion';
	import type { Positions } from './position.d';

	export let positions: Positions;

	let svgElement: SVGElement;
	let pathElement: SVGPathElement;
	let innerHeight: number;

	let width = 0;
	let height = 0;
	let xOffset = width / 3;

	$: pointCount = positions.length;
	let coordinates: Array<{ x: number; y: number }> = [];
	let drawCommands = '';

	const onResize = () => {
		if (typeof svgElement === 'undefined') return;
		if (typeof pathElement === 'undefined') return;

		// Recalculate viewbox
		const svgRect = svgElement.getBoundingClientRect();
		width = svgRect.width;
		height = svgRect.height;

		xOffset = width / 3;

		coordinates = Array.from(Array(pointCount)).map((__, idx) => ({
			x: idx % 2 === 0 ? xOffset : width - xOffset,
			y: (height * idx) / (pointCount - 1)
		}));

		drawCommands = coordinates
			.map(({ x, y }, idx) => {
				if (idx === 0) {
					return `M ${x},${y}`;
				}
				const { x: prevX, y: prevY } = coordinates[idx - 1];
				const halfwayY = (prevY + y) / 2;
				return `C ${prevX},${halfwayY} ${x},${halfwayY} ${x},${y}`;
			})
			.join(' ');
	};

	let scrollPercent = spring({ value: 0 });

	// https://css-tricks.com/scroll-drawing/
	const onScroll = () => {
		if (typeof svgElement === 'undefined') return;

		const { top, bottom, height } = svgElement?.getBoundingClientRect() ?? {};
		const delay = innerHeight / 4;
		const topProgress = top - innerHeight + delay;
		const bottomProgress = bottom - innerHeight + delay;

		if (topProgress > 0) {
			scrollPercent.set({ value: 1.01 });
			return;
		} else if (bottomProgress < 0) {
			scrollPercent.set({ value: 0 });
			return;
		}

		scrollPercent.set({ value: bottomProgress / height });
	};
	// Run functions when refs have definition
	$: {
		if (typeof svgElement === 'undefined' || typeof pathElement === 'undefined') break $;
		onResize();
		onScroll();
	}
</script>

<svelte:window on:scroll={onScroll} on:resize={onResize} bind:innerHeight />
<svg viewBox="0 0 {width} {height}" preserveAspectRatio="none" bind:this={svgElement}>
	<path
		d={drawCommands}
		pathLength="1"
		stroke-dasharray={$scrollPercent.value > 0 ? '1 1' : 'none'}
		stroke-dashoffset={$scrollPercent.value}
		bind:this={pathElement}
	/>
	{#each coordinates as { x, y }}
		<path
			d="M {x},{y} C {x + 50},{y - 50} {x + 50},{y + 50} {x},{y}"
			pathLength="1"
			transform-origin="{x} {y}"
			class="appear"
			class:visible={height * (1 - $scrollPercent.value) >= y}
		/>
	{/each}
</svg>

<style>
	svg {
		height: 100vh;
		min-height: color(--container-width);
		width: 100%;
		overflow: visible;
	}
	path {
		stroke: rgb(var(--c3));
		stroke-width: 1rem;
		stroke-linecap: round;
		fill: none;
		transition: stroke var(--transition-speed-medium);
	}
	.appear {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset 0.1s, stroke var(--transition-speed-medium);
	}
	.appear.visible {
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 0.5s, stroke var(--transition-speed-medium);
	}
	@media (prefers-reduced-motion: reduce) {
		path {
			stroke-dasharray: none !important;
			stroke-dashoffset: none !important;
		}
	}
</style>
