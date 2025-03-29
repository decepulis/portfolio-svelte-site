<script lang="ts">
	import A from '$lib/components/typography/A.svelte';
	import ui from '$lib/stores/ui.svelte';
	import throttle from 'just-throttle';
	import { spring } from 'svelte/motion';

	// let's set up the window listeners
	// that will update the underlines under the links
	const sections = [
		{ id: 'about', label: 'about', decoration: '👨‍💻' },
		{ id: 'work', label: 'work', decoration: '💼' },
		{ id: 'contact', label: 'contact', decoration: '☎️' }
	];
	let currentSection: string | null = $state(null);
	$effect(() => {
		let sectionOffsets: { [id: string]: number } = {};
		// update the section offsets when the window resizes
		const onWindowResize = () => {
			const newSectionOffsets = { ...sectionOffsets };
			sections.forEach((section) => {
				const element = document.querySelector(`#${section.id}`) as HTMLElement;
				if (typeof element !== 'undefined') {
					newSectionOffsets[section.id] = element.offsetTop;
				}
			});
			sectionOffsets = newSectionOffsets;
		};

		// update the current section when the user scrolls
		const onScroll = () => {
			const scrollY = window.scrollY;
			// 18px of wiggle room
			const atBottom = scrollY + window.innerHeight + 18 >= document.documentElement.scrollHeight;
			if (atBottom) {
				currentSection = sections[sections.length - 1].id;
				return;
			}
			const section = sections
				.slice()
				.reverse()
				.find((section) => {
					const offset = sectionOffsets[section.id];
					// navBarHeight + marginTop = 119
					return offset <= scrollY + 119;
				});
			currentSection = section?.id ?? null;
		};

		// attach event listeners and fire them once
		const throttledOnWindowResize = throttle(onWindowResize, 250);
		const throttledOnScroll = throttle(onScroll, 250);
		window.addEventListener('resize', throttledOnWindowResize);
		window.addEventListener('scroll', throttledOnScroll);
		onWindowResize();
		onScroll();
		return () => {
			window.removeEventListener('resize', throttledOnWindowResize);
			window.removeEventListener('scroll', throttledOnScroll);
		};
	});

	// Finally, we're going to override the default link behavior
	// in order to fire a smooth-scroll animation
	const scrollSpring = spring(-1, { stiffness: 0.1, damping: 1, precision: 1 });
	const scrollTo = (id: string) => {
		// We hard-set the spring to the starting point
		// and then let it run to the target
		const topOfPageBottom = document.documentElement.scrollHeight - window.innerHeight;
		const scrollStart = window.scrollY;
		const scrollElement = document.querySelector(`#${id}`) as HTMLElement;
		if (typeof scrollElement !== 'undefined') {
			// we set the target either to the top of the element,
			// or the bottom of the page, depending on which comes first
			// navBarHeight + mt-4 = 83
			const topOfElement = scrollElement?.offsetTop - 83;
			const scrollTarget = Math.min(topOfPageBottom, topOfElement);
			if (ui.shouldReduceMotion) {
				scrollSpring.set(scrollTarget, { hard: true });
			} else {
				scrollSpring
					.set(scrollStart, { hard: true })
					// we fire this twice since once doesn't seem to be enough to interrupt a running spring
					.then(() => scrollSpring.set(scrollTarget))
					.then(() => scrollSpring.set(scrollTarget));
			}
		}
	};
	// And then when the scroll spring updates,
	// so too does the window position
	scrollSpring.subscribe((value) => {
		if (typeof window === 'undefined') return;
		if (value > 0) {
			window.scrollTo(0, value);
		}
	});
</script>

<nav
	class="border-silver dark:border-darkgray sticky top-[-1px] z-50 flex flex-col items-center justify-between border-y bg-white px-4 py-2 md:flex-row dark:bg-black"
>
	<ul class="text-ceter flex gap-4">
		{#each sections as { id, label, decoration }}
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
