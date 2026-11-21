<script lang="ts">
	import ui from '$lib/stores/ui.svelte';

	// A browser status bar, the strip along the bottom of the window where hovering a link
	// showed its address, or whatever the page set with onMouseOver="window.status='…'".

	const { message }: { message: string } = $props();

	// how much of the message has been typed out so far
	let typed = $state(0);
	const shown = $derived(ui.shouldReduceMotion ? message : message.slice(0, typed));

	// type each new message out, quickly, the way a status bar redraws
	$effect(() => {
		const length = message.length;
		typed = 0;
		const id = setInterval(() => {
			typed += 2;
			if (typed >= length) clearInterval(id);
		}, 16);
		return () => clearInterval(id);
	});
</script>

<p
	class="border-t-gray border-l-gray mt-2 truncate border border-r-white border-b-white px-2 py-0.5 font-sans text-sm"
>
	<!-- the full message for assistive tech, so it isn't read out one keystroke at a time -->
	<span class="sr-only">{message}</span>
	<span aria-hidden="true">{shown || ' '}</span>
</p>
