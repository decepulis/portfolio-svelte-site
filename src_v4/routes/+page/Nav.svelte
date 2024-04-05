<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { spring } from 'svelte/motion';
	import { reduceMotion } from '$lib/stores';

	import Boopable from '$lib/components/Boopable.svelte';
	import ModeToggles from '$lib/components/DarkModeManager.svelte';

	let isMenuOpen = false;

	let resizing = false;
	let resizeTimeout: ReturnType<typeof setTimeout>;
	let navElement: HTMLElement;
	let navTop = 0;
	const onResize = () => {
		// Two things happen in this resize listener.
		// First, we forbid animations from firing
		// to prevent an annoying animation from firing with the menu
		resizing = true;
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => (resizing = false), 100);

		// Second, we update how far from the top the navbar is.
		// we wouldn't want to hide it above the viewport
		// if it hasn't stickied yet.
		if (typeof navElement === 'undefined') return;
		navTop = navElement.offsetTop + 5 * navElement.offsetHeight;
	};
	onMount(onResize);
	onDestroy(() => clearTimeout(resizeTimeout));

	let hide = false;
	let scrollY = 0;
	let lowestScrollY = 0;
	let showThreshold = 100;
	let atDocumentBottom = false;
	$: {
		if (scrollY < navTop || isMenuOpen) {
			// first up, no hiding if the nav isn't even at the top
			// or if the menu is open
			hide = false;
		} else if (scrollY > lowestScrollY) {
			// if we're scrolling down, we hide
			// and store the lowest scroll Y
			lowestScrollY = scrollY;
			hide = true;
		} else if (scrollY < lowestScrollY - showThreshold) {
			// if we're showThreshold above the lowest we've seen,
			// we assume we're scrolling up
			lowestScrollY = scrollY;
			hide = false;
		}
		// Finally, for navbar purposes,
		if (typeof window !== 'undefined') {
			atDocumentBottom = scrollY + window.innerHeight === document.documentElement.scrollHeight;
		}
	}

	// Next, let's set up the intersection observer
	// that will update the underlines under the links
	const sections = [
		{ id: 'about', label: 'About' },
		{ id: 'work', label: 'Work' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'contact', label: 'Contact' },
		{ id: 'credits', label: 'Credits' }
	];
	let sectionObservations: { [id: string]: number } = {};

	$: currentSectionId = atDocumentBottom
		? sections[sections.length - 1].id
		: Object.entries(sectionObservations).reduce(
				(current, [id, observation]) =>
					current.observation < observation ? { id, observation } : current,
				{ id: null, observation: 0 }
		  ).id;

	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') {
			return;
		}

		const observerConfig: IntersectionObserverInit = {
			root: null,
			threshold: [0, 0.25, 0.5, 0.75, 1]
		};
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(
				({ target, intersectionRatio }) =>
					(sectionObservations = {
						...sectionObservations,
						[target.getAttribute('id')]: intersectionRatio
					})
			);
		}, observerConfig);

		sections.forEach(({ id }) => {
			observer.observe(document.querySelector(`#${id}`));
		});

		return () => observer.disconnect();
	});

	// Finally, we're going to override the default link behavior
	// in order to fire a smooth-scroll animation
	const scrollSpring = spring(-1, { stiffness: 0.1, damping: 1, precision: 1 });
	const scrollTo = (id: string) => {
		// We hard-set the spring to the starting point
		// and then let it run to the target
		const scrollStart = window.scrollY;
		const scrollElement = document.querySelector(`#${id}`) as HTMLElement;
		const isLastElement = id === sections[sections.length - 1].id;
		if (typeof scrollElement !== 'undefined') {
			// we set the target either to the top of the element,
			// or the bottom of the page, depending on which comes first
			let topOfPageBottom = document.documentElement.scrollHeight - window.innerHeight;
			if (!isLastElement) {
				// here's a funny rule:
				// we have behavior which underlines the last item in the navbar
				// when we're at page bottom.
				// If we didn't mean to scroll to the last item in the navbar, however,
				// we probably don't want that last item underlined.
				// To prevent that smart behavior of underlining the last item,
				// we just offset topOfPageBottom by a teensy bit
				topOfPageBottom = topOfPageBottom - 1;
			}
			const topOfElement = scrollElement?.offsetTop - navElement.offsetHeight - 22;
			const scrollTarget = Math.min(topOfPageBottom, topOfElement);
			if ($reduceMotion) {
				scrollSpring.set(scrollTarget, { hard: true });
			} else {
				scrollSpring
					.set(scrollStart, { hard: true })
					// we run this twice
					// because for some reason, once isn't enough
					// to interrupt a running spring?
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

<svelte:window bind:scrollY on:resize={onResize} />

<nav class="full-bleed" class:hide class:resizing bind:this={navElement}>
	<a href="#hero" class="no-effect" on:click|preventDefault={() => scrollTo('hero')}>DC</a>
	<input
		class="menu-toggle"
		type="checkbox"
		bind:checked={isMenuOpen}
		title="Toggle Menu Visibility"
		aria-label="Toggle Menu Visibility"
		id="menu-toggle"
	/>
	<label class="menu-toggle-label" for="menu-toggle">
		<Boopable let:boopage><span class="menu-toggle-icon" style="--boopage:{boopage};" /></Boopable>
	</label>
	<div class="menu">
		{#each sections as { id, label }}
			<a
				href="#{id}"
				aria-current={currentSectionId === id ? 'section' : undefined}
				class="no-effect"
				on:click|preventDefault={() => scrollTo(id)}
				on:click={() => (isMenuOpen = false)}
				on:focus={() => (isMenuOpen = true)}
				on:blur={() => (isMenuOpen = false)}
			>
				{label}
			</a>
		{/each}
		<ModeToggles bind:isMenuOpen />
	</div>
</nav>

<style>
	nav {
		position: sticky;
		z-index: 1000;
		top: 0;
		padding-bottom: 0;
		background-color: rgb(var(--bg));
		transition: background-color var(--transition-speed-medium),
			transform var(--transition-speed-medium);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.menu-toggle,
	.menu-toggle-label {
		display: none;
	}
	.menu {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	a {
		text-decoration: none;
		transition: box-shadow var(--transition-speed-medium);
	}
	a[aria-current='section'] {
		box-shadow: inset 0 calc(-1 * var(--border-width)) rgb(var(--c4)),
			inset 0 calc(-2 * var(--border-width)) rgb(var(--c5)), 0 0 rgb(var(--c3));
	}
	a:hover {
		box-shadow: inset 0 calc(-1 * var(--border-width)) rgb(var(--c4)),
			inset 0 calc(-2 * var(--border-width)) rgb(var(--c5)),
			inset 0 calc(-3 * var(--border-width)) rgb(var(--c3));
	}
	a,
	.menu :global(.toggles) {
		padding: 1rem;
	}
	.menu :global(.toggles) {
		margin-left: auto;
		padding-right: 0;
	}
	@media (max-width: 42rem) {
		a {
			padding: 0.5rem;
		}
		.menu :global(.toggles) {
			padding: 0.5rem 1rem;
		}
		nav.hide {
			transform: translateY(-100%);
		}
		nav.resizing > .menu {
			transition: none;
		}
		.menu {
			position: absolute;
			z-index: 1001;
			background-color: rgb(var(--bg));
			border: var(--border-width) solid rgba(var(--c5), 1);
			top: calc(var(--main-padding) / 2);
			left: calc(var(--main-padding) / 2);
			right: calc(var(--main-padding) / 2);
			border-radius: 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			transform: scale(0.85);
			pointer-events: none;
			opacity: 0;
			transform-origin: calc(100% - 1rem) 1rem;
			transition: background-color var(--transition-speed-medium),
				color var(--transition-speed-medium), transform var(--transition-speed-medium),
				opacity var(--transition-speed-medium);
		}
		.menu-toggle-label {
			display: block;
			position: relative;
			width: 2rem;
			height: 2rem;
			margin: 0;
			z-index: 1002;
			cursor: pointer;
			transform: translateX(0) translateY(0);
		}
		.menu-toggle-label,
		.menu-toggle-icon:before,
		.menu-toggle-icon:after {
			transition: transform var(--transition-speed-medium);
			will-change: transform;
		}
		.menu-toggle-icon {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			transform: rotate(calc(var(--boopage) * 10deg));
		}
		.menu-toggle-icon:before,
		.menu-toggle-icon:after {
			content: '';
			background-color: rgb(var(--text));
			position: absolute;
			height: 0.15rem;
			left: 0;
			right: 0;
		}
		.menu-toggle-icon:before {
			top: calc(2rem / 3 - 0.075rem);
		}
		.menu-toggle-icon:after {
			bottom: calc(2rem / 3 - 0.075rem);
		}
		.menu-toggle:checked ~ .menu-toggle-label {
			transform: translateX(-0.5rem) translateY(1rem);
		}
		.menu-toggle:checked ~ .menu-toggle-label .menu-toggle-icon:before {
			transform: translateY(calc(2rem / 6)) rotateZ(135deg);
		}
		.menu-toggle:checked ~ .menu-toggle-label .menu-toggle-icon:after {
			transform: translateY(calc(-2rem / 6)) rotateZ(45deg);
		}
		.menu-toggle:checked ~ .menu {
			opacity: 1;
			transform: scale(1);
			pointer-events: auto;
		}

		.menu :global(.toggles) {
			margin-left: 0;
		}
	}

	/* Links */
	[href='#hero'] {
		font-family: var(--header-font-family);
		font-weight: var(--header-font-weight);
	}
</style>
