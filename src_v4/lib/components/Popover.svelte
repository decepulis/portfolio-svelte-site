<script context="module" lang="ts">
	type CloseFn = () => void;

	const closeFns: Set<CloseFn> = new Set();
	const closeAll = () => closeFns.forEach((closeFn) => closeFn());
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let isOpen = false;

	// Register with module context
	const open: CloseFn = () => (isOpen = true);
	const close: CloseFn = () => (isOpen = false);
	onMount(() => {
		closeFns.add(close);
		return () => closeFns.delete(close);
	});

	// Toggle Functions
	$: toggle = isOpen
		? closeAll
		: () => {
				closeAll();
				open();
		  };

	// Escape Key
	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeAll();
		}
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<button on:click={toggle} class="wrapper" class:open={isOpen}>
	<span class="text">
		<slot />
	</span>
	<div class="popover">
		<slot name="content" />
	</div>
</button>

<style>
	button {
		appearance: none;
		-webkit-appearance: none;
		background: none;
		border: 0;
		font-style: inherit;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		padding: 0;
		margin: 0;
		text-align: inherit;
		cursor: help;
	}

	.text {
		box-shadow: inset 0 calc(-1 * var(--border-width)) rgb(var(--c2)), 0 0 rgb(var(--c3));
		transition: box-shadow var(--transition-speed-short);
	}
	.wrapper:hover .text,
	.wrapper.open .text {
		box-shadow: inset 0 calc(-1 * var(--border-width)) rgb(var(--c2)),
			0 var(--border-width) rgb(var(--c3));
	}

	.wrapper {
		position: relative;
	}
	.popover {
		padding: 0.5rem;
		border-radius: 0.5rem;
		background-color: rgb(var(--bg));
		border: var(--border-width) solid rgba(var(--c2), 1);

		--arrow-size: 0.5rem;

		position: absolute;
		top: calc(100% + var(--arrow-size) * 1.5);
		left: 0;

		opacity: 0;
		pointer-events: none;
		transform: scale(0.5);
		transform-origin: top left;
		will-change: transform;

		transition: background-color var(--transition-speed-medium),
			border var(--transition-speed-medium), opacity var(--transition-speed-short),
			transform var(--transition-speed-short);
	}
	.wrapper.open .popover {
		pointer-events: auto;
		opacity: 1;
		transform: scale(1);
	}
	.popover:before {
		content: '';

		position: absolute;
		width: 0;
		height: 0;
		top: calc(-1 * var(--arrow-size));
		left: 1rem;
		transform: translateX(-50%);

		border-left: var(--arrow-size) solid transparent;
		border-right: var(--arrow-size) solid transparent;
		border-bottom: var(--arrow-size) solid rgb(var(--c2));
	}
</style>
