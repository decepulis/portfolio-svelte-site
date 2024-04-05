<script lang="ts">
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import Boopable from '$lib/components/Boopable.svelte';

	export let isOpen = false;

	// Accessibility:
	// -- Bring Focus Into Modal On Open --
	let previouslyFocusedElement: HTMLElement | undefined;
	let modalElement: HTMLElement;
	let focusElements: HTMLElement[];
	$: {
		if (isOpen) {
			// on open...
			previouslyFocusedElement = document?.activeElement as HTMLElement | undefined;
			if (modalElement) {
				// after open...
				// ...get focusable elements...
				// https://zellwk.com/blog/keyboard-focusable-elements/
				focusElements = Array.from(
					modalElement.querySelectorAll(
						'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
					)
				).filter(
					(element) => !element.hasAttribute('disabled') && !element.hasAttribute('aria-hidden')
				) as HTMLElement[];
				// ...and focus the first one
				focusElements[0]?.focus();
			}
		} else {
			// on close...
			previouslyFocusedElement?.focus();
		}
	}

	// -- Trap Focus & Close with Escape --
	const handleKeyDown = (event: KeyboardEvent) => {
		if (!isOpen) return;

		if (event.key === 'Escape') {
			// Close on Escape
			event.preventDefault();
			isOpen = false;
		} else if (event.key === 'Tab') {
			if (focusElements.length === 0) {
				// if no elements to focus in modal, ignore tab
				event.preventDefault();
			} else if (
				!event.shiftKey &&
				document.activeElement === focusElements[focusElements.length - 1]
			) {
				// if about to go past last element, circle back
				event.preventDefault();
				focusElements[0].focus();
			} else if (event.shiftKey && document.activeElement === focusElements[0]) {
				// if about to go before first element, circle back
				event.preventDefault();
				focusElements[focusElements.length - 1].focus();
			}
		}
	};

	// Handle Copy/Paste Functionality
	let copied: 'pending' | 'success' | 'failure' = 'pending';
	$: {
		// any time isOpen switches to false, clear the copied state
		if (!isOpen) {
			copied = 'pending';
		}
	}

	const copy = (string: string) => {
		navigator.clipboard
			.writeText(string)
			.then(() => {
				copied = 'success';
			})
			.catch((e) => {
				console.error(e);
				copied = 'failure';
			});
	};
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if isOpen}
	<div class="modal-container">
		<button
			on:click={() => (isOpen = false)}
			class="overlay"
			in:fade={{ easing: cubicOut, duration: 400 }}
			out:fade={{ easing: cubicIn, duration: 300 }}
		/>
		<div
			class="modal"
			in:fly={{ y: -100, easing: cubicOut, duration: 400 }}
			out:fly={{ y: -100, easing: cubicIn, duration: 300 }}
			bind:this={modalElement}
			aria-modal="true"
		>
			<header>
				<h2 class="h4">E-Mail</h2>
				<Boopable let:boopage>
					<button
						class="close-button"
						on:click={() => (isOpen = false)}
						style="--boopage:{boopage};">&times;</button
					>
				</Boopable>
			</header>
			<p>
				<Boopable let:boopage>
					<button class="copy-button" on:click={() => copy('de.cepulis@gmail.com')}>
						<span class="boop-span" style="--boopage:{boopage};">
							de.cepulis@gmail.com
							<br />
							<small
								>{copied === 'pending'
									? 'Click to Copy'
									: copied === 'success'
									? 'Copied!'
									: copied === 'failure'
									? 'Failed to Copy.'
									: ''}
							</small>
						</span>
					</button>
				</Boopable>
			</p>
			<ul>
				<li>
					<a href="https://mail.google.com/mail/u/0/?view=cm&source=mailto&to=de.cepulis@gmail.com">
						Open in Gmail
					</a>
				</li>
				<li>
					<a href="https://outlook.live.com/owa/?path=/mail/action/compose&to=de.cepulis@gmail.com">
						Open in Outlook
					</a>
				</li>
				<li>
					<a href="mailto:de.cepulis@gmail.com">Open in Default</a>
				</li>
			</ul>
		</div>
	</div>
{/if}

<style>
	.modal-container {
		position: fixed;
		z-index: 10000;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		transition: background-color var(--transition-speed-medium),
			color var(--transition-speed-medium);

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.overlay {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
		background-color: rgba(var(--bg), 0.95);
		backdrop-filter: blur(10px);
	}
	@supports (backdrop-filter: blur(10px)) {
		.overlay {
			background-color: rgba(var(--bg), 0.8);
			backdrop-filter: blur(10px);
		}
	}
	.modal {
		position: relative;
		background-color: rgba(var(--bg), 1);
		border-radius: 1rem;
		padding: 1.5rem;
		border: var(--border-width) solid rgb(var(--c5));
		width: 300px;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	.h4 {
		margin: 0;
	}
	button {
		-webkit-appearance: none;
		appearance: none;
		border: none;
		margin: 0;
		padding: 0;
		text-decoration: none;
		background: none;

		text-align: center;
		font: inherit;
		color: inherit;

		cursor: pointer;
	}
	button:active {
		color: inherit;
	}
	.close-button {
		font-size: 2em;
		line-height: 1;
		transform: rotate(calc(var(--boopage) * 15deg));
		will-change: transform;
	}
	.copy-button {
		display: block;
		width: 100%;

		background-color: rgba(var(--c4), 0.5);
		border-radius: 1rem;
		padding: 0.5rem;

		transition: background-color var(--transition-speed-short),
			box-shadow var(--transition-speed-short);
	}
	.copy-button:hover {
		box-shadow: 0 0 0 calc(2 * var(--border-width)) rgb(var(--c5)),
			0 0 0 calc(4 * var(--border-width)) rgb(var(--c3));
	}
	.copy-button .boop-span {
		display: block;

		transform: scale(calc(1 - 0.025 * var(--boopage)));
		will-change: transform;
	}
	ul {
		list-style-type: none;
		text-align: center;
		margin: 0;
		padding: 0;
	}
	li {
		margin: 0;
		padding: 0;
	}
</style>
