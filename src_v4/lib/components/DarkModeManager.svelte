<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quadIn, quadOut } from 'svelte/easing';

	import { SunIcon, MoonIcon, MonitorIcon } from 'svelte-feather-icons';

	import { darkMode, altMode } from '$lib/stores';
	import Boopable from '$lib/components/Boopable.svelte';

	// used to open menu on focus
	export let isMenuOpen: boolean;

	// Local State
	type Theme = {
		// set by svelte
		darkModePreference: 'light' | 'system' | 'dark' | undefined;
		altModePreference: 'primary' | 'alt' | undefined;

		// set by window/system
		systemTheme: 'dark' | 'light' | undefined;
	};
	let theme: Theme = {
		darkModePreference: undefined,
		altModePreference: undefined,
		systemTheme: undefined
	};

	// Update local state and keep in sync
	// by sending state up to the window
	const cycleDarkMode = () => {
		const nextMode =
			theme.darkModePreference === 'light'
				? 'dark'
				: theme.darkModePreference === 'dark'
				? 'system'
				: 'light';
		window.__setDarkModePreference(nextMode);
	};
	const toggleAltMode = () => {
		const nextMode = theme.altModePreference === 'primary' ? 'alt' : 'primary';
		window.__setAltModePreference(nextMode);
	};
	// and getting it back down
	onMount(() => {
		const updateLocalState = () => {
			theme = {
				darkModePreference: window.__darkModePreference,
				altModePreference: window.__altModePreference,
				systemTheme: window.__systemTheme
			};
			darkMode.set(window.__darkMode);
			altMode.set(window.__altMode);
		};

		window.__onThemeStateChange = updateLocalState;
		updateLocalState();
	});

	const duration = 200;
	const y = 16;
	const inEasing = quadOut;
	const outEasing = quadIn;
</script>

<div class="toggles">
	<Boopable let:boopage>
		<button
			class="dark-button"
			on:click={cycleDarkMode}
			title="Cycle Dark Mode"
			on:focus={() => (isMenuOpen = true)}
			on:blur={() => (isMenuOpen = false)}
		>
			{#if theme.darkModePreference === 'light'}
				<div
					class="icon"
					style="--boopage:{boopage};"
					in:fly={{ y, duration, delay: duration, easing: inEasing }}
					out:fly={{ y, duration, easing: outEasing }}
				>
					<SunIcon size="1.5x" class="boopable-icon" />
				</div>
			{:else if theme.darkModePreference === 'dark'}
				<div
					class="icon"
					style="--boopage:{boopage};"
					in:fly={{ y, duration, delay: duration, easing: inEasing }}
					out:fly={{ y, duration, easing: outEasing }}
				>
					<MoonIcon size="1.5x" class="boopable-icon" />
				</div>
			{:else if theme.darkModePreference === 'system'}
				<div
					class="icon"
					style="--boopage:{boopage};"
					in:fly={{ y, duration, delay: duration, easing: inEasing }}
					out:fly={{ y, duration, easing: outEasing }}
				>
					<MonitorIcon size="1.5x" class="boopable-icon" />
					{#if $darkMode === 'light'}
						<span
							class="system-icon"
							in:fly={{ y, duration, easing: inEasing }}
							out:fly={{ y, duration, easing: outEasing }}
						>
							<SunIcon size="0.5x" class="boopable-icon" />
						</span>
					{:else if $darkMode === 'dark'}
						<span
							class="system-icon"
							in:fly={{ y, duration, easing: inEasing }}
							out:fly={{ y, duration, easing: outEasing }}
						>
							<MoonIcon size="0.5x" class="boopable-icon" />
						</span>
					{/if}
				</div>
			{/if}
			<span class="visually-hidden">Cycle Dark Mode</span>
		</button>
	</Boopable>
	<Boopable let:boopage>
		<button
			class="alt-button"
			class:alt={$altMode === 'alt'}
			class:loaded={typeof $altMode !== 'undefined'}
			on:click={toggleAltMode}
			on:focus={() => (isMenuOpen = true)}
			on:blur={() => (isMenuOpen = false)}
			title="Toggle Alternate Color Mode"
			style="--boopage:{boopage};"
		>
			<span class="visually-hidden">Toggle Alternate Color Mode</span>
		</button>
	</Boopable>
</div>

<style>
	.toggles {
		display: flex;
		align-items: center;

		--height: 1.5rem;
		--alt-width: 2.5rem;
		--alt-border-width: 0.1rem;
	}
	.toggles > :global(span) {
		display: flex;
		align-items: center;
	}
	button {
		-webkit-appearance: none;
		appearance: none;
		background: none;
		border: 0;
		font-family: inherit;
		font-style: inherit;
		font-size: inherit;
		color: inherit;
		line-height: inherit;
		padding: 0;
		margin: 0;
		text-align: inherit;

		cursor: pointer;

		height: var(--height);
		width: var(--height);
		position: relative;
	}
	.toggles > :global(*:not(:last-child)) {
		margin-right: 0.5rem;
	}
	.icon {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.toggles :global(.boopable-icon) {
		transform: rotate(calc(var(--boopage) * 15deg));
		will-change: transform;
	}
	.system-icon {
		position: absolute;
		width: 50%;
		height: 40%;
		top: 23%;
		left: 25%;
		display: flex;

		align-items: center;
		justify-content: center;
	}
	.alt-button {
		width: var(--alt-width);
		border-radius: 2rem;
		border: var(--alt-border-width) solid rgb(var(--text));
		transition: border var(--transition-speed-medium);
		position: relative;
	}
	.alt-button:after {
		content: '';
		background-color: rgb(var(--c5));
		position: absolute;
		border-radius: 50%;
		width: calc(var(--height) - 4 * var(--alt-border-width));
		height: calc(var(--height) - 4 * var(--alt-border-width));
		left: var(--alt-border-width);
		top: var(--alt-border-width);
		transition: background-color var(--transition-speed-medium),
			transform var(--transition-speed-medium), opacity var(--transition-speed-medium);

		/*
            We can't use transform for our boop effect
            on account of it having a transition property;
            We use the scale property instead,
            despite its limited browser compatability
        */
		scale: calc(1 - 0.1 * var(--boopage));
	}
	.alt-button:not(.loaded):after {
		opacity: 0;
	}
	.alt-button.alt:after {
		transform: translateX(calc(var(--alt-width) - var(--height)));
	}
	@supports not (scale: 1) {
		.alt-button:hover:after {
			transform: translateX(calc(2 * var(--alt-border-width)));
		}
		.alt-button.alt:hover:after {
			transform: translateX(calc(var(--alt-width) - var(--height) - 2 * var(--alt-border-width)));
		}
	}
</style>
