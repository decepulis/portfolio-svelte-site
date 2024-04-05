<script lang="ts">
	import './layout.css';
	import ui from '$lib/stores/ui.svelte';
	import ShouldReduceMotionManager from '$lib/components/ShouldReduceMotionManager.svelte';
</script>

<ShouldReduceMotionManager />

{#if ui.shouldReduceMotion}
	<p>Reduced motion is enabled</p>
{:else}
	<p>Reduced motion is disabled</p>
{/if}

<slot />
