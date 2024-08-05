<script lang="ts">
	import type { RenderableTreeNode } from '@markdoc/markdoc';
	import { isTag } from './types';
	import type { Picture } from 'vite-imagetools';
	import P from '$lib/components/typography/P.svelte';
	import A from '$lib/components/typography/A.svelte';
	import H2 from '$lib/components/typography/H2.svelte';
	import Grid from '$lib/components/typography/Grid.svelte';
	import MarkdocImage from './MarkdocImage.svelte';

	type Props = {
		node: RenderableTreeNode;
		enhancedImages?: Record<string, string | Picture>;
	};
	let { node, enhancedImages }: Props = $props();

	const components = {
		p: P,
		a: A,
		h2: H2,
		img: MarkdocImage,
		Grid
	};
</script>

{#if Array.isArray(node)}
	{#each node as child}
		<svelte:self node={child} {enhancedImages} />
	{/each}
{:else if node === null || typeof node !== 'object' || !isTag(node)}
	{node}
{:else if node.name === 'article'}
	<!-- special case: we ignore the <article> tag wrapping this whole affair -->
	<svelte:self node={node.children} {enhancedImages} />
{:else if node.name === 'img'}
	<!-- special case: images! -->
	<MarkdocImage attributes={node.attributes} {enhancedImages} />
{:else if node.name in components}
	<!-- known component -->
	<svelte:component this={components[node.name as keyof typeof components]} {...node.attributes}>
		<svelte:self node={node.children} {enhancedImages} />
	</svelte:component>
{:else}
	<!-- element not defined in components -->
	<svelte:element this={node.name} {...node.attributes}>
		<svelte:self node={node.children} {enhancedImages} />
	</svelte:element>
{/if}
