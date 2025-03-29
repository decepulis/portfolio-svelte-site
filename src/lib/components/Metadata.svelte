<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import type { Metadata } from '$lib/types/metadata';
	import baseUrl from '$lib/stores/baseUrl';
	import type { WithContext, BlogPosting, ProfilePage, Person } from 'schema-dts';

	type Props = {
		children?: Snippet;
	};
	const { children }: Props = $props();
	const { metadata } = $derived(page.data) as { metadata: Metadata };

	const darius: Person = {
		'@type': 'Person',
		name: 'Darius Cepulis',
		description: 'Thinks the web is pretty neat',
		url: baseUrl,
		image: `${baseUrl}/darius.jpg`,
		email: 'darius@cepulis.net',
		knowsLanguage: ['en-US', 'lt', 'de'],
		callSign: 'K6ATX',
		height: '6ft'
		// todo: role and job history
	};
	const jsonLd: WithContext<BlogPosting> | WithContext<ProfilePage> | null = $derived.by(() => {
		if (metadata?.article) {
			return {
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				headline: metadata.fullTitle || metadata.title,
				datePublished: metadata.article.publishedTime?.toISOString(),
				dateModified: metadata.article.modifiedTime?.toISOString(),
				image: metadata.image?.url,
				articleSection: metadata.article.section,
				author: darius
			} satisfies WithContext<BlogPosting>;
		}
		if (metadata?.profile) {
			return {
				'@context': 'https://schema.org',
				'@type': 'ProfilePage',
				mainEntity: darius
			} satisfies WithContext<ProfilePage>;
		}
		return null;
	});
</script>

<svelte:head>
	<meta property="og:site_name" content="Darius Cepulis" />
	<meta name="twitter:site" content="@darius_cepulis" />
	{#if metadata}
		{@const { pathname, fullTitle, title, description, image, article, profile } = metadata}
		{#if pathname}
			<link rel="canonical" href={`${baseUrl}${metadata.pathname}`} />
			<meta property="og:url" content={`${baseUrl}${metadata.pathname}`} />
			<meta name="twitter:url" content={`${baseUrl}${metadata.pathname}`} />
		{/if}
		{#if fullTitle || title}
			{@const displayTitle = metadata.fullTitle || `${metadata.title} | Darius Cepulis`}
			<title>{displayTitle}</title>
			<meta property="og:title" content={displayTitle} />
			<meta name="twitter:title" content={displayTitle} />
		{/if}
		{#if description}
			<meta name="description" content={description} />
			<meta property="og:description" content={description} />
			<meta name="twitter:description" content={description} />
		{/if}
		{#if image}
			{@const { url, width, height, alt } = image}
			<meta property="og:image" content={url} />
			{#if width}<meta property="og:image:width" content={width.toString()} />{/if}
			{#if height}<meta property="og:image:height" content={height.toString()} />{/if}
			{#if alt}<meta property="og:image:alt" content={alt} />{/if}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:image" content={url} />
			{#if width}<meta name="twitter:image:width" content={width.toString()} />{/if}
			{#if height}<meta name="twitter:image:height" content={height.toString()} />{/if}
			{#if alt}<meta name="twitter:image:alt" content={alt} />{/if}
		{/if}
		{#if article}
			{@const { publishedTime, modifiedTime, section, tags } = article}
			<meta property="article:author" content={baseUrl} />
			<meta property="og:type" content="article" />
			{#if publishedTime}
				<meta property="article:published_time" content={publishedTime.toISOString()} />
			{/if}
			{#if modifiedTime}
				<meta property="article:modified_time" content={modifiedTime.toISOString()} />
			{/if}
			{#if section}<meta property="article:section" content={section} />{/if}
			{#if tags}{#each tags as tag (tag)}<meta property="article:tag" content={tag} />{/each}{/if}
		{/if}
		{#if profile}
			<meta property="og:type" content="profile" />
			<meta property="profile:first_name" content="Darius" />
			<meta property="profile:last_name" content="Cepulis" />
		{/if}
	{/if}
</svelte:head>

{@render children?.()}

{#if jsonLd}
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-expressions -->
	{@html '<script type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>'}
{/if}
