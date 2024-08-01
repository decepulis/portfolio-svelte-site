<script lang="ts">
	import { type RenderableTreeNode } from '@markdoc/markdoc';
	import { isTag } from './types';

	type Props = {
		node: RenderableTreeNode;
	};
	let { node }: Props = $props();

	// const components = { Callout };
</script>

{#if Array.isArray(node)}
	{#each node as child}
		<svelte:self node={child} />
	{/each}
{:else if node === null || typeof node !== 'object' || !isTag(node)}
	{node}
	<!-- {:else if node.name in components}
	<svelte:component this={components[node.name as keyof typeof components]} {...node.attributes}>
		<svelte:self node={node.children} />
	</svelte:component> -->
{:else}
	<svelte:element this={node.name} {...node.attributes}>
		<svelte:self node={node.children} />
	</svelte:element>
{/if}
