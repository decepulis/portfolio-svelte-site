<script lang="ts">
	import type { RenderableTreeNode } from '@markdoc/markdoc';
	import type { Picture } from 'vite-imagetools';

	import A from '$lib/components/typography/A.svelte';
	import H2 from '$lib/components/typography/H2.svelte';
	import H3 from '$lib/components/typography/H3.svelte';
	import H4 from '$lib/components/typography/H4.svelte';
	import H5 from '$lib/components/typography/H5.svelte';
	import H6 from '$lib/components/typography/H6.svelte';
	import OL from '$lib/components/typography/OL.svelte';
	import P from '$lib/components/typography/P.svelte';
	import UL from '$lib/components/typography/UL.svelte';

	import MarkdocRenderer from './MarkdocRenderer.svelte';
	import Color from './components/Color.svelte';
	import Fence from './components/Fence.svelte';
	import Footnote from './components/Footnote.svelte';
	import Grid from './components/Grid.svelte';
	import Image from './components/Image.svelte';
	import Video from './components/Video.svelte';
	import { isTag } from './types';

	type Props = {
		node: RenderableTreeNode | RenderableTreeNode[];
		enhancedImages?: Record<string, string | Picture>;
	};
	let { node, enhancedImages }: Props = $props();

	const components = {
		p: P,
		a: A,
		h2: H2,
		h3: H3,
		h4: H4,
		h5: H5,
		h6: H6,
		ul: UL,
		ol: OL,
		img: Image,
		Grid,
		Video,
		Footnote,
		Color,
		Fence
	};
</script>

{#if Array.isArray(node)}
	{#each node as child, idx (idx)}
		<MarkdocRenderer node={child} {enhancedImages} />
	{/each}
{:else if node === null || typeof node !== 'object' || !isTag(node)}
	{node}
{:else if node.name === 'article'}
	<!-- special case: we ignore the <article> tag wrapping this whole affair -->
	<MarkdocRenderer node={node.children} {enhancedImages} />
{:else if node.name === 'img'}
	<!-- special case: images! -->
	<Image attributes={node.attributes} {enhancedImages} />
{:else if node.name in components}
	<!-- known component -->
	{@const Component = components[node.name as keyof typeof components]}
	<Component {...node.attributes as any}>
		<MarkdocRenderer node={node.children} {enhancedImages} />
	</Component>
{:else}
	<!-- element not defined in components -->
	<svelte:element this={node.name} {...node.attributes}>
		<MarkdocRenderer node={node.children} {enhancedImages} />
	</svelte:element>
{/if}
