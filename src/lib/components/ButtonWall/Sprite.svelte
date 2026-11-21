<svelte:options namespace="svg" />

<script lang="ts">
	// Pixel art written as rows of text: 'X' is a filled pixel, anything else is empty.
	type Props = { rows: string[]; x?: number; y?: number; fill: string };
	const { rows, x = 0, y = 0, fill }: Props = $props();

	// one path made of 1px-tall runs, so a whole sprite is a single element
	const d = $derived(
		rows
			.flatMap((row, dy) =>
				[...row.matchAll(/X+/g)].map(
					(run) => `M${x + run.index} ${y + dy}h${run[0].length}v1h-${run[0].length}z`
				)
			)
			.join('')
	);
</script>

<path {d} {fill} />
