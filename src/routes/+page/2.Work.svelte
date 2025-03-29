<script lang="ts">
	import H1 from '$lib/components/typography/H1.svelte';
	import Section from '$lib/components/typography/Section.svelte';
	import type { Frontmatter } from '$lib/markdoc/types';

	type Post = {
		frontmatter: Pick<
			Frontmatter,
			'type' | 'title' | 'directUrl' | 'todo' | 'slug' | 'priority' | 'previewTitle' | 'previewText'
		>;
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
		class="grid grid-flow-dense grid-cols-(--grid-cols) sm:grid-cols-(--sm-grid-cols)"
		style:--grid-cols="repeat(auto-fill, minmax(170px, 1fr))"
		style:--sm-grid-cols="repeat(auto-fill, minmax(288px, 1fr))"
	>
		{#each postsReversed as post}
			{@const {
				frontmatter: { type, title, directUrl, todo, slug, priority, previewTitle, previewText }
			} = post}
			<li
				class="border-silver dark:border-darkgray -m-[0.5px] border"
				class:col-span-2={priority && priority >= 2}
				class:row-span-2={priority && priority >= 3}
				style:view-transition-name="container-{slug}"
			>
				<a
					href={directUrl ?? `/posts/${slug}`}
					class="hocus:bg-(--bg-hocus) dark:hocus:text-black flex h-full flex-col gap-4 p-6 md:gap-6"
					style:--bg-hocus={type === 'build'
						? 'var(--color-yellow)'
						: type === 'post'
							? 'var(--color-aqua)'
							: type === 'video'
								? 'var(--color-fuchsia)'
								: type === 'talk'
									? 'var(--color-lime)'
									: 'var(--color-silver)'}
				>
					<h3
						class="max-w-96 text-balance text-lg font-bold leading-snug"
						style:view-transition-name="title-{slug}"
					>
						{previewTitle ?? title}
					</h3>
					{#if previewText}
						<p class="max-w-96 text-pretty text-sm" style:view-transition-name="content-{slug}">
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
						{#if todo}
							🚧
						{/if}
						{#if directUrl}
							🔗
						{/if}
					</div>
				</a>
			</li>
		{/each}
		<li
			class="hocus-within:border-silver dark:hocus-within:border-darkgray -m-[0.5px] grid border border-transparent"
		>
			<a
				href="https://github.com/decepulis"
				class="hocus:bg-silver dark:hocus:bg-darkgray dark:hocus:text-black flex h-full flex-col gap-4 p-4 p-6 md:gap-6"
			>
				<h3 class="max-w-96 text-balance text-lg font-bold leading-snug">More&hellip;</h3>
				<p class="max-w-96 text-pretty text-sm">
					See more, including my graveyard of half-finished projects, on GitHub.
				</p>
				<div class="mt-auto">🔗</div>
			</a>
		</li>
	</ul>
</Section>
