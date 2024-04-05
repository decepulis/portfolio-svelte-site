<script lang="ts">
	import { slide } from 'svelte/transition';

	type Length = 'short' | 'medium' | 'long';

	export let defaultLength: Length = 'medium';
	let length: Length = defaultLength;
</script>

<form>
	<fieldset class={length}>
		<div class="sml-option">
			<input type="radio" bind:group={length} id="sml-short" value="short" />
			<label for="sml-short">Short</label>
		</div>
		<div class="sml-option">
			<input type="radio" bind:group={length} id="sml-medium" value="medium" />
			<label for="sml-medium">Medium</label>
		</div>
		<div class="sml-option">
			<input type="radio" bind:group={length} id="sml-long" value="long" />
			<label for="sml-long">Long</label>
		</div>
	</fieldset>
</form>

{#key length}
	<div class="sml-content" transition:slide>
		{#if length === 'short'}
			<slot name="short" />
		{:else if length === 'medium'}
			<slot name="medium" />
		{:else}
			<slot name="long" />
		{/if}
	</div>
{/key}

<style>
	form {
		margin-bottom: 1rem;
		--height: calc(2 * var(--border-width));
	}
	fieldset {
		padding: 0;
		border: 0;

		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		align-items: stretch;
		justify-items: stretch;

		position: relative;
	}
	fieldset:before {
		/* track */
		content: '';
		position: absolute;
		height: var(--height);
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: rgb(var(--c1));
		transition: background-color var(--transition-speed-medium);
	}
	fieldset:after {
		/* highlight */
		content: '';
		position: absolute;
		height: var(--height);
		left: 0;
		bottom: 0;
		width: calc(100% / 3);
		background-color: rgb(var(--c2));
		transition: transform 0.4s, background-color var(--transition-speed-medium);
	}
	fieldset.short:after {
		transform: translateX(0%);
	}
	fieldset.medium:after {
		transform: translateX(100%);
	}
	fieldset.long:after {
		transform: translateX(200%);
	}
	.sml-option {
		position: relative;
	}
	label {
		display: inline-block;
		width: 100%;
		text-align: center;
		cursor: pointer;
		padding-bottom: 0.5em;
		transition: box-shadow var(--transition-speed-short);
	}
	label:hover {
		box-shadow: inset 0 calc(-1 * var(--height)) rgba(var(--c2), 0.5);
	}
	[type='radio']:focus ~ label {
		outline-style: solid;
	}
	[type='radio']:focus:not(:focus-visible) ~ label {
		outline: 0;
	}
	[type='radio'] {
		border: 0;
		clip: rect(0 0 0 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
	}

	.sml-content > :global(p:first-child) {
		margin-top: 0;
	}
	.sml-content > :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
