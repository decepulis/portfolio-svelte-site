<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	import '@fontsource/silkscreen/400.css';

	import ui from '$lib/stores/ui.svelte';

	import Badge from './Badge.svelte';
	import StatusBar from './StatusBar.svelte';
	import { type BadgeSpec, extras, links } from './badges';
	import { FONT } from './pixel';

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
			.finally(() => (ready = true));
	});

	// only animate while the wall is on screen
	$effect(() => {
		const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), {
			threshold: 0.25
		});
		observer.observe(wall);
		return () => observer.disconnect();
	});

	// 8fps: the choppy rate of an animated GIF
	$effect(() => {
		if (!inView || ui.shouldReduceMotion) return;
		const id = setInterval(() => tick++, 1000 / 8);
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

	const visitCount = $derived(visits?.toLocaleString('en-US'));
	const visitLabel = $derived(visitCount ? `${visitCount} visitors` : 'Visitor counter');

	// the badge under the pointer (or keyboard focus), for the status bar
	// raw, so it holds the badge itself rather than a proxy (we compare by identity)
	let hot = $state.raw<BadgeSpec | null>(null);
	const hotChange = (badge: BadgeSpec) => (on: boolean) => {
		if (on) hot = badge;
		else if (hot === badge) hot = null;
	};

	const status = $derived.by(() => {
		if (hot === extras.counter) {
			return visitCount
				? `${visitCount} page views since 2023, counted at the last deploy`
				: 'The visit count is unavailable right now';
		}
		// at rest, what a browser's status bar said once the page had loaded
		return hot?.status ?? 'Document: Done';
	});
</script>

<!--
	Eight badges, so 2 or 4 columns always fill every row. Change the count and
	revisit this. Columns top out at 176px, exactly 2× the 88px canvas, in px on purpose:
	this is about canvas pixels, and the root font size here is 18px.
-->
<div class="w-fit max-w-full">
	<ul
		bind:this={wall}
		role="list"
		class="grid grid-cols-[repeat(2,minmax(0,176px))] gap-2 md:grid-cols-[repeat(4,176px)]"
	>
		{#each links as badge (badge.id)}
			<li>
				<Badge {badge} {tick} {ready} onhotchange={hotChange(badge)} />
			</li>
		{/each}
		<li>
			<Badge
				badge={extras.counter}
				{tick}
				{ready}
				value={visits === null ? null : odometer.current}
				label={visitLabel}
				onhotchange={hotChange(extras.counter)}
			/>
		</li>
		<li>
			<Badge badge={extras.browser} {tick} {ready} onhotchange={hotChange(extras.browser)} />
		</li>
	</ul>
	<StatusBar message={status} />
</div>
