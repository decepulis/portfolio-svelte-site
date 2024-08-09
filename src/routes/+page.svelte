<script lang="ts">
	import type { PageData } from './$types';
	import Hero from './+page/0.Hero.svelte';
	import About from './+page/1.About.svelte';
	import Work from './+page/2.Work.svelte';
	import Contact from './+page/3.Contact.svelte';
	import Nav from './+page/Nav.svelte';

	const { data }: { data: PageData } = $props();
	console.log('client', import.meta.env);
</script>

<main class="pb-8">
	<Hero />
	<Nav />
	<About />
	<Work posts={data.posts} />
	<Contact />
</main>
