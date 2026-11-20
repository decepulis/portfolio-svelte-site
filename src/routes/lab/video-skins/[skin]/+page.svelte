<script lang="ts">
	import LabPlayer from '../LabPlayer.svelte';
	import { skins } from '../skins';

	const { data } = $props();
	const skin = $derived(skins[data.slug]);
</script>

<h1 class="text-4xl">{skin.title}</h1>
<p class="max-w-prose">{skin.description}</p>
<LabPlayer Skin={skin.Skin} />
