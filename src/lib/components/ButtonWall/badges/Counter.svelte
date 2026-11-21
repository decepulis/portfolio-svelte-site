<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';

	type Props = {
		/** the count to show; a float while the odometer is rolling, null if unknown */
		value: number | null;
		label: string;
	};
	const { value, label }: Props = $props();

	const DIGITS = 6;
	const WHEEL_W = 11;
	const WHEEL_H = 14;

	// An odometer: each wheel is a strip of digits 0–9 (and 0 again, for rolling over)
	// slid up behind a window. A wheel only turns while every wheel to its right is
	// passing from 9 to 0, like a real one.
	const wheels = $derived(
		Array.from({ length: DIGITS }, (_, i) => {
			const x = 9 + i * (WHEEL_W + 1);
			if (value === null) return { x, offset: null };
			const place = 10 ** (DIGITS - 1 - i);
			const digit = Math.floor(value / place) % 10;
			const roll = place === 1 ? value % 1 : Math.max(0, (value % place) - (place - 1));
			return { x, offset: Math.round((digit + roll) * WHEEL_H) };
		})
	);
</script>

<BadgeFrame {label}>
	{#snippet idle()}
		<rect width="88" height="31" fill="#333333" />
		<text x="23" y="10" fill="#FFFFFF">VISITORS</text>
		{#each wheels as { x, offset } (x)}
			<!-- a nested svg clips its contents, so it's the wheel's window -->
			<svg {x} y="13" width={WHEEL_W} height={WHEEL_H}>
				<rect width={WHEEL_W} height={WHEEL_H} fill="#000000" />
				{#if offset === null}
					<text x="3" y="10" fill="#006600">-</text>
				{:else}
					<g transform="translate(0 {-offset})" fill="#00FF00">
						{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as digit, d (d)}
							<text x="3" y={10 + d * WHEEL_H}>{digit}</text>
						{/each}
					</g>
				{/if}
			</svg>
		{/each}
		<Edge light="#666666" />
	{/snippet}
</BadgeFrame>
