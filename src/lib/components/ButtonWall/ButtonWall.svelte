<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	import '@fontsource/silkscreen/400.css';

	import ui from '$lib/stores/ui.svelte';

	import Badge from './Badge.svelte';
	import { extras, links } from './badges';
	import { FONT, clearTextCache } from './pixel';

	/** total page views, baked in at build; null if unavailable */
	const { visits }: { visits: number | null } = $props();

	let wall: HTMLUListElement;
	let tick = $state(0);
	let ready = $state(false);
	let inView = $state(false);
	const odometer = new Tween(0, { easing: cubicOut });

	// the canvas needs the pixel font before it can draw text
	$effect(() => {
		document.fonts
			.load(`8px ${FONT}`)
			.catch(() => {})
			.finally(() => {
				clearTextCache();
				ready = true;
			});
	});

	// only animate while the wall is on screen
	$effect(() => {
		const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), {
			threshold: 0.25
		});
		observer.observe(wall);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!inView || ui.shouldReduceMotion) return;
		const id = setInterval(() => tick++, 1000 / 16);
		return () => clearInterval(id);
	});

	// roll the odometer up the first time someone scrolls to it
	let rolled = false;
	$effect(() => {
		if (visits === null || !inView || rolled) return;
		rolled = true;
		const duration = ui.shouldReduceMotion ? 0 : Math.min(3000, 1200 + visits / 4);
		odometer.set(visits, { duration });
	});

	const visitLabel = $derived(
		visits === null ? 'Visitor counter' : `${visits.toLocaleString('en-US')} visitors`
	);
</script>

<ul bind:this={wall} role="list" class="flex flex-wrap gap-2">
	{#each links as badge (badge.id)}
		<li class="w-[min(11rem,calc(50%-0.25rem))]">
			<Badge {badge} {tick} {ready} />
		</li>
	{/each}
	<li class="w-[min(11rem,calc(50%-0.25rem))]">
		<Badge badge={extras.counter} {tick} {ready} value={odometer.current} label={visitLabel} />
	</li>
	<li class="w-[min(11rem,calc(50%-0.25rem))]">
		<Badge badge={extras.browser} {tick} {ready} />
	</li>
</ul>
{#if visits !== null}
	<p class="mt-4 font-serif">
		Thanks for stopping by! You're visitor number {visits.toLocaleString('en-US')}.
	</p>
{/if}
