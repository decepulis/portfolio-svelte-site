<script lang="ts">
	import H1 from '$lib/components/typography/H1.svelte';
	import Section from '$lib/components/typography/Section.svelte';
	import type { Frontmatter } from '$lib/markdoc/types';

	type Post = {
		frontmatter: Frontmatter;
	};
	type Props = {
		posts: Post[];
	};
	const { posts }: Props = $props();

	const postsReversed = $derived(posts.slice().reverse());
</script>

<Section id="work">
	<H1 as="h2">Some things I&apos;ve been up to</H1>
	<ul
		role="list"
		class="grid grid-flow-dense grid-cols-[--grid-cols] sm:grid-cols-[--sm-grid-cols]"
		style:--grid-cols="repeat(auto-fill, minmax(170px, 1fr))"
		style:--sm-grid-cols="repeat(auto-fill, minmax(288px, 1fr))"
	>
		{#each postsReversed as post}
			{@const {
				frontmatter: { type, title, directUrl, slug, priority, previewTitle, previewText }
			} = post}
			<li
				class="border-silver -m-[0.5px] border"
				class:col-span-2={priority && priority >= 2}
				class:row-span-2={priority && priority >= 3}
				style:view-transition-name="container-{slug}"
			>
				<a
					href={directUrl ?? `/posts/${slug}`}
					class="flex h-full flex-col gap-4 p-4 hover:bg-[--bg-hover] focus:bg-[--bg-hover]"
					style:--bg-hover={type === 'build'
						? 'var(--color-yellow)'
						: type === 'post'
							? 'var(--color-aqua)'
							: type === 'video'
								? 'var(--color-fuchsia)'
								: type === 'talk'
									? 'var(--color-lime)'
									: 'var(--color-silver)'}
				>
					<h3 class="text-balance" style:view-transition-name="title-{slug}">
						{previewTitle ?? title}
					</h3>
					{#if previewText}
						<p class="text-pretty text-sm" style:view-transition-name="content-{slug}">
							{previewText}
						</p>
					{/if}
					<div class="mt-auto">
						{#if type === 'build'}
							🔨
						{:else if type === 'post'}
							📝
						{:else if type === 'video'}
							🎥
						{:else if type === 'talk'}
							🗣️
						{/if}
						{#if directUrl}
							🔗
						{/if}
					</div>
				</a>
			</li>
		{/each}
		<li class="hover:border-silver -m-[0.5px] grid border border-transparent">
			<a
				href="https://github.com/decepulis"
				class="hover:bg-silver focus:bg-silver flex h-full flex-col gap-4 p-4"
			>
				<h3 class="text-balance">More&hellip;</h3>
				<p class="text-pretty text-sm">
					See more, including my graveyard of half-finished projects, on GitHub.
				</p>
				<div class="mt-auto">🔗</div>
			</a>
		</li>
	</ul>
</Section>
