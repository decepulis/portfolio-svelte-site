<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import MarkdocRenderer from '$lib/markdoc/MarkdocRenderer.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const {
		frontmatter: { slug, title },
		content
	} = $derived(data);
</script>

<article class="mx-4 py-8" style:view-transition-name="body-{slug}">
	<h1 class="mb-16 inline-block text-4xl font-bold" style:view-transition-name="title-{slug}">
		{title}
	</h1>
	<MarkdocRenderer node={content} />
</article>
