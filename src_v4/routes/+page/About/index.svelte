<script lang="ts">
	import Headshot from './Headshot.svelte';
	import ShortMediumLong from '$lib/components/ShortMediumLong.svelte';
	import { Maximize2Icon } from 'svelte-feather-icons';
</script>

<section id="about" class="container">
	<h2>About Me</h2>
	<div class="about-layout">
		<div class="headshot">
			<Headshot />
		</div>
		<div class="content">
			<ShortMediumLong>
				<svelte:fragment slot="short">
					<p>
						I make pretty websites 'n stuff for <a href="https://www.mux.com">Mux</a>. I think the
						web is pretty neat!
					</p>
				</svelte:fragment>
				<svelte:fragment slot="medium">
					<p>
						I'm an Experience Engineer at <a href="https://www.mux.com">Mux</a>, which means I get
						to use the web and good design to make the developer experience great, from the
						<a href="https://www.mux.com">top of the marketing funnel</a>
						to the <a href="https://docs.mux.com">last page of our docs</a> and
						<a href="https://tmi.mux.com">everywhere</a>
						<a href="https://github.com/muxinc/blurhash">in between</a>.
					</p>
					<p>
						Fun fact about me, I actually <i>like</i> writing CSS. Weird, huh?
					</p>
				</svelte:fragment>
				<svelte:fragment slot="long">
					<p>
						I went to school for Computer Engineering, thinking I'd end up writing assembly or
						something for some low-level hardware. After that scared the bejeebies out of me, I ran
						away as fast as I could, as far as I could, to the web, where I found a home.
					</p>
					<p>
						When my dad asked me about why I ended up in web development, I told him that it's a lot
						like the deck that he built in his back yard. It's building
						a space that serves a practical use. But it's more than that. It's thinking about how
						the user will move through that space. How that space will fulfill its purpose without
						getting in the way. How the user will enjoy that space. The details that will delight
						them. How that space will work for all the different kinds of people who will interact
						with it.
					</p>
					<p>
						As an Experience Engineer at Mux, I'm so lucky to get to do that every day. For
						<a href="https://www.mux.com/">marketing</a>, for
						<a href="https://docs.mux.com/">documentation</a>, for
						<a href="https://lu.ma/rsc-workshop-reactathon-2023">workshops</a>, for
						<a href="https://tmi.mux.com/">a conference site</a>, for
						<a href="https://github.com/muxinc/blurhash">little utilities</a>, and so much more.
					</p>
				</svelte:fragment>
			</ShortMediumLong>
		</div>
	</div>
</section>

<style>
	.about-layout {
		display: grid;
		gap: 0 var(--main-padding);
		align-content: center;
		justify-content: start;
	}
	@media (min-width: 42rem) {
		.about-layout {
			grid-template-columns: auto 1fr;
		}
	}
	.headshot {
		max-width: calc(var(--container-width) - var(--content-width));
		margin: 0 auto 1rem;
		border-radius: 1rem;
		align-self: flex-start;
		background-color: rgba(var(--c1), var(--intensity-c));
	}
	.headshot,
	.headshot :global(*) {
		transition: background-color var(--transition-speed-medium), fill var(--transition-speed-medium),
			stroke var(--transition-speed-medium);
	}
	.content {
		max-width: var(--content-width);
	}
	.content p:first-child {
		margin-top: 0;
	}
	.content p:last-child {
		margin-bottom: 0;
	}
</style>
