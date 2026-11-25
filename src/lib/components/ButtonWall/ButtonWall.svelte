<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { Tween, prefersReducedMotion } from 'svelte/motion';

	import '@fontsource/silkscreen/400.css';

	import BestViewed from './badges/BestViewed.svelte';
	import Bluesky from './badges/Bluesky.svelte';
	import Counter from './badges/Counter.svelte';
	import Email from './badges/Email.svelte';
	import GitHub from './badges/GitHub.svelte';
	import Instagram from './badges/Instagram.svelte';
	import LinkedIn from './badges/LinkedIn.svelte';
	import X from './badges/X.svelte';

	/** total page views, baked in at build; null if unavailable */
	const { visits }: { visits: number | null } = $props();

	let wall: HTMLUListElement;
	let inView = $state(false);
	const odometer = new Tween(0, { easing: cubicOut });

	// pause the badges' animations while the wall is off screen
	$effect(() => {
		const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), {
			threshold: 0.25
		});
		observer.observe(wall);
		return () => observer.disconnect();
	});

	// roll the odometer up the first time someone scrolls to it
	let rolled = false;
	$effect(() => {
		if (visits === null || !inView || rolled) return;
		rolled = true;
		const duration = prefersReducedMotion.current ? 0 : Math.min(3000, 1200 + visits / 4);
		odometer.set(visits, { duration });
	});

	const visitLabel = $derived(
		visits === null ? 'Visitor counter' : `${visits.toLocaleString('en-US')} visitors`
	);
</script>

<!--
	Eight badges, so 2 or 4 columns always fill every row. Change the count and
	revisit this. Columns top out at 176px, exactly 2× the 88px badge, in px on purpose:
	this is about badge pixels, and the root font size here is 18px.
-->
<ul
	bind:this={wall}
	role="list"
	class="grid grid-cols-[repeat(2,minmax(0,176px))] gap-2 md:grid-cols-[repeat(4,176px)]"
	class:paused={!inView}
>
	<li><Email /></li>
	<li><GitHub /></li>
	<li><LinkedIn /></li>
	<li><Bluesky /></li>
	<li><Instagram /></li>
	<li><X /></li>
	<li><Counter value={visits === null ? null : odometer.current} label={visitLabel} /></li>
	<li><BestViewed /></li>
</ul>

<style>
	/* These override whatever animation each badge declares, hence !important. */
	.paused :global(*) {
		animation-play-state: paused !important;
	}
	@media (prefers-reduced-motion: reduce) {
		ul :global(*) {
			animation: none !important;
		}
	}
</style>
