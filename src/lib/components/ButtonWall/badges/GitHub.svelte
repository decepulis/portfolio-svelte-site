<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';
</script>

<BadgeFrame href="https://github.com/decepulis" label="GitHub">
	{#snippet idle()}
		<rect width="88" height="31" fill="#000000" />
		<rect width="27" height="31" fill="#CCCCCC" />
		<text x="7" y="19">&lt;/&gt;</text>
		<text x="31" y="13" fill="#00FF00">GITHUB</text>
		<!-- the username scrolls past like a ticker; two copies 72px apart make the loop seamless -->
		<svg x="28" y="15" width="59" height="14">
			<g class="ticker" fill="#999999">
				<text x="3" y="10">decepulis</text>
				<text x="75" y="10">decepulis</text>
			</g>
		</svg>
		<Edge dark="#666666" />
	{/snippet}

	{#snippet lit()}
		<rect width="88" height="31" fill="#00FF00" />
		<rect width="27" height="31" fill="#000000" />
		<text x="7" y="19" fill="#00FF00">&lt;/&gt;</text>
		<text x="31" y="14">READ MY</text>
		<text x="31" y="25">CODE &gt;</text>
		<Edge dark="#006600" />
	{/snippet}
</BadgeFrame>

<style>
	/* 2px a frame at 8fps, a GIF's pace */
	.ticker {
		animation: ticker 4.5s steps(36) infinite;
	}
	@keyframes ticker {
		to {
			transform: translateX(-72px);
		}
	}
</style>
