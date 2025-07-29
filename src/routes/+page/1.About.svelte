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
		I make sure devs have a great experience with <A href="https://www.mux.com/">Mux</A>. I think
		the web is pretty neat!
	</P>
{/snippet}
{#snippet medium()}
	<P>
		I'm a Senior Developer Experience Engineer at <A href="https://www.mux.com">Mux</A>, doing
		anything I can do to design and develop a better experience for devs. A
		<A href="https://www.mux.com">delightful marketing site</A>, a better
		<A href="https://dashboard.mux.com">dashboard</A>, useful
		<A href="https://docs.mux.com">docs</A>, handy
		<A href="https://www.mux.com/blog/mux-player-iframe">components</A>, and
		<A href="https://www.youtube.com/@MuxHQ">some</A>
		<A href="https://www.mux.com/team/darius-cepulis">content</A> on the side.
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
		Lately, I've been realizing that the design skills I learned making static web pages work across
		all of developer experience. From a
		<A href="https://www.mux.com">marketing site</A>, to a
		<A href="https://dashboard.mux.com">dashboard</A>, to
		<A href="https://docs.mux.com">docs</A>, to
		<A href="https://www.mux.com/blog/mux-player-iframe">components</A>, to
		<A href="https://www.youtube.com/@MuxHQ">some</A>
		<A href="https://www.mux.com/team/darius-cepulis">content</A>&hellip; It's all just ways to
		lower the bar for users trying to get stuff done. That's the kind of stuff I get to design and
		develop as a Senior Developer Experience Engineer at Mux.
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
