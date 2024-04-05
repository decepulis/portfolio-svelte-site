<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { reduceMotion } from '$lib/stores';

	import type { Positions } from './position.d';
	import Position from './Position.svelte';

	const positions: Positions = [
		{
			role: 'Experience Engineer',
			employer: 'Mux',
			location: 'Chicago, IL',
			start: 'February 2022',
			end: 'Present',
			points: [
				'Working with the coolest team to build our marketing and docs site, and whatever other microsites come up',
				'Of course, that means maintaining those sites, too. Digging deep in the weeds to migrate those code bases to Next.js and clean up every last dusty corner.',
				"Wearing other hats: writing content, maintaining SDKs, and whatever other technical odds 'n ends pop up where a good web developer could make the developer experience better"
			]
		},
		{
			role: 'Full-Stack Web Developer',
			employer: 'Microsensor Labs',
			location: 'Chicago, IL',
			start: 'November 2018',
			end: 'January 2022',
			points: [
				'Worked closely with hardware team and stakeholders to design, develop, and deploy a full-stack data analysis and visualization application for improving hygiene compliance in hospitals, used by dozens of users in a clinical trial setting.',
				'Provided input across hardware and software to ensure simple and coherent user interactions and experiences.',
				'Established and maintained our corporate visual identity while developing marketing materials and web sites.'
			]
		},
		{
			role: 'Corporate Research Co-Op',
			employer: 'Bosch',
			location: 'Renningen, Germany',
			start: 'January',
			end: 'August 2017',
			points: [
				'Designed and developed web app suite for large-scale, intuitive sensor data aggregation and analysis.',
				'Lived and worked in a diverse, multilingual, international environment.'
			]
		},
		// {
		// 	role: 'Student Researcher',
		// 	employer: 'University of Cincinnati',
		// 	location: 'Cincinnati, OH',
		// 	start: 'May',
		// 	end: 'July 2016',
		// 	points: ['Simulated neural network hardware in MATLAB to support research.']
		// },
		{
			role: 'Innovation Lab Co-Op',
			employer: 'BMW Manufacturing',
			location: 'Greenville, SC',
			start: 'January',
			end: 'December 2015',
			points: [
				'Worked closely with stakeholders to design, develop, and deploy an iOS app for automobile inspections, saving them over an hour a day.',
				'Assisted Deep Learning research efforts by benchmarking clusters and preparing datasets.'
			]
		}
	];

	let activePositionIndex = 0;
	let slideshowElement: HTMLElement;
	let isScrolling = false;
	const scrollSpring = spring(0, { stiffness: 0.15, damping: 1, precision: 1 });
	// When the scroll spring updates,
	// so too does the window position
	scrollSpring.subscribe((value) => {
		slideshowElement?.scrollTo($scrollSpring, 0);
	});
	const scrollTo = (scrollTarget: number) => {
		const scrollStart = slideshowElement.scrollLeft;
		if ($reduceMotion) {
			scrollSpring.set(scrollTarget, { hard: true });
		} else {
			isScrolling = true;
			scrollSpring
				.set(scrollStart, { hard: true })
				// we run this twice
				// because for some reason, once isn't enough
				// to interrupt a running spring?
				.then(() => scrollSpring.set(scrollTarget))
				.then(() => scrollSpring.set(scrollTarget))
				.then(() => (isScrolling = false));
		}
	};
	const scrollToPositionAtIndex = (index: number) => {
		if (positions.length === 0) return;

		const positionElements = Array.from(
			slideshowElement.querySelectorAll('.position')
		) as HTMLElement[];
		const baseOffset = positionElements[0].offsetLeft;
		const indexOffset = positionElements[index].offsetLeft - baseOffset;

		scrollTo(indexOffset);
	};
	const onScrollOrResize = () => {
		if (positions.length === 0) return;

		const positionElements = Array.from(
			slideshowElement.querySelectorAll('.position')
		) as HTMLElement[];
		const positionElementOffsets = positionElements.map(
			(positionElement) => positionElement.offsetLeft
		);
		const baseOffset = positionElementOffsets[0];
		const currentOffset = slideshowElement.scrollLeft + baseOffset;

		const distanceToScroll = positionElementOffsets.map((offset) =>
			Math.abs(offset - currentOffset)
		);
		activePositionIndex = distanceToScroll.indexOf(Math.min(...distanceToScroll));
	};
	onMount(onScrollOrResize);
</script>

<svelte:window on:resize={onScrollOrResize} />

<section id="work">
	<h2 class="container">Some Places I've Worked</h2>
	<div
		class="slideshow"
		on:scroll={onScrollOrResize}
		bind:this={slideshowElement}
		class:snap={!isScrolling}
	>
		{#each positions as position}
			<Position {position} />
		{/each}
	</div>
	<div class="position-indicator">
		{#each positions as { role, employer }, idx}
			<button
				on:click={() => scrollToPositionAtIndex(idx)}
				class="position-button"
				aria-label="Scroll to {role}, {employer}"
				aria-current={activePositionIndex === idx ? 'step' : null}
			/>
		{/each}
	</div>
</section>

<style>
	#work {
		position: relative;
		--x-spacing: 0.5rem;
		/* TODO: iffy compatability? */
		--card-width: min(85vw, var(--content-width) + 4rem);
	}
	@media (min-width: 42rem) {
		#work {
			--x-spacing: 1rem;
		}
	}

	h2 {
		padding-bottom: 0;
	}
	.slideshow {
		display: flex;
		overflow-x: scroll;
		overflow-y: hidden;
		scrollbar-width: none;
	}
	.slideshow.snap {
		scroll-snap-type: x mandatory;
	}
	.slideshow::-webkit-scrollbar {
		display: none;
	}

	.slideshow:before,
	.slideshow:after {
		content: '';
		/* center cards in view */
		flex: 0 0 calc((100vw - var(--card-width)) / 2);
	}

	#work :global(.position):not(:last-of-type) {
		margin-right: var(--x-spacing);
	}

	#work :global(.position) {
		scroll-snap-align: center;
	}

	@media (min-width: 42rem) {
		/* align card with start of container*/
		.slideshow:before {
			flex: 0 0 calc(var(--main-padding) + var(--container-margin-width));
		}
		.slideshow:after {
			/* allow last card to align with snap start*/
			flex: 0 0
				calc(100vw - var(--container-margin-width) - var(--main-padding) - var(--card-width));
		}
		.slideshow {
			scroll-padding-left: calc(var(--main-padding) + var(--container-margin-width));
		}
		#work :global(.position) {
			scroll-snap-align: start;
		}
	}

	.position-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.position-button {
		appearance: none;
		-webkit-appearance: none;
		border: none;
		background: none;
		font: inherit;
		cursor: pointer;

		position: relative;
		width: 3rem;
		height: 3rem;
		margin: 0;
		padding: 0;
	}
	.position-button:after {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 100%;

		background-color: rgb(var(--c1));
		box-shadow: 0 0 0 0 rgb(var(--c3)), 0 0 0 0 rgb(var(--c2));
		transition: background-color var(--transition-speed-short),
			box-shadow var(--transition-speed-short);
	}
	.position-button[aria-current='step']:after {
		box-shadow: 0 0 0 0 rgb(var(--c3)), 0 0 0 calc(2 * var(--border-width)) rgb(var(--c2));
	}
	.position-button:hover:after {
		box-shadow: 0 0 0 calc(2 * var(--border-width)) rgb(var(--c3)),
			0 0 0 calc(4 * var(--border-width)) rgb(var(--c2));
	}
</style>
