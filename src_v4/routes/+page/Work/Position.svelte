<script lang="ts">
	import type { Position } from './position.d';
	export let position: Position;
</script>

<article class="position">
	<header>
		<h3 class="h5">{position.role}<br />@ {position.employer}</h3>
		<p class="location">{position.location}</p>
		<p class="duration">{position.start} &ndash; {position.end}</p>
	</header>
	<ul>
		{#each position.points as point}
			<li>{point}</li>
		{/each}
	</ul>
</article>

<style>
	.position {
		flex: 1 0 var(--card-width);
		background-color: rgba(var(--c2), var(--intensity-c));
		border-radius: 1rem;
		padding: 1rem;
		min-height: 320px;
		max-height: calc(75vh);

		display: flex;
		flex-direction: column;
		position: relative;
	}
	.position,
	header,
	ul {
		transition: background-color var(--transition-speed-medium);
	}
	header {
		padding: 1rem;
	}
	header,
	ul {
		transition: background-color var(--transition-speed-medium);
		background-color: rgba(var(--bg), var(--intensity-bg-c));
		border-radius: 0.75rem;
	}
	.location,
	.duration {
		margin-bottom: 0;
	}
	.duration {
		margin-top: 0;
	}
	.h5 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	ul {
		flex: 1;
		list-style-type: '\203A   ';
		overflow-y: scroll;
		padding: 1rem 2rem 1rem;
	}
	li {
		position: relative;
	}
	.position > *:last-child {
		margin-bottom: 0;
	}
</style>
