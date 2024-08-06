<!-- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ -->
<script lang="ts">
	import ui from '$lib/stores/ui.svelte';
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

	// == transition management ==
	let isTransitioning = $state(false);
	let tabPanelContainer: HTMLDivElement;

	const onTransitionStart = () => {
		if (ui.shouldReduceMotion) return;
		isTransitioning = true;
		// get some measurements
		const currentTabPanelOffsetHeight = tabPanelContainer.offsetHeight;
		const currentTabPanelClientHeight = tabPanelContainer.clientHeight;
		const paddingAndBorderHeight = currentTabPanelOffsetHeight - currentTabPanelClientHeight;
		const nextTabPanelHeight = document.getElementById(activeId)?.offsetHeight;
		// immediately set the height from auto to the height outgoing element
		// (if the height is currently auto, of course)
		if (isNaN(parseInt(tabPanelContainer.style.height))) {
			tabPanelContainer.style.height = `${currentTabPanelOffsetHeight}px`;
			tabPanelContainer.offsetHeight; // flush to render
		}
		// and then set it to the height of the incoming element for a transition
		tabPanelContainer.style.height = nextTabPanelHeight
			? `${nextTabPanelHeight + paddingAndBorderHeight}px`
			: 'auto';
	};
	const onTransitionEnd = (e: TransitionEvent) => {
		if (e.target !== tabPanelContainer) return; // if the event target is not the tabPanelContainer, ignore it
		isTransitioning = false;
		tabPanelContainer.style.height = 'auto'; // when the transition is done, set it to auto to handle window resizing and stuff
	};

	// == tab management ==
	let activeIndex = $state(initialIndex);
	const activeId = $derived(tabs[activeIndex]?.id);

	const setIndex = (index: number) => {
		activeIndex = index;
		const tab = document.getElementById(`${tabs[index].id}-tab`);
		if (tab) tab.focus();
		onTransitionStart();
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

<div role="tablist" aria-orientation="horizontal" class="relative z-10 inline-flex gap-2">
	{#each tabs as { id, label }, idx}
		{@const isActive = activeId === id}
		<button
			id={`${id}-tab`}
			type="button"
			role="tab"
			aria-selected={isActive}
			aria-controls={id}
			tabindex={isActive ? undefined : -1}
			onclick={() => setIndex(idx)}
			onkeydown={onTabKeydown}
			class="cursor-pointer border py-2 px-4 font-sans text-sm -outline-offset-4 hover:bg-white focus:outline-2"
			class:border-[silver_silver_white_silver]={isActive}
			class:border-silver={!isActive}
			class:bg-gainsboro={!isActive}
		>
			{label}
		</button>
	{/each}
</div>
<div
	class="border-silver relative -mt-[1px] w-full max-w-prose overflow-hidden border transition-[height] duration-300 motion-reduce:duration-0"
	ontransitionend={onTransitionEnd}
	bind:this={tabPanelContainer}
>
	{#each tabs as { id, panel }, idx}
		{@const isActive = activeId === id}
		{@const isNext = idx > activeIndex}
		<div
			{id}
			role="tabpanel"
			tabindex="0"
			inert={!isActive}
			aria-labelledby={`${id}-tab`}
			class="top-0 transform-gpu py-6 px-4 -outline-offset-4 transition duration-300 focus:outline-2 motion-reduce:duration-0"
			style:position={isActive && !isTransitioning ? 'relative' : 'absolute'}
			style:pointer-events={isActive ? 'auto' : 'none'}
			style:opacity={isActive ? 1 : 0}
			style:transform={isActive ? 'translateX(0)' : isNext ? 'translateX(25%)' : 'translateX(-25%)'}
		>
			{@render panel()}
		</div>
	{/each}
</div>
