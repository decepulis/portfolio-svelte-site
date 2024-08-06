<script lang="ts">
	import H1 from '$lib/components/typography/H1.svelte';
	import Section from '$lib/components/typography/Section.svelte';
</script>

<!-- todo: these buttons have animation potential... -->
<Section id="contact">
	<H1 as="h2">Where to find me and how to reach me</H1>
	{@html '<!-- totally grabbed this idea from our awesome designers at Mux -->'}
	<ul role="list" class="grid auto-rows-fr gap-4">
		<li class="col-span-2 row-span-2">
			<a
				href="mailto:darius@cepulis.net"
				class="bg-gainsboro hover:bg-silver focus:bg-silver block flex h-full w-full items-center justify-center p-8 text-center font-sans text-lg"
				style:border-color="silver gray gray silver"
				style:border-width="0.1em"
			>
				email
			</a>
		</li>
		<li class="row-span-2">
			<a
				href="https://www.linkedin.com/in/decepulis/"
				class="bg-gainsboro hover:bg-silver focus:bg-silver block flex h-full w-full items-center justify-center p-8 text-center font-sans text-lg"
				style:border-color="silver gray gray silver"
				style:border-width="0.1em"
			>
				linkedin
			</a>
		</li>
		<li class="row-span-2">
			<a
				href="https://github.com/decepulis"
				class="bg-gainsboro hover:bg-silver focus:bg-silver block flex h-full w-full items-center justify-center p-8 text-center font-sans text-lg"
				style:border-color="silver gray gray silver"
				style:border-width="0.1em"
			>
				github
			</a>
		</li>
		<li>
			<a
				href="https://www.instagram.com/darius_cepulis/"
				class="bg-gainsboro hover:bg-silver focus:bg-silver block flex h-full w-full items-center justify-center p-8 text-center font-sans text-lg"
				style:border-color="silver gray gray silver"
				style:border-width="0.1em"
			>
				insta
			</a>
		</li>
		<li>
			<a
				href="https://x.com/darius_cepulis"
				class="bg-gainsboro hover:bg-silver focus:bg-silver block flex h-full w-full items-center justify-center p-8 text-center font-sans text-lg"
				style:border-color="silver gray gray silver"
				style:border-width="0.1em"
			>
				twitter
			</a>
		</li>
	</ul>
</Section>
