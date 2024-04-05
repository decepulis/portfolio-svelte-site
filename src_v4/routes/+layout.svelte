<script>
	import './global.css';
	import FaviconManager from '$lib/components/FaviconManager.svelte';
	import ReduceMotionManager from '$lib/components/ReduceMotionManager.svelte';
</script>

<FaviconManager />
<ReduceMotionManager />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:ital@0;1&family=Playfair+Display:wght@900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<slot />
