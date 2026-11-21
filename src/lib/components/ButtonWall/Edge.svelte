<svelte:options namespace="svg" />

<script lang="ts">
	// The 1px raised border most 88×31s had: light along the top and left, dark along the
	// bottom and right. Draw it last, so it sits on top of everything else.
	const { light = '#FFFFFF', dark = '#000000' }: { light?: string; dark?: string } = $props();
</script>

<rect width="88" height="1" fill={light} />
<rect width="1" height="31" fill={light} />
<rect y="30" width="88" height="1" fill={dark} />
<rect x="87" width="1" height="31" fill={dark} />
