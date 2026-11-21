<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';

	const RAINBOW = ['#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#3399FF', '#FF00FF'];
	const LETTERS = [...'PHOTOS'];
</script>

<BadgeFrame href="https://www.instagram.com/darius_cepulis/" label="Instagram">
	{#snippet idle()}
		<rect width="88" height="31" fill="#000000" />
		<!-- each letter bounces and cycles the rainbow, one frame behind the letter before it -->
		{#each LETTERS as letter, i (i)}
			<text
				x={10 + i * 12}
				y="20"
				fill={RAINBOW[i]}
				class="letter"
				style:animation-delay="{-i * 0.125}s"
			>
				{letter}
			</text>
		{/each}
		<Edge light="#999999" dark="#333333" />
	{/snippet}

	{#snippet lit()}
		<!-- the rainbow moves out of the letters and into the background -->
		{#each RAINBOW as color, i (color)}
			<rect x={i * 13} width="13" height="31" fill={color} />
		{/each}
		{#each LETTERS as letter, i (i)}
			<text x={10 + i * 12} y="20">{letter}</text>
		{/each}
		<Edge />
	{/snippet}
</BadgeFrame>

<style>
	.letter {
		animation:
			bounce 0.5s step-end infinite,
			rainbow 0.875s step-end infinite;
		/* each letter's animation-delay is set inline, and applies to both */
	}
	@keyframes bounce {
		50% {
			transform: translateY(-2px);
		}
	}
	/* one color per frame at 8fps */
	@keyframes rainbow {
		0% {
			fill: #ff0000;
		}
		14.29% {
			fill: #ff9900;
		}
		28.57% {
			fill: #ffff00;
		}
		42.86% {
			fill: #00ff00;
		}
		57.14% {
			fill: #00ffff;
		}
		71.43% {
			fill: #3399ff;
		}
		85.71% {
			fill: #ff00ff;
		}
	}
</style>
