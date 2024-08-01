<script lang="ts">
	import H2 from '$lib/components/H2.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { frontmatter, Frontmatter } from '$lib/markdoc/types';

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
	<H2>What I&apos;m up to</H2>
	<ul
		class="grid grid-flow-dense grid-cols-[--grid-cols] gap-0.5 text-base sm:grid-cols-[--sm-grid-cols]"
		style:--grid-cols="repeat(auto-fill, minmax(170px, 1fr))"
		style:--sm-grid-cols="repeat(auto-fill, minmax(288px, 1fr))"
	>
		{#each postsReversed as post}
			{@const {
				frontmatter: { type, title, url, slug, priority, previewText }
			} = post}
			<li
				class="grid border p-4 hover:border-dashed"
				class:col-span-2={priority && priority >= 2}
				class:row-span-2={priority && priority >= 3}
				style:view-transition-name="body-{slug}"
				style:border-color={type === 'build'
					? 'green'
					: type === 'post'
						? 'blue'
						: type === 'video'
							? 'purple'
							: type === 'talk'
								? 'red'
								: 'silver'}
			>
				<a href={url ?? `/posts/${slug}`} class="flex flex-col gap-2">
					<h3 class="font-bold" style:view-transition-name="title-{slug}">{title}</h3>
					{#if previewText}
						<p class="text-sm">{previewText}</p>
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
						{#if url}
							🔗
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ul>
</Section>
