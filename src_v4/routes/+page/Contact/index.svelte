<script lang="ts">
	import type { SvelteComponent } from 'svelte/internal';
	import { onMount } from 'svelte';

	import { MailIcon, GithubIcon, LinkedinIcon, InstagramIcon } from 'svelte-feather-icons';

	import Boopable from '$lib/components/Boopable.svelte';
	import MailModal from './MailModal.svelte';

	let isMailModalOpen: boolean;
	const openMailModal = () => (isMailModalOpen = true);

	const strokePx = 22;
	const r = strokePx;
	let height = strokePx * 5 + r * 4;

	let width = 0;
	const maxWidth = 1008;

	type Stripe = {
		color: `rgb(var(--${string}))`;
		y: number;
		xMax: number;
		circle?: 'up' | 'down';
		link?: {
			title: string;
			href: string;
			icon: typeof SvelteComponent;
			onClick?: svelte.JSX.MouseEventHandler<HTMLAnchorElement>;
		};
	};
	let stripes: Stripe[] = [];
	let svgElement: SVGElement;
	const onResize = () => {
		if (typeof svgElement === 'undefined') return;

		// Recalculate viewbox
		const svgRect = svgElement.getBoundingClientRect();
		width = svgRect.width;

		// Recalculate stripes
		const halfHeight = height / 2;
		const halfWidth = width / 2;
		const widthInterval = Math.min(width, maxWidth) / 5;
		stripes = [
			{
				color: 'rgb(var(--c1))',
				y: halfHeight - 2 * strokePx,
				xMax: halfWidth - 1.5 * widthInterval,
				circle: 'up',
				link: {
					title: 'E-Mail',
					href: 'mailto:de.cepulis@gmail.com',
					icon: MailIcon,
					onClick: (e) => {
						e.preventDefault();
						openMailModal();
					}
				}
			},
			{
				color: 'rgb(var(--c2))',
				y: halfHeight - 1 * strokePx,
				xMax: halfWidth + 0.5 * widthInterval,
				circle: 'up',
				link: { title: 'GitHub', href: 'https://github.com/decepulis', icon: GithubIcon }
			},
			{
				color: 'rgb(var(--c3))',
				y: halfHeight,
				xMax: width
			},
			{
				color: 'rgb(var(--c4))',
				y: halfHeight + 1 * strokePx,
				xMax: halfWidth + 1.5 * widthInterval,
				circle: 'down',
				link: {
					title: 'LinkedIn',
					href: 'https://www.linkedin.com/in/decepulis/',
					icon: LinkedinIcon
				}
			},
			{
				color: 'rgb(var(--c5))',
				y: halfHeight + 2 * strokePx,
				xMax: halfWidth - 0.5 * widthInterval,
				circle: 'down',
				link: {
					title: 'Instagram',
					href: 'https://www.instagram.com/darius_cepulis/',
					icon: InstagramIcon
				}
			}
		];
	};
	// Run function when ref has definition
	$: {
		if (typeof svgElement === 'undefined') break $;
		onResize();
	}

	// Show animation when intersecting
	let show = false;
	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') {
			show = true;
			return;
		}

		const observerConfig: IntersectionObserverInit = {
			root: null,
			threshold: 0.9
		};
		const observer = new IntersectionObserver((entries) => {
			const intersecting = entries?.[0]?.isIntersecting;
			if (intersecting) {
				observer.unobserve(svgElement);
				show = true;
			}
		}, observerConfig);

		observer.observe(svgElement);

		return () => observer.disconnect();
	});
</script>

<svelte:window on:resize={onResize} />

<MailModal bind:isOpen={isMailModalOpen} />
<section id="contact" class="container">
	<h2>How to Reach Me</h2>
	<svg viewBox="0 0 {width} {height}" bind:this={svgElement}>
		{#each stripes as { color, xMax, y, circle, link }}
			<g>
				<path
					d="
					M 0,{y}
					L {xMax},{y}
					{circle === 'up'
						? `a ${r},${r} 0 1,0 0,${-r * 2} a ${r},${r} 0 1,0 0,${r * 2}`
						: circle === 'down'
						? `a ${r},${r} 0 1,1 0,${r * 2} a ${r},${r} 0 1,1 0,${-r * 2}`
						: ``}
				"
					stroke={color}
					stroke-width="{strokePx}px"
					pathLength="1"
					stroke-dasharray="1 1"
					class:show
				/>
				{#if typeof circle !== 'undefined' && typeof link !== 'undefined'}
					<foreignObject
						x={xMax - r - strokePx / 2}
						y={circle === 'up' ? y - strokePx / 2 - 2 * r : y - strokePx / 2}
						width={2 * r + strokePx}
						height={2 * r + strokePx}
					>
						<Boopable let:boopage>
							<a
								class="svg-link no-effect"
								class:show
								title={link.title}
								href={link.href}
								style="background-color:{color};--boopage:{boopage};"
								on:click={link.onClick}
							>
								<svelte:component this={link.icon} size="1.5x" />
								<span class="visually-hidden">{link.title}</span>
							</a>
						</Boopable>
					</foreignObject>
				{/if}
			</g>
		{/each}
	</svg>
</section>

<style>
	svg {
		width: 100vw;
		position: relative;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;

		--transition-speed-stroke: 1s;

		overflow: visible;
	}
	path {
		fill: none;

		stroke-dashoffset: 1;
		/* we also transition opacity to avoid visual glitches at offset = 1*/
		opacity: 0;
		transition: stroke var(--transition-speed-medium),
			stroke-dashoffset var(--transition-speed-stroke), opacity 0.05s 0.05s;
	}
	path.show {
		stroke-dashoffset: 0;
		opacity: 1;
	}
	.svg-link {
		width: 100%;
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: rgb(var(--dark));
		pointer-events: none;
		opacity: 0;
		transform: scale(0.5);
		--transition-delay-link: calc(var(--transition-speed-stroke) * 0.75);
		transition: background-color var(--transition-speed-medium),
			opacity var(--transition-speed-medium) var(--transition-delay-link),
			transform var(--transition-speed-medium) var(--transition-delay-link);
	}
	/* [type='radio']:focus ~ label {
		outline-style: solid;
	}
	[type='radio']:focus:not(:focus-visible) ~ label {
		outline: 0;
	} */
	.svg-link:focus-visible {
		outline: 0;
	}
	.svg-link:focus-visible > :global(svg) {
		/* Focus ring isn't visible in chrome so we outline the svg instead */
		outline-style: solid;
	}
	.svg-link.show {
		pointer-events: auto;
		opacity: 1;
		transform: scale(1);
	}
	.svg-link :global(svg) {
		transform: scale(calc(1 - 0.2 * var(--boopage)));
		will-change: transform;
	}
</style>
