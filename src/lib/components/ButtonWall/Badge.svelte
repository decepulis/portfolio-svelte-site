<script lang="ts">
	import type { BadgeSpec } from './badges';
	import { H, W } from './pixel';

	type Props = {
		badge: BadgeSpec;
		/** shared clock; each tick is one animation frame */
		tick: number;
		/** true once the pixel font has loaded */
		ready: boolean;
		/** extra data for badges that show some, like the visitor counter */
		value?: number | null;
		/** accessible label, overriding the badge's own */
		label?: string;
		/** called when the badge is hovered or focused, and when it stops being */
		onhotchange?: (hot: boolean) => void;
	};
	const { badge, tick, ready, value = null, label, onhotchange }: Props = $props();

	let canvas: HTMLCanvasElement;
	let hot = $state(false);
	// frame only advances while the badge is animating, so it stays a plain variable
	let frame = 0;
	let lastTick = 0;

	$effect(() => {
		if (!ready) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, W, H);
		// hovered, a badge holds still on its lit image, like a rollover
		if (hot && badge.lit) {
			badge.lit(ctx);
			return;
		}
		if (tick !== lastTick) {
			frame++;
			lastTick = tick;
		}
		badge.draw(ctx, frame, value);
	});

	const heat = (on: boolean) => () => {
		hot = on;
		onhotchange?.(on);
	};
</script>

{#snippet art()}
	<canvas
		bind:this={canvas}
		width={W}
		height={H}
		aria-hidden="true"
		class="block aspect-[88/31] w-full [image-rendering:pixelated]"
	></canvas>
{/snippet}

{#if badge.href}
	<!-- every badge links off-site (or to mailto:), so there's nothing to resolve -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		href={badge.href}
		aria-label={label ?? badge.label}
		class="block outline-offset-2 focus-visible:outline-2 active:translate-x-px active:translate-y-px"
		onpointerenter={heat(true)}
		onpointerleave={heat(false)}
		onfocus={heat(true)}
		onblur={heat(false)}
	>
		{@render art()}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
	<div
		role="img"
		aria-label={label ?? badge.label}
		onpointerenter={heat(true)}
		onpointerleave={heat(false)}
	>
		{@render art()}
	</div>
{/if}
