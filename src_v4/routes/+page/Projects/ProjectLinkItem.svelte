<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { InfoIcon, ExternalLinkIcon, GithubIcon } from 'svelte-feather-icons';
	import Boopable from '$lib/components/Boopable.svelte';
	import type { LinkType } from './types';

	export let href: string;
	export let iconType: LinkType;

	const icon: Record<LinkType, typeof SvelteComponent> = {
		external: ExternalLinkIcon,
		info: InfoIcon,
		github: GithubIcon
	};
	const iconLabel: Record<LinkType, string> = {
		external: 'View Site',
		info: 'Learn More',
		github: 'View Source'
	};
</script>

<li>
	<Boopable let:boopage>
		<a {href} title={iconLabel[iconType]} class="no-effect" style="--boopage:{boopage};">
			<svelte:component this={icon[iconType]} size="1x" />
			<span class="visually-hidden">{iconLabel[iconType]}</span>
		</a>
	</Boopable>
</li>

<style>
	li {
		width: 2rem;
		height: 2rem;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	li:not(:last-of-type) {
		margin-right: 1.5rem;
	}
	li :global(span) {
		width: 100%;
		height: 100%;
	}
	a {
		position: absolute;

		background-color: rgba(var(--c4), 0.5);
		transition: background-color var(--transition-speed-short),
			box-shadow var(--transition-speed-short);

		--tap-target: calc((44px - 2rem) / 2);
		margin: calc(-1 * var(--tap-target));
		padding: calc(var(--tap-target));
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	a:hover {
		box-shadow: 0 0 0 calc(2 * var(--border-width)) rgb(var(--c5)),
			0 0 0 calc(4 * var(--border-width)) rgb(var(--c3));
	}

	a :global(svg) {
		vertical-align: -0.125em;
		transform: scale(calc(1 - 0.1 * var(--boopage)));
		will-change: transform;
	}
</style>
