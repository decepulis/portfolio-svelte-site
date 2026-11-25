<script lang="ts">
	import { Spring, prefersReducedMotion } from 'svelte/motion';
	import { innerHeight, innerWidth, scrollY } from 'svelte/reactivity/window';

	import A from '#lib/components/typography/A.svelte';

	const sections = [
		{ id: 'about', label: 'about', decoration: '👨‍💻' },
		{ id: 'work', label: 'work', decoration: '💼' },
		{ id: 'contact', label: 'contact', decoration: '☎️' }
	];

	// where each section starts, measured again whenever the window resizes
	const sectionOffsets = $derived.by(() => {
		void innerWidth.current;
		void innerHeight.current;
		const offsets: { [id: string]: number } = {};
		for (const { id } of sections) {
			const element = document.getElementById(id);
			if (element) offsets[id] = element.offsetTop;
		}
		return offsets;
	});

	// the section we've scrolled into gets a 👉 in the nav
	const currentSection = $derived.by(() => {
		const y = scrollY.current;
		const height = innerHeight.current;
		if (y === undefined || height === undefined) return null;
		// 18px of wiggle room
		const atBottom = y + height + 18 >= document.documentElement.scrollHeight;
		if (atBottom) return sections[sections.length - 1].id;
		// navBarHeight + marginTop = 119
		const section = sections.findLast(({ id }) => sectionOffsets[id] <= y + 119);
		return section?.id ?? null;
	});

	// Finally, we're going to override the default link behavior
	// in order to fire a smooth-scroll animation
	const scrollSpring = new Spring(-1, { stiffness: 0.1, damping: 1, precision: 1 });
	const scrollTo = async (id: string) => {
		const scrollElement = document.getElementById(id);
		if (!scrollElement) return;
		// we set the target either to the top of the element,
		// or the bottom of the page, depending on which comes first
		// navBarHeight + mt-4 = 83
		const topOfPageBottom = document.documentElement.scrollHeight - window.innerHeight;
		const topOfElement = scrollElement.offsetTop - 83;
		const scrollTarget = Math.min(topOfPageBottom, topOfElement);
		if (prefersReducedMotion.current) {
			scrollSpring.set(scrollTarget, { instant: true });
		} else {
			// We hard-set the spring to where the page is now
			// and then let it run to the target
			await scrollSpring.set(window.scrollY, { instant: true });
			scrollSpring.set(scrollTarget);
		}
	};
	// And then when the scroll spring updates,
	// so too does the window position
	$effect(() => {
		if (scrollSpring.current > 0) window.scrollTo(0, scrollSpring.current);
	});
</script>

<nav
	class="border-silver dark:border-gray dark:bg-gainsboro sticky top-[-1px] z-50 flex flex-col items-center justify-between border-y bg-white px-4 py-2 md:flex-row"
>
	<ul class="text-ceter flex gap-4">
		{#each sections as { id, label, decoration } (id)}
			<li>
				<A
					withVisitedStyles={false}
					decoration={currentSection === id ? '👉' : decoration}
					href={`#${id}`}
					onclick={(e) => {
						e.preventDefault();
						scrollTo(id);
					}}
				>
					{label}
				</A>
			</li>
		{/each}
	</ul>

	<div class="text-sm">
		<!-- {JSON.stringify(ui)} -->
	</div>
</nav>
