<script lang="ts">
	import './layout.css';
	import ShouldReduceMotionManager from '$lib/components/ShouldReduceMotionManager.svelte';

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<ShouldReduceMotionManager />
<slot />
