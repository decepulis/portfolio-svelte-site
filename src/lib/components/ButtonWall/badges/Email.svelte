<script lang="ts">
	import BadgeFrame from '../BadgeFrame.svelte';
	import Edge from '../Edge.svelte';
	import Sprite from '../Sprite.svelte';

	// the fold lines on the front of an envelope
	const CLOSED_FOLD = [
		'XX..................XX',
		'..X................X..',
		'...XX............XX...',
		'.....X..........X.....',
		'......XX......XX......',
		'........X....X........',
		'.........X..X.........',
		'..........XX..........'
	];
	const OPEN_FOLD = [
		'XX................XX',
		'..XX............XX..',
		'....XX........XX....',
		'......XX....XX......',
		'........XXXX........'
	];
</script>

<BadgeFrame href="mailto:darius@cepulis.net" label="Email me at darius@cepulis.net">
	{#snippet idle()}
		<rect width="88" height="31" fill="#000099" />
		<rect x="5" y="8" width="22" height="15" fill="#FFFFFF" />
		<Sprite rows={CLOSED_FOLD} x={5} y={8} fill="#000000" />
		<!-- a "you've got mail" flag -->
		<g class="show-first" style:--period="0.5s">
			<rect x="22" y="4" width="7" height="7" fill="#FF0000" />
			<rect x="25" y="5" width="1" height="3" fill="#FFFFFF" />
			<rect x="25" y="9" width="1" height="1" fill="#FFFFFF" />
		</g>
		<text x="33" y="14" fill="#FFFF00">MAIL</text>
		<text x="33" y="25" fill="#FFFFFF" class="show-first" style:--period="0.25s">ME!</text>
		<text x="33" y="25" fill="#00FFFF" class="show-second" style:--period="0.25s">ME!</text>
		<Edge />
	{/snippet}

	{#snippet lit()}
		<rect width="88" height="31" fill="#FFFF00" />
		<!-- the envelope opened, with the letter sliding out -->
		<rect x="8" y="3" width="16" height="13" fill="#000000" />
		<rect x="9" y="4" width="14" height="12" fill="#FFFFFF" />
		<rect x="11" y="6" width="10" height="1" fill="#999999" />
		<rect x="11" y="8" width="10" height="1" fill="#999999" />
		<rect x="11" y="10" width="10" height="1" fill="#999999" />
		<rect x="5" y="13" width="22" height="13" fill="#000000" />
		<rect x="6" y="14" width="20" height="11" fill="#FFFFFF" />
		<Sprite rows={OPEN_FOLD} x={6} y={14} fill="#000000" />
		<text x="33" y="14" fill="#000099">SEND</text>
		<text x="33" y="25" fill="#000099">MAIL!</text>
		<Edge dark="#999900" />
	{/snippet}
</BadgeFrame>
