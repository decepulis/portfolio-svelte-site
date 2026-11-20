<script lang="ts">
	import ButtonWall from '$lib/components/ButtonWall/ButtonWall.svelte';
	import H1 from '$lib/components/typography/H1.svelte';
	import Section from '$lib/components/typography/Section.svelte';

	const { visits }: { visits: number | null } = $props();
</script>

<Section id="contact">
	<H1 as="h2">Where to find me and how to reach me</H1>
	<ButtonWall {visits} />
</Section>
