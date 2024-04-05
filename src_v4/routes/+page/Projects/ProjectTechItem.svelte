<script lang="ts">
	import Popover from '$lib/components/Popover.svelte';

	export let name: string;
	export let details: string | undefined;
</script>

<li>
	{#if typeof details !== 'undefined'}
		<Popover>
			{name}
			<svelte:fragment slot="content">
				{details}
			</svelte:fragment>
		</Popover>
	{:else}
		{name}
	{/if}
</li>

<style>
	li {
		display: inline;
		font-style: italic;
	}
	li:not(:last-of-type):after {
		content: ', ';
	}
</style>
