<script lang="ts">
	import type { PageData } from './$types';
	import Hero from './+page/0.Hero.svelte';
	import About from './+page/1.About.svelte';
	import Work from './+page/2.Work.svelte';
	import Contact from './+page/3.Contact.svelte';
	import Credit from './+page/4.Credit.svelte';
	import Nav from './+page/Nav.svelte';

	const { data }: { data: PageData } = $props();
</script>

<Hero />
<Nav />
<About />
<Work posts={data.posts} />
<Contact />
<Credit />
