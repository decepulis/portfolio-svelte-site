<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Spring, prefersReducedMotion } from 'svelte/motion';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	const shouldReduceMotion = $derived(prefersReducedMotion.current);

	let scrollY = $state(0);

	// one spring per layer, each a little stiffer, so the layers fan out as you scroll
	const [spring0, spring1, spring2, spring3, spring4] = [0.05, 0.075, 0.1, 0.15, 0.2].map(
		(stiffness) => Spring.of(() => scrollY, { stiffness, damping: 1 })
	);
	// the layers show while the slowest one is still catching up
	const isSpringing = $derived(spring0.current !== scrollY);
</script>

<svelte:window bind:scrollY />

<span
	class="wrapper relative block"
	style:--translate0={scrollY - spring0.current}
	style:--translate1={scrollY - spring1.current}
	style:--translate2={scrollY - spring2.current}
	style:--translate3={scrollY - spring3.current}
	style:--translate4={scrollY - spring4.current}
	style:--opacity={isSpringing || shouldReduceMotion ? 1 : 0}
>
	<span
		class="text-red pointer-events-none absolute inset-0 transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		data-nosnippet="true"
		style:transform={shouldReduceMotion
			? 'translate3d(5px,5px,0)'
			: `translateY(calc(1px * var(--translate0)))`}
		style:opacity="var(--opacity)"
	>
		{@render children()}
	</span>
	<span
		class="text-yellow pointer-events-none absolute inset-0 transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		data-nosnippet="true"
		style:transform={shouldReduceMotion
			? 'translate3d(4px,4px,0)'
			: `translateY(calc(1px * var(--translate1)))`}
		style:opacity="var(--opacity)"
	>
		{@render children()}
	</span>
	<span
		class="text-lime pointer-events-none absolute inset-0 transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		data-nosnippet="true"
		style:transform={shouldReduceMotion
			? 'translate3d(3px,3px,0)'
			: `translateY(calc(1px * var(--translate2)))`}
		style:opacity="var(--opacity)"
	>
		{@render children()}
	</span>
	<span
		class="text-green pointer-events-none absolute inset-0 transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		data-nosnippet="true"
		style:transform={shouldReduceMotion
			? 'translate3d(2px,2px,0)'
			: `translateY(calc(1px * var(--translate3)))`}
		style:opacity="var(--opacity)"
	>
		{@render children()}
	</span>
	<span
		class="text-blue pointer-events-none absolute inset-0 transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		data-nosnippet="true"
		style:transform={shouldReduceMotion
			? 'translate3d(1px,1px,0)'
			: `translateY(calc(1px * var(--translate4)))`}
		style:opacity="var(--opacity)"
	>
		{@render children()}
	</span>
	<span class="relative">
		{@render children()}
	</span>
</span>

<style>
	/*
	 * iOS throttles page scroll positions to ~10Hz while the URL bar resizes,
	 * which snaps the layers. A scroll-driven animation of a property the GPU
	 * can't animate opts the page out of that throttle. It changes nothing
	 * visible: both keyframes are transparent.
	 * https://rida.dev/blog/bypassing-ios-safari-60-fps-limit
	 */
	@supports (animation-timeline: scroll()) {
		.wrapper {
			animation: keep-scroll-fresh linear both;
			animation-timeline: scroll(root);
		}
	}
	@keyframes keep-scroll-fresh {
		from {
			background-color: rgb(0 0 0 / 0);
		}
		to {
			background-color: rgb(255 255 255 / 0);
		}
	}
</style>
