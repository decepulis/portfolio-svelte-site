<script lang="ts">
	// https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

	import H2 from '$lib/components/H2.svelte';
	import P from '$lib/components/P.svelte';
	import A from '$lib/components/A.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Section from '$lib/components/Section.svelte';
	import Headshot from '$lib/components/Headshot.svelte';
</script>

{#snippet short()}
	<P>
		I try and get devs excited about <A href="https://www.mux.com/">Mux</A>. I think the web is
		pretty neat!
	</P>
{/snippet}
{#snippet medium()}
	<P>
		I'm a Community Engineer at <A href="https://www.mux.com">Mux</A>, which means work on making
		the developer experience great, with
		<A href="https://www.mux.com">great code</A>, <A href="https://docs.mux.com">great docs</A>,
		great
		<A href="https://tmi.mux.com">microsites</A>, great <A
			href="https://www.mux.com/team/darius-cepulis">blog posts</A
		>, and great <A href="https://www.reactmiami.com/speakers/cepulis">conference talks</A>
	</P>
	<P>
		Fun fact about me, I actually <i>like</i> writing CSS. Weird, huh?
	</P>
{/snippet}
{#snippet long()}
	<P>Long bio</P>
{/snippet}

<Section id="about">
	<H2>About Me</H2>
	<div class="grid grid-cols-4 gap-4">
		<Headshot />
		<div class="col-span-3">
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
