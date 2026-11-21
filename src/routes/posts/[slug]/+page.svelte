<script lang="ts">
	import A from '$lib/components/typography/A.svelte';
	import P from '$lib/components/typography/P.svelte';
	import MarkdocRenderer from '$lib/markdoc/MarkdocRenderer.svelte';

	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const {
		frontmatter: {
			slug,
			title,
			date,
			hasMonth,
			hasDay,
			pageUrl,
			githubUrl,
			documentUrl,
			todo,
			previewText
		},
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

	// the homepage, scrolled to the list of work
	const workHref = `${resolve('/')}#work`;
</script>

<article class="mx-4 py-8" style:view-transition-name="container-{slug}">
	<header class="mb-8">
		<h1
			class="mb-4 inline-block max-w-prose text-4xl font-bold text-balance"
			style:view-transition-name="title-{slug}"
		>
			{title}
		</h1>
		<p>🗓️ {formatter.format(date)}</p>
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
			{#if previewText}
				<P>{previewText}</P>
			{/if}
			<P><i>This post, like most posts on this site, is under construction</i></P>
			<img src="/under-construction.gif" alt="Under construction" class="my-4" loading="lazy" />
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
			<!-- resolve() can't take a #hash, so it's added after (see workHref) -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="text-link dark:text-link-dark group" href={workHref}>
				← <span class="group-hocus:decoration-wavy underline">back</span>
			</a>
		{/if}
	</p>
</article>
