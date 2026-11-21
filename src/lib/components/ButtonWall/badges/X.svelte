<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';
</script>

<BadgeFrame href="https://x.com/darius_cepulis" label="X">
	{#snippet idle()}
		<rect width="88" height="31" fill="#CCCCCC" />
		<text x="30" y="14">X.COM</text>
		<g fill="#990000">
			<text x="27" y="25" class="show-first" style:--period="1s">FOLLOW</text>
			<text x="37" y="25" class="show-second" style:--period="1s">ME!</text>
		</g>
		<Edge />
	{/snippet}

	{#snippet lit()}
		<rect width="88" height="31" fill="#000000" />
		<text x="30" y="14" fill="#FFFFFF">X.COM</text>
		<text x="19" y="25" fill="#FF3333">FOLLOW ME</text>
		<Edge light="#666666" dark="#333333" />
	{/snippet}
</BadgeFrame>
