<script lang="ts">
	import OtherProjectBox from './OtherProjectBox.svelte';
	import ProjectLinkItem from './ProjectLinkItem.svelte';
	import ProjectTechItem from './ProjectTechItem.svelte';

	import { isProjectWithImage, isProjectWithStaticVideo } from './types';
	import type { Project } from './types';

	export let project: Project;
</script>

<OtherProjectBox>
	<svelte:fragment slot="image">
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
			<video
				src={project.videoPath}
				alt={project.alt}
				width={project.width}
				height={project.height}
				autoplay
				loop
				muted
			/>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="header">
		<h4>{project.header}</h4>
	</svelte:fragment>
	<p>
		{@html project.summary}
	</p>
	<svelte:fragment slot="technologies">
		{#each project.technologies as { name, details }}
			<ProjectTechItem {name} {details} />
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="links">
		{#each project.links ?? [] as { type, href }}
			<ProjectLinkItem iconType={type} {href} />
		{/each}
	</svelte:fragment>
</OtherProjectBox>
