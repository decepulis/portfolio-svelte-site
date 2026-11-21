<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';
</script>

<BadgeFrame href="https://www.linkedin.com/in/decepulis/" label="LinkedIn">
	{#snippet idle()}
		<rect width="88" height="31" fill="#FFFFFF" />
		<rect x="2" y="2" width="27" height="27" fill="#0066CC" />
		<text x="5" y="21" font-size="16" fill="#FFFFFF">in</text>
		<text x="34" y="14">HIRE</text>
		<text x="34" y="25" fill="#0066CC" class="show-first" style:--period="0.75s">ME?</text>
		<text x="34" y="25" fill="#0066CC" class="show-second" style:--period="0.75s">ME!</text>
		<Edge light="#CCCCCC" />
	{/snippet}

	{#snippet lit()}
		<rect width="88" height="31" fill="#0066CC" />
		<rect x="2" y="2" width="27" height="27" fill="#FFFFFF" />
		<text x="5" y="21" font-size="16" fill="#0066CC">in</text>
		<text x="34" y="14" fill="#FFFFFF">HIRE</text>
		<text x="34" y="25" fill="#FFFF00">ME!</text>
		<Edge light="#99CCFF" dark="#000066" />
	{/snippet}
</BadgeFrame>
