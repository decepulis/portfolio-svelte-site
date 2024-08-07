<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import type { Metadata } from '$lib/types/metadata';
	import baseUrl from '$lib/stores/baseUrl';
	import type { WithContext, BlogPosting, ProfilePage, Person } from 'schema-dts';

	type Props = {
		children?: Snippet;
	};
	const { children }: Props = $props();
	const { metadata } = $derived($page.data) as { metadata: Metadata };

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
	<meta property="twitter:site" content="@darius_cepulis" />
	{#if metadata}
		{@const { pathname, fullTitle, title, description, image, article, profile } = metadata}
		{#if pathname}
			<link rel="canonical" href={`${baseUrl}${metadata.pathname}`} />
			<meta property="og:url" content={`${baseUrl}${metadata.pathname}`} />
			<meta property="twitter:url" content={`${baseUrl}${metadata.pathname}`} />
		{/if}
		{#if title}
			<title>{title} | Darius Cepulis</title>
			<meta property="og:title" content="{title} | Darius Cepulis" />
			<meta property="twitter:title" content="{title} | Darius Cepulis" />
		{/if}
		{#if description}
			<meta property="description" content={description} />
			<meta property="og:description" content={description} />
			<meta property="twitter:description" content={description} />
		{/if}
		{#if image}
			{@const { url, width, height, alt } = image}
			<meta property="og:image" content={url} />
			<meta property="og:image:width" content={width.toString()} />
			<meta property="og:image:height" content={height.toString()} />
			<meta property="og:image:alt" content={alt} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta property="twitter:image" content={url} />
			<meta property="twitter:image:width" content={width.toString()} />
			<meta property="twitter:image:height" content={height.toString()} />
			<meta property="twitter:image:alt" content={alt} />
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
			{#if tags}{#each tags as tag}<meta property="article:tag" content={tag} />{/each}{/if}
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
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
{/if}
