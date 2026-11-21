<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Spring } from 'svelte/motion';

	import ui from '$lib/stores/ui.svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	const { shouldReduceMotion } = $derived(ui);

	// Slowest first, so the quickest layer is drawn nearest the text.
	const layers = [
		{ color: 'text-red', spring: new Spring(0, { stiffness: 0.05, damping: 1 }) },
		{ color: 'text-yellow', spring: new Spring(0, { stiffness: 0.075, damping: 1 }) },
		{ color: 'text-lime', spring: new Spring(0, { stiffness: 0.1, damping: 1 }) },
		{ color: 'text-green', spring: new Spring(0, { stiffness: 0.15, damping: 1 }) },
		{ color: 'text-blue', spring: new Spring(0, { stiffness: 0.2, damping: 1 }) }
	];

	let wrapper: HTMLElement | undefined = $state();
	let scrollY = $state(0);
	let isSpringing = $state(false);
	let box = $state({ top: 0, left: 0, width: 0 });

	// The layers are fixed to the viewport and placed only by their springs.
	// iOS scrolls the page off the main thread and can leave scrollY stale for
	// ~100ms; if the layers scrolled with the page and were offset by
	// scrollY - spring, that stale value would land on screen as a snap.
	// Here it only nudges a spring's target, and springs move smoothly.
	$effect(() => {
		if (shouldReduceMotion || !wrapper) return;
		let top = 0;
		for (let el: HTMLElement | null = wrapper; el; el = el.offsetParent as HTMLElement | null) {
			top += el.offsetTop;
		}
		box = { top, left: wrapper.getBoundingClientRect().left, width: wrapper.offsetWidth };

		isSpringing = true;
		const [slowest, ...rest] = layers;
		slowest.spring.set(scrollY).then(() => (isSpringing = false));
		rest.forEach(({ spring }) => spring.set(scrollY));
	});
</script>

<svelte:window bind:scrollY />

<span bind:this={wrapper} class="relative block">
	{#each layers as { color, spring }, i (color)}
		<span
			class="{color} pointer-events-none transition-opacity duration-100 ease-in-out will-change-transform {shouldReduceMotion
				? 'absolute inset-0'
				: 'fixed top-0'}"
			aria-hidden="true"
			data-nosnippet="true"
			style:left={shouldReduceMotion ? null : `${box.left}px`}
			style:width={shouldReduceMotion ? null : `${box.width}px`}
			style:transform={shouldReduceMotion
				? `translate3d(${5 - i}px,${5 - i}px,0)`
				: `translateY(${box.top - spring.current}px)`}
			style:opacity={isSpringing || shouldReduceMotion ? 1 : 0}
		>
			{@render children()}
		</span>
	{/each}
	<span class="relative">
		{@render children()}
	</span>
</span>
