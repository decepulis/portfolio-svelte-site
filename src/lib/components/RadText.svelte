<script lang="ts">
	import { spring } from 'svelte/motion';
	import uiStore from '$lib/stores/ui.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	let scrollY = $state(0);
	let isSpringing = $state(false);

	const scrollSpring0 = spring({ scrollY: 0 }, { stiffness: 0.05, damping: 1 });
	const scrollSpring1 = spring({ scrollY: 0 }, { stiffness: 0.075, damping: 1 });
	const scrollSpring2 = spring({ scrollY: 0 }, { stiffness: 0.1, damping: 1 });
	const scrollSpring3 = spring({ scrollY: 0 }, { stiffness: 0.15, damping: 1 });
	const scrollSpring4 = spring({ scrollY: 0 }, { stiffness: 0.2, damping: 1 });

	$effect(() => {
		isSpringing = true;
		scrollSpring0.set({ scrollY }).then(() => (isSpringing = false));
		scrollSpring1.set({ scrollY });
		scrollSpring2.set({ scrollY });
		scrollSpring3.set({ scrollY });
		scrollSpring4.set({ scrollY });
	});
</script>

<svelte:window bind:scrollY />

<span class="wrapper relative" class:reduce-motion={uiStore.shouldReduceMotion}>
	<span
		class="text-red pointer-events-none absolute whitespace-nowrap transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		style:transform="translateY({scrollY - $scrollSpring0.scrollY}px)"
		style:opacity={isSpringing ? 1 : 0}
	>
		{@render children()}
	</span>
	<span
		class="text-yellow pointer-events-none absolute whitespace-nowrap transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		style:transform="translateY({scrollY - $scrollSpring1.scrollY}px)"
		style:opacity={isSpringing ? 1 : 0}
	>
		{@render children()}
	</span>
	<span
		class="text-lime pointer-events-none absolute whitespace-nowrap transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		style:transform="translateY({scrollY - $scrollSpring2.scrollY}px)"
		style:opacity={isSpringing ? 1 : 0}
	>
		{@render children()}
	</span>
	<span
		class="text-green pointer-events-none absolute whitespace-nowrap transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		style:transform="translateY({scrollY - $scrollSpring3.scrollY}px)"
		style:opacity={isSpringing ? 1 : 0}
	>
		{@render children()}
	</span>
	<span
		class="text-blue pointer-events-none absolute whitespace-nowrap transition-opacity duration-100 ease-in-out will-change-transform"
		aria-hidden="true"
		style:transform="translateY({scrollY - $scrollSpring4.scrollY}px)"
		style:opacity={isSpringing ? 1 : 0}
	>
		{@render children()}
	</span>
	<span class="relative whitespace-nowrap">
		{@render children()}
	</span>
</span>
