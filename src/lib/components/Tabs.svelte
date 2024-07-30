<!-- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tab = {
		id: string;
		label: string;
		panel: Snippet;
	};
	type Props = {
		tabs: Tab[];
		initialIndex?: number;
	};
	const { tabs, initialIndex = 0 }: Props = $props();

	let activeIndex = $state(initialIndex);
	const activeId = $derived(tabs[activeIndex]?.id);

	const setIndex = (index: number) => {
		activeIndex = index;
		const tab = document.getElementById(`${tabs[index].id}-tab`);
		if (tab) tab.focus();
	};
	const setNextActiveIndex = () => {
		setIndex((activeIndex + 1) % tabs.length);
	};
	const setPreviousActiveIndex = () => {
		setIndex((activeIndex - 1 + tabs.length) % tabs.length);
	};
	const setFirstIndex = () => {
		setIndex(0);
	};
	const setLastIndex = () => {
		setIndex(tabs.length - 1);
	};

	const onTabKeydown = (event: KeyboardEvent) => {
		let shouldStopEvent = false;

		if (event.key === 'ArrowRight') {
			setNextActiveIndex();
			shouldStopEvent = true;
		} else if (event.key === 'ArrowLeft') {
			setPreviousActiveIndex();
			shouldStopEvent = true;
		} else if (event.key === 'Home') {
			setFirstIndex();
			shouldStopEvent = true;
		} else if (event.key === 'End') {
			setLastIndex();
			shouldStopEvent = true;
		}

		if (shouldStopEvent) {
			event.stopPropagation();
			event.preventDefault();
		}
	};
</script>

<div role="tablist" aria-orientation="horizontal" class="inline-flex gap-2">
	{#each tabs as { id, label }, idx}
		{@const isActive = activeId === id}
		<button
			id={`${id}-tab`}
			type="button"
			role="tab"
			aria-selected={isActive}
			aria-controls={id}
			tabindex={isActive ? undefined : -1}
			onclick={() => (activeIndex = idx)}
			onkeydown={onTabKeydown}
			class="outline-blue cursor-pointer border border-b py-2 px-4 -outline-offset-4 focus:outline"
			class:bg-silver={!isActive}
			style:border-color={isActive ? 'silver silver white silver' : 'silver'}
		>
			{label}
		</button>
	{/each}
</div>
{#each tabs as { id, panel }}
	<div
		{id}
		role="tabpanel"
		tabindex="0"
		aria-labelledby={`${id}-tab`}
		hidden={activeId !== id}
		class="outline-blue border-silver -mt-[1px] border py-2 px-4 -outline-offset-4 focus:outline"
	>
		{@render panel()}
	</div>
{/each}
