<script lang="ts">
	import type { Badge } from './badges';
	import { H, W } from './pixel';

	type Props = {
		badge: Badge;
		/** shared clock, ~16 ticks per second */
		tick: number;
		/** true once the pixel font has loaded */
		ready: boolean;
		/** extra data for badges that show some, like the visitor counter */
		value?: number | null;
		/** accessible label, overriding the badge's own */
		label?: string;
	};
	const { badge, tick, ready, value = null, label }: Props = $props();

	let canvas: HTMLCanvasElement;
	// these drive drawing but shouldn't trigger it, so they stay plain variables
	let frame = 0;
	let lastTick = 0;
	let hot = false;

	$effect(() => {
		if (!ready) return;
		// at rest a badge animates at 8fps like a GIF; hovered, at the full 16fps
		if (tick !== lastTick) {
			if (hot || tick % 2 === 0) frame++;
			lastTick = tick;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, W, H);
		badge.draw(ctx, frame, value);
	});

	const heat = (on: boolean) => () => (hot = on);
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
