<script lang="ts">
	import { manageReduceMotion, manageTheme } from './ui.svelte';

	$effect(manageReduceMotion);
	$effect(manageTheme);
</script>
