<script lang="ts">
	import MarkdocRenderer from '$lib/markdoc/MarkdocRenderer.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { frontmatter, content } = $derived(data);
</script>

<h1>{frontmatter.title}</h1>
<MarkdocRenderer node={content} />
