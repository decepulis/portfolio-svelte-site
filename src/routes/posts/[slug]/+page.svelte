<script lang="ts">
	import A from '$lib/components/typography/A.svelte';
	import P from '$lib/components/typography/P.svelte';
	import MarkdocRenderer from '$lib/markdoc/MarkdocRenderer.svelte';
	import type { PageData } from './$types';
	import { afterNavigate } from '$app/navigation';

	const { data }: { data: PageData } = $props();
	const {
		frontmatter: { slug, title, date, hasMonth, hasDay, pageUrl, githubUrl, documentUrl, todo },
		enhancedImages,
		content
	} = $derived(data);

	const formatter = $derived(
		new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: hasMonth ? 'long' : undefined,
			day: hasDay ? 'numeric' : undefined,
			timeZone: 'UTC'
		})
	);

	let isInternalNavigation = $state(false);
	afterNavigate((navigation) => {
		isInternalNavigation = navigation.type !== 'enter';
	});
</script>

<article class="mx-4 py-8" style:view-transition-name="container-{slug}">
	<header class="mb-8">
		<h1
			class="mb-4 inline-block max-w-prose text-balance text-4xl font-bold"
			style:view-transition-name="title-{slug}"
		>
			{title}
		</h1>
		<p class="italic">{formatter.format(date)}</p>
		{#if pageUrl}
			<p>
				<A decoration="🔗" href={pageUrl}>View page</A>
			</p>
		{/if}
		{#if githubUrl}
			<p>
				<A decoration="🐙" href={githubUrl}>View on GitHub</A>
			</p>
		{/if}
		{#if documentUrl}
			<p>
				<A decoration="📄" href={documentUrl}>View document</A>
			</p>
		{/if}
	</header>
	<div style:view-transition-name="content-{slug}" class="max-w-prose">
		{#if todo}
			<P><i>This post is under construction</i></P>
			<img src="/under-construction.gif" alt="Under construction" class="my-4" />
		{/if}
		<MarkdocRenderer node={content} {enhancedImages} />
	</div>
	<p class="mt-8">
		{#if isInternalNavigation}
			<button
				class="text-link dark:text-link-dark group cursor-pointer"
				onclick={() => history.back()}
			>
				← <span class="group-hocus:decoration-wavy underline">back</span>
			</button>
		{:else}
			<a class="text-link dark:text-link-dark group" href="/#work">
				← <span class="group-hocus:decoration-wavy underline">back</span>
			</a>
		{/if}
	</p>
</article>
