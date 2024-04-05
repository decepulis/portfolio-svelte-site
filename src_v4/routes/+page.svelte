<script lang="ts">
	import Hero from './+page/Hero.svelte';
	import Nav from './+page/Nav.svelte';
	import About from './+page/About/index.svelte';
	import Work from './+page/Work/index.svelte';
	import Projects from './+page/Projects/index.svelte';
	import Contact from './+page/Contact/index.svelte';
	import Credits from './+page/Credits.svelte';
</script>

<Hero />
<Nav />
<main>
	<About />
	<Work />
	<Projects />
	<Contact />
	<Credits />
</main>

<style>
	main {
		overflow-x: hidden;
	}
	main :global(h2) {
		text-align: center;
	}
	@media (min-width: 42rem) {
		main :global(h2) {
			text-align: unset;
		}
	}
</style>
