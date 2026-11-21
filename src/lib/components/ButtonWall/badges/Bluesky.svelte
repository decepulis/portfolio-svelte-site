<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';
	import Sprite from '../Sprite.svelte';

	const WINGS_UP = [
		'XX.....XX',
		'XXX...XXX',
		'XXXX.XXXX',
		'.XXXXXXX.',
		'..XX.XX..',
		'.XXX.XXX.',
		'.XX...XX.'
	];
	const WINGS_DOWN = [
		'.........',
		'.X.....X.',
		'.XXX.XXX.',
		'..XXXXX..',
		'..XX.XX..',
		'..XX.XX..',
		'.........'
	];
</script>

<BadgeFrame href="https://bsky.app/profile/darius.place" label="Bluesky">
	{#snippet idle()}
		<!-- sky, in bands from deep blue down to pale -->
		<rect width="88" height="5" fill="#0066FF" />
		<rect y="5" width="88" height="5" fill="#0066FF" />
		<rect y="10" width="88" height="6" fill="#3399FF" />
		<rect y="16" width="88" height="5" fill="#3399FF" />
		<rect y="21" width="88" height="5" fill="#66CCFF" />
		<rect y="26" width="88" height="5" fill="#99FFFF" />
		<g class="cloud" fill="#FFFFFF">
			<rect x="60" y="21" width="14" height="4" />
			<rect x="63" y="18" width="7" height="3" />
		</g>
		<text x="6" y="14" fill="#FFFFFF">BLUE</text>
		<text x="6" y="25" fill="#000066">SKY</text>
		<g class="show-first" style:--period="0.25s">
			<Sprite rows={WINGS_DOWN} x={64} y={8} fill="#000066" />
		</g>
		<g class="show-second" style:--period="0.25s">
			<Sprite rows={WINGS_UP} x={64} y={8} fill="#000066" />
		</g>
		<Edge />
	{/snippet}

	{#snippet lit()}
		<rect width="88" height="31" fill="#000066" />
		<text x="6" y="14" fill="#FFFFFF">FOLLOW</text>
		<text x="6" y="25" fill="#99FFFF">ME &gt;</text>
		<Sprite rows={WINGS_UP} x={64} y={12} fill="#99FFFF" />
		<Edge light="#3399FF" />
	{/snippet}
</BadgeFrame>

<style>
	/* drifts in from the right edge and out past the left, 1px a frame */
	.cloud {
		animation: drift 13.5s steps(108) infinite;
	}
	@keyframes drift {
		from {
			transform: translateX(28px);
		}
		to {
			transform: translateX(-80px);
		}
	}
</style>
