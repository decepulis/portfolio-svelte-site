<script lang="ts">
	import { spring } from 'svelte/motion';
	import ui from '$lib/stores/ui.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	const { shouldReduceMotion } = $derived(ui);

	let scrollY = $state(0);
	let isSpringing = $state(false);

	const scrollSpring0 = spring({ scrollY: 0 }, { stiffness: 0.05, damping: 1 });
	const scrollSpring1 = spring({ scrollY: 0 }, { stiffness: 0.075, damping: 1 });
	const scrollSpring2 = spring({ scrollY: 0 }, { stiffness: 0.1, damping: 1 });
	const scrollSpring3 = spring({ scrollY: 0 }, { stiffness: 0.15, damping: 1 });
	const scrollSpring4 = spring({ scrollY: 0 }, { stiffness: 0.2, damping: 1 });

	$effect(() => {
		if (shouldReduceMotion) return;
		isSpringing = true;
		scrollSpring0.set({ scrollY }).then(() => (isSpringing = false));
		scrollSpring1.set({ scrollY });
		scrollSpring2.set({ scrollY });
		scrollSpring3.set({ scrollY });
		scrollSpring4.set({ scrollY });
	});
</script>

<svelte:window bind:scrollY />

<span
	class="wrapper relative block"
	style:--translate0={scrollY - $scrollSpring0.scrollY}
	style:--translate1={scrollY - $scrollSpring1.scrollY}
	style:--translate2={scrollY - $scrollSpring2.scrollY}
	style:--translate3={scrollY - $scrollSpring3.scrollY}
	style:--translate4={scrollY - $scrollSpring4.scrollY}
	style:--opacity={isSpringing || shouldReduceMotion ? 1 : 0}
>
	<span
		class="text-red pointer-events-none absolute inset-0 transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
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
