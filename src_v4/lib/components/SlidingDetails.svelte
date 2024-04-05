<script lang="ts">
	import { onMount } from 'svelte';
	import Boopable from './Boopable.svelte';

	// Adapted from
	// https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
	type State = 'expanding' | 'open' | 'shrinking' | 'closed';
	export let initial: State = 'closed';
	let state: State = initial;

	let animation: Animation | null = null;

	const duration = 200;
	const easing = 'ease-out';

	let detailsElement: HTMLDetailsElement;
	let summaryElement: HTMLElement;
	let contentElement: HTMLElement;

	function shrink() {
		if (animation) {
			// Cancel the current animation
			animation.cancel();
		}
		// Store the current height of the details element
		const startHeight = `${detailsElement.offsetHeight}px`;
		// Calculate the height of the summary
		const endHeight = `${summaryElement.offsetHeight}px`;

		// Start a WAAPI animation
		animation = detailsElement.animate(
			{
				// Set the keyframes from the startHeight to endHeight
				height: [startHeight, endHeight]
			},
			{
				duration,
				easing
			}
		);

		// At the end of this we'll be closed.
		animation.onfinish = () => {
			state = 'closed';
			animation = null;
		};
	}

	function expand() {
		if (animation) {
			// Cancel the current animation
			animation.cancel();
		}
		// Get the current fixed height of the element
		const startHeight = `${detailsElement.offsetHeight}px`;
		// Calculate the open height of the element (summary height + content height)
		const endHeight = `${summaryElement.offsetHeight + contentElement.offsetHeight}px`;

		// Start a WAAPI animation
		animation = detailsElement.animate(
			{
				// Set the keyframes from the startHeight to endHeight
				height: [startHeight, endHeight]
			},
			{
				duration,
				easing
			}
		);
		animation.onfinish = () => {
			state = 'open';
			animation = null;
		};
	}

	function toggle(e: MouseEvent | undefined) {
		if (typeof detailsElement.animate !== 'function') {
			// if we don't support WAAPI,
			// we just proceed as normal
			return;
		}
		if (typeof e !== 'undefined') {
			e.preventDefault();
		}

		// We toggle the state of this
		if (state === 'expanding' || state === 'open') {
			// If there is already an animation running
			state = 'shrinking';
			// We request expansion a frame later
			// So that Svelte has time to update the DOM
			// following the state change
			window.requestAnimationFrame(shrink);
		} else if (state === 'shrinking' || state === 'closed') {
			state = 'expanding';
			window.requestAnimationFrame(expand);
		}
	}

	// Finally, we register with the global context
	onMount(() => {});
</script>

<Boopable let:boopage>
	<details
		on:click={toggle}
		bind:this={detailsElement}
		style={state === 'shrinking'
			? 'overflow:hidden;'
			: state === 'expanding'
			? `overflow:hidden;height:${detailsElement.offsetHeight}px`
			: ''}
		open={state !== 'closed'}
		class={state}
	>
		<summary bind:this={summaryElement} style="--duration:{duration}ms;--boopage:{boopage};">
			<slot name="summary" />
		</summary>
		<div class="content" bind:this={contentElement}>
			<slot />
		</div>
	</details>
</Boopable>

<style>
	details {
		cursor: pointer;
	}
	summary :global(*:first-child) {
		margin-top: 0;
	}
	summary :global(*:last-child) {
		margin-bottom: 0;
	}
	summary {
		position: relative;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary:after {
		content: '\25BE';
		font-size: 1.5em;
		position: absolute;
		right: 1em;
		top: 50%;
		width: 1.5em;
		height: 1.5em;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translateY(-50%) rotate(-90deg);
		transition: transform var(--duration);
		/*
            We can't use transform for our boop effect
            on account of it having a transition property;
            We use the scale property instead,
            despite its limited browser compatability
        */
		scale: calc(1 - 0.1 * var(--boopage));
	}
	details.expanding summary:after,
	details.open summary:after {
		transform: translateY(-50%) rotate(0deg);
	}
</style>
