<script>
	import ui from '$lib/stores/ui.svelte';
</script>

<nav
	class="sticky top-[-1px] z-50 flex flex-col items-center justify-between border-y border-dotted border-black bg-white py-2 px-4 md:flex-row"
>
	<ul class="flex gap-4">
		<li>
			<a class="group text-linkText" href="#about">
				👨‍💻 <span class="underline group-hover:decoration-wavy">about</span>
			</a>
		</li>
		<li>
			<a class="group text-linkText" href="#work">
				💼 <span class="underline group-hover:decoration-wavy">work</span>
			</a>
		</li>
		<li>
			<a class="group text-linkText" href="#contact">
				☎️ <span class="underline group-hover:decoration-wavy">contact</span>
			</a>
		</li>
		<li>
			<a class="group text-linkText" href="#credits">
				🎬 <span class="underline group-hover:decoration-wavy">credits</span>
			</a>
		</li>
	</ul>

	<div class="">
		{#if ui.shouldReduceMotion}
			<span>motion reduced</span>
		{/if}
	</div>
</nav>
