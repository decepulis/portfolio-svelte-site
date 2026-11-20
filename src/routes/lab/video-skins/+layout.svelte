<script lang="ts">
	import type { Snippet } from 'svelte';

	import { resolve } from '$app/paths';

	const { children }: { children?: Snippet } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 font-serif">
	<a href={resolve('/lab/video-skins', {})} class="text-link visited:text-visited underline"
		>&larr; Video skin lab</a
	>
	{@render children?.()}
</main>
