<script lang="ts">
	import H1 from '$lib/components/typography/H1.svelte';
	import P from '$lib/components/typography/P.svelte';
	import A from '$lib/components/typography/A.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Section from '$lib/components/typography/Section.svelte';
	import Headshot from '$lib/components/Headshot/index.svelte';
</script>

{#snippet short()}
	<P>
		I try and get devs excited about <A href="https://www.mux.com/">Mux</A>. I think the web is
		pretty neat!
	</P>
{/snippet}
{#snippet medium()}
	<P>
		I'm a Community Engineer at <A href="https://www.mux.com">Mux</A>, which means I work on making
		a great developer experience with great
		<A href="https://www.mux.com">code</A>, great
		<A href="https://docs.mux.com">docs</A>, great
		<A href="https://www.mux.com/team/darius-cepulis">posts</A>, and great
		<A href="https://www.reactmiami.com/speakers/cepulis">talks</A>
	</P>
	<P>
		Fun fact about me, I actually <i>like</i> writing CSS. Weird, huh?
	</P>
{/snippet}
{#snippet long()}
	<P>
		I went to school for Computer Engineering, thinking I'd end up writing assembly or something for
		some low-level hardware. After that scared the bejeebies out of me, I ran away as fast as I
		could, as far as I could, to the web, where I found a home.
	</P>
	<P>
		When my dad asked me about why I ended up in web development, I told him that it's a lot like
		the deck that he built in his back yard. It's building a space that serves a practical use. But
		it's also more than that. It's also thinking about how the user will move through that space,
		from beginning to destination. Also how that space will fulfill its purpose without getting in
		the way. How the user will enjoy that space. The details that will delight them. How that space
		will work for all the different kinds of people who will interact with it.
	</P>
	<P>
		Lately, I've been realizing that the skills I learned in web development work in developer
		experience and community engineering, too. Designing a user journey through
		<A href="https://docs.mux.com/">docs</A> or a
		<A href="https://www.reactmiami.com/speakers/cepulis">talk</A> or a
		<A href="https://www.mux.com/team/darius-cepulis">blog post</A>? It's a lot like designing a
		user journey through a
		<A href="https://www.mux.com/">website</A>. I'm proudly building these all of these at Mux as a
		Senior Community Engineer.
	</P>
{/snippet}

<Section id="about">
	<H1 as="h2">About me</H1>
	<div class="flex flex-col items-start gap-4 md:flex-row">
		{@html `<!-- Thank you, Cassie Evans, for this great idea! https://www.cassie.codes/ -->`}
		<Headshot />
		<div class="w-full">
			{@html `<!-- Thank you, Chris Coyier, for this great idea! https://web.archive.org/web/20220102202624/https://chriscoyier.net/ -->`}
			<Tabs
				initialIndex={1}
				tabs={[
					{ id: 'short', label: 'Short', panel: short },
					{ id: 'medium', label: 'Medium', panel: medium },
					{ id: 'long', label: 'Long', panel: long }
				]}
			/>
		</div>
	</div>
</Section>
