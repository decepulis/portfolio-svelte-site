<script lang="ts">
	import Headshot from '$lib/components/Headshot/index.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import A from '$lib/components/typography/A.svelte';
	import H1 from '$lib/components/typography/H1.svelte';
	import P from '$lib/components/typography/P.svelte';
	import Section from '$lib/components/typography/Section.svelte';

	import { resolve } from '$app/paths';

	const talk = resolve('/posts/[slug]', { slug: '2026-06-01-choosing-the-wrong-abstraction' });
</script>

{#snippet short()}
	<P>
		I help make sure devs have a great experience with <A href="https://www.mux.com/">Mux</A>.
	</P>
{/snippet}
{#snippet medium()}
	<P>
		I'm an Engineering Manager at <A href="https://www.mux.com">Mux</A>, working with the Developer
		Experience and Native teams.
	</P>
	<P>
		In my time at Mux, I've been helping design and develop a better experience for devs. From
		<A href="https://www.mux.com/team/darius-cepulis">blog posts</A> and
		<A href={talk}>talks</A>, to the
		<A href="https://www.mux.com">marketing site</A> and <A href="https://www.mux.com/docs">docs</A
		>, through to the
		<A href="https://dashboard.mux.com">dashboard</A>, down to OSS SDKs like
		<A href="https://videojs.org">Video.js v10</A>.
	</P>
{/snippet}
{#snippet long()}
	<P>
		I went to school for Computer Engineering, thinking I'd end up writing assembly or something for
		some low-level hardware. After that scared the bejeebies out of me, I ran away as fast as I
		could, as far as I could, to the web, where I found a home.
	</P>
	<P>
		What I loved about working in web development wasn't JavaScript, I'll tell you that. It's that
		there were so many ways to guide a user's journey. To help people get stuff done. From
		<A href="https://www.mux.com/team/darius-cepulis">blog posts</A> and
		<A href={talk}>talks</A> for other devs, to delightful and helpful
		<A href="https://www.mux.com">marketing</A> and <A href="https://www.mux.com/docs">docs</A> sites,
		through the
		<A href="https://dashboard.mux.com">dashboard</A>, down to OSS SDKs like
		<A href="https://videojs.org">Video.js v10</A>.
	</P>
	<P>
		It's all just ways to lower the bar for users trying to get stuff done. And now, as an
		Engineering Manager for the Developer Experience and Native teams, I get to help a whole crew
		build it.
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
