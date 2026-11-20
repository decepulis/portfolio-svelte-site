<script lang="ts">
	import { resolve } from '$app/paths';

	import { skins } from './skins';
</script>

<h1 class="text-4xl">Video skin lab</h1>
<ul class="list-disc pl-6">
	{#each Object.entries(skins) as [skin, { title }] (skin)}
		<li>
			<a
				href={resolve('/lab/video-skins/[skin]', { skin })}
				class="text-link visited:text-visited underline">{title}</a
			>
		</li>
	{/each}
</ul>
