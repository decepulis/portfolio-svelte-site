<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		/** where the badge links; leave it out for a badge that's just for show */
		href?: string;
		/** what a screen reader announces in place of the picture */
		label: string;
		/** the badge at rest, usually animated */
		idle: Snippet;
		/** a still "lit" version shown on hover, like an old onMouseOver image swap */
		lit?: Snippet;
	};
	const { href, label, idle, lit }: Props = $props();
</script>

{#snippet art()}
	<!--
		88×31, the size of a classic web badge. One SVG unit is one badge pixel,
		and Silkscreen at 8px draws each letter on that same pixel grid. For text to stay
		crisp it has to start on a whole pixel, so badges place text by its left edge
		(never text-anchor="middle", which can land an odd-width string on a half pixel).
	-->
	<svg
		viewBox="0 0 88 31"
		width="88"
		height="31"
		shape-rendering="crispEdges"
		font-family="Silkscreen, monospace"
		font-size="8"
		aria-hidden="true"
		class="badge block h-auto w-full"
	>
		{@render idle()}
		{#if lit}
			<!-- drawn over the idle badge, and only shown on hover or focus -->
			<g class="lit">{@render lit()}</g>
		{/if}
	</svg>
{/snippet}

{#if href}
	<!-- every badge links off-site (or to mailto:), so there's nothing to resolve -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		{href}
		aria-label={label}
		class="block outline-offset-2 active:translate-x-px active:translate-y-px"
	>
		{@render art()}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
	<div role="img" aria-label={label}>
		{@render art()}
	</div>
{/if}

<style>
	.lit {
		visibility: hidden;
	}
	a:hover .lit,
	a:focus-visible .lit {
		visibility: visible;
	}

	/*
		Two frames that take turns, like a two-frame GIF: .show-first is visible for the
		first half of each --period, .show-second for the second half. Every badge uses these.
	*/
	:global(.badge .show-first) {
		animation: badge-show-first var(--period) step-end infinite;
	}
	:global(.badge .show-second) {
		visibility: hidden;
		animation: badge-show-second var(--period) step-end infinite;
	}
	@keyframes -global-badge-show-first {
		50% {
			visibility: hidden;
		}
	}
	@keyframes -global-badge-show-second {
		50% {
			visibility: visible;
		}
	}
</style>
