<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';
</script>

<BadgeFrame label="Best viewed in any browser">
	{#snippet idle()}
		<rect width="88" height="31" fill="#FFFF00" />
		<text x="15" y="13">BEST VIEWED</text>
		<g style:--period="0.5s">
			<text x="11" y="24" fill="#FF0000" class="show-first">ANY BROWSER</text>
			<text x="11" y="24" fill="#0000FF" class="show-second">ANY BROWSER</text>
		</g>
		<Edge dark="#999900" />
	{/snippet}
</BadgeFrame>
