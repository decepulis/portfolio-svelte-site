<script lang="ts">
	import ProjectLinkList from './ProjectLinkList.svelte';
	import ProjectTechList from './ProjectTechList.svelte';
	import ProjectTechItem from './ProjectTechItem.svelte';
	import ProjectLinkItem from './ProjectLinkItem.svelte';

	import { isProjectWithImage, isProjectWithStaticVideo } from './types';
	import type { Project } from './types';

	export let project: Project;
</script>

<article>
	{#if isProjectWithImage(project)}
		<img
			loading="lazy"
			alt={project.alt}
			width={project.width}
			height={project.height}
			srcset="
			{project.imageSite}/f_auto,w_413,c_scale/{project.imagePath},
			{project.imageSite}/f_auto,w_826,c_scale/{project.imagePath} 2x,
			{project.imageSite}/f_auto,w_1239,c_scale/{project.imagePath} 3x
		"
			src="{project.imageSite}/{project.imagePath}"
		/>
	{:else if isProjectWithStaticVideo(project)}
		<video alt={project.alt} width={project.width} height={project.height} autoplay loop muted />
	{/if}
	<div class="content">
		<h4>{project.header}</h4>

		{#if project.technologies.length > 0}
			<ProjectTechList>
				{#each project.technologies as { name, details }}
					<ProjectTechItem {name} {details} />
				{/each}
			</ProjectTechList>
		{/if}

		<p>
			{@html project.summary}
		</p>

		{#if typeof project.links !== 'undefined' && project.links.length > 0}
			<ProjectLinkList>
				{#each project.links as { type, href }}
					<ProjectLinkItem iconType={type} {href} />
				{/each}
			</ProjectLinkList>
		{/if}
	</div>
</article>

<style>
	/* Up first, you should know this is all run by a grid */
	article {
		position: relative;

		display: grid;
		padding: var(--main-padding) var(--main-padding) calc(2 * var(--main-padding))
			var(--main-padding);
		gap: var(--main-padding);
		align-content: center;
		align-items: center;
		justify-content: start;
	}
	@media (min-width: 42rem) {
		article {
			grid-template-columns: auto auto;
			--x-padding: 0;
		}
	}

	/* Each child gives up some margins and lets the grid manage that all */
	.content > :global(:first-child) {
		margin-top: 0;
	}
	.content {
		max-width: var(--content-width);
		position: relative;
	}

	/* Of course, each child has its own appearance */
	img {
		max-width: calc(var(--container-width) - var(--content-width));
		width: 100%;
		height: auto;
		border-radius: 1rem;
		justify-self: center;
	}

	/* Behind the content is a blob that provides contrast with the text */
	article:before {
		content: '';

		position: absolute;
		top: calc(4 * var(--main-padding));
		right: 0;
		bottom: var(--main-padding);
		left: 0;

		background-color: rgba(var(--bg), var(--intensity-bg-c));
		transition: background-color var(--transition-speed-medium);
		border-radius: 1rem;
		z-index: -1;
	}
	@media (min-width: 42rem) {
		article {
			padding: calc(2 * var(--main-padding)) var(--main-padding);
			padding-left: 0;
		}
		article:before {
			top: var(--main-padding);
			right: 0;
			bottom: var(--main-padding);
			left: calc(3 * var(--main-padding));
		}
	}
	/* Behind the article is a stripe of color */
	article:after {
		content: '';
		position: absolute;
		width: 100vw;
		top: 0;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
		height: 100%;
		z-index: -2;
		transition: background-color var(--transition-speed-medium);
	}

	article:nth-of-type(1):after {
		--project-bg: var(--c3);
	}
	:global(body.alt) article:nth-of-type(1):after {
		--project-bg: var(--c1);
	}
	article:nth-of-type(2):after {
		--project-bg: var(--c5);
	}
	article:nth-of-type(3):after {
		--project-bg: var(--c4);
	}
	article:after {
		background-color: rgba(var(--project-bg), var(--intensity-c));
	}
</style>
