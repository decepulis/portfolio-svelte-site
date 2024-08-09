<script lang="ts">
	import ui from '$lib/stores/ui.svelte';
	const theme = $derived(ui.theme);

	const svg = $derived(theme === 'dark' ? 'dark.svg' : 'light.svg');
	const png = $derived(theme === 'dark' ? 'dark.png' : 'light.png');
	const themeColor = $derived(theme === 'dark' ? '#000000' : '#ffffff');
</script>

<svelte:head>
	<link rel="icon" href="/favicons/{svg}" type="image/svg+xml" />
	<link rel="icon" href="/favicons/{png}" type="image/png" />
	<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
	<meta name="theme-color" content={themeColor} />
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>
