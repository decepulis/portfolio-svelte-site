<script lang="ts">
	import RadText from '$lib/components/RadText.svelte';
</script>

<!-- clip-path, not just overflow, clips RadText's fixed layers to the hero -->
<section
	id="hero"
	class="flex min-h-svh flex-col items-center justify-center overflow-hidden px-2 text-center [clip-path:inset(0)]"
>
	<p class="mb-2">Hello there! My name is</p>
	<h1 class="text-5xl font-bold sm:text-6xl">
		<RadText>Darius Cepulis</RadText>
	</h1>
	<p class="mt-4">
		I help make great <span class="whitespace-nowrap">developer experiences.</span>
	</p>
</section>
