<script>
	import A from '$lib/components/typography/A.svelte';
	import ui from '$lib/stores/ui.svelte';
</script>

<nav
	class="sticky top-[-1px] z-50 flex flex-col items-center justify-between border-y border-dotted border-black bg-white py-2 px-4 md:flex-row"
>
	<ul class="flex gap-4">
		<li>
			<A decoration="👨‍💻" href="#about">about</A>
		</li>
		<li>
			<A decoration="💼" href="#work">work</A>
		</li>
		<li>
			<A decoration="☎️" href="#contact">contact</A>
		</li>
		<li>
			<A decoration="🎬" href="#credits">credits</A>
		</li>
	</ul>

	<div class="">
		{#if ui.shouldReduceMotion}
			<span>motion reduced</span>
		{/if}
	</div>
</nav>
