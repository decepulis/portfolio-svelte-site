<script lang="ts">
	import FeaturedProject from './FeaturedProject.svelte';
	import OtherProjectBox from './OtherProjectBox.svelte';
	import OtherProject from './OtherProject.svelte';

	import type { Project } from './types';
	const imageSite = 'https://res.cloudinary.com/decepulis/image/upload';

	const featuredProjects: Project[] = [
		{
			header: 'Mux Marketing Site',
			summary:
				'Collaborating with the best team in the world to push our <a href="https://www.mux.com/player">marketing</a> <a href="https://www.mux.com/real-time-video">pages</a> further. Making sure it\'s speedy, maintainable, search-engine friendly, and just nice to use. Frequently interjecting things like "what do you think of this bezier curve?" and "does it have to be an image? We could make it an interactive element".<br/><br/>I am so stinkin\' proud of our <a href="https://www.mux.com/blog/rebranding-during-a-recession">recent rebrand</a>.',
			technologies: [
				{ name: 'Next.js', details: 'RSC, ISR, TypeScript' },
				{ name: 'Tailwind CSS' },
				{ name: 'Sanity' },
				{ name: 'Mux Video' },
				{ name: 'Framer Motion' }
			],
			imageSite,
			imagePath: 'v1634046941/decepulis/muxcom_ygcvek.png',
			alt: 'The hero of the Mux home page. An interactive element cycling through the three Mux product categories: video, player, data.',
			width: 3456,
			height: 2160,
			links: [{ type: 'external', href: 'https://www.mux.com/' }]
		},
		{
			header: 'Mux Documentation Site',
			summary:
				'Developers frequently tell us that our docs are the best part of Mux. Recently overhauled to support a redesign and information re-architecture, as well as push performance with React Server Components. I wrote a <a href="https://www.mux.com/blog/the-building-blocks-of-great-docs">blog post</a> about that, by the way!',
			technologies: [
				{ name: 'Next.js', details: 'ISR, TypeScript' },
				{ name: 'Tailwind CSS' },
				{ name: 'Algolia' },
				{ name: 'MDX' },
				{ name: 'Mux Video' }
			],
			imageSite,
			imagePath: 'v1634046941/decepulis/docs_y5gnkh.png',
			alt: 'The Mux Documentation site. An easy to use navigation bar, a search bar, and information delivered both in video and in text.',
			width: 3456,
			height: 2160,
			links: [{ type: 'external', href: 'https://docs.mux.com/' }]
		},
		{
			header: 'Sanibit Web Platform',
			summary:
				'A full-stack application, written bottom-to-top, that analyzes millions of data points to help healthcare providers improve their hygiene and reduce hospital-acquired infections. The app provides easy-to-use and comprehensive data visualizations to managers and supervisors so that they can discover trends and take action. At the same time, it gamifies hygiene for individual providers with friendly competition, engaging interactions and animations, and a rewards system.',
			technologies: [
				{ name: 'React', details: 'TypeScript, Router, Context, Spring, Recharts' },
				{ name: 'Django', details: 'Rest Framework, Channels 2, PostgreSQL, JWT Auth' },
				{ name: 'AWS', details: 'EC2, RDS, CLB, S3, ElastiCache, Cloudfront, Route53' },
				{ name: 'Redis' },
				{ name: 'GitHub Actions' }
			],
			imageSite,
			imagePath: 'v1634046941/decepulis/sanibit_r7qkjq.png',
			alt: 'The Sanibit Dashboard, feturing a line graph of hand hygine compliance over time',
			width: 3010,
			height: 2100,
			links: [{ type: 'info', href: 'https://www.microsensorlabs.com/sanibit' }]
		}
	];

	const otherProjects: Project[] = [
		{
			header: 'The Mux Informational',
			summary:
				'Worked with our top-notch designers on an alarmingly short notice to really go all-in on this incredible vibe. Used the most modern of responsive css, from grid auto-fit to clamp. The best part? They trusted me to make those neat animations.',
			technologies: [
				{ name: 'Next.js', details: 'ISR, TypeScript' },
				{ name: 'styled-jsx' },
				{ name: 'Sanity' },
				{ name: 'Mux Video' },
				{ name: 'Framer Motion' }
			],
			imageSite,
			imagePath: 'v1634046941/decepulis/tmi_ozu9ym.png',
			alt: 'A classic Macintosh with some classic 80s typography, proudly introducing The Mux Informational',
			width: 3456,
			height: 2160,
			links: [{ type: 'external', href: 'https://tmi.mux.com' }]
		},
		{
			header: '@mux/blurhash',
			summary: `Built alongside <a href="https://github.com/muxinc/elements">@mux/mux-player-react/lazy</a> to give Mux Player a snappy loading experience, particularly in SSR environments like Next.js and SvelteKit. I've got a <a href="https://www.mux.com/blog/mux-player-lazy-loading-with-blurhash">blog post</a> about that one, too!`,
			technologies: [{ name: 'Web Components' }, { name: 'OSS' }, { name: 'node' }],
			videoPath: 'video/mux-blurhash.mp4',
			width: 720,
			height: 480,
			alt: 'While a video player loads, a nice blur effect with a spinner displays',
			links: [{ type: 'github', href: 'https://github.com/muxinc/blurhash' }]
		},
		{
			header: 'Midwest Microbio Site',
			summary: `A minimal marketing website designed and built for a buddy's budding beer business. Interactive visualizations make visits to the site informative and memorable. Prismic CMS allows easy changes to commonly-updated areas of the site. Formerly Pug, Parcel, and Bootstrap.`,
			technologies: [
				{ name: 'Svelte', details: 'SvelteKit, TypeScript, Pancake, Spring, Stores' },
				{ name: 'Tailwind' },
				{ name: 'Prismic' },
				{ name: 'd3-force' }
			],
			imageSite,
			imagePath: 'v1634046940/decepulis/midwest-microbio_jfrmkn.png',
			alt: `The Midwest Microbio home page`,
			width: 2880,
			height: 1800,
			links: [{ type: 'external', href: 'https://www.midwestmicrobio.com/' }]
		},
		{
			header: 'Microsensor Labs Site',
			summary: `A marketing website providing not only information regarding Microsensor Labs' projects, but also a lightweight <a href="https://jamstack.wtf" target="_blank">JAMStack</a> blog and jobs listing built on Netlify and Gatsby.`,
			technologies: [{ name: 'React', details: 'Gatsby' }, { name: 'Netlify CMS' }],
			imageSite,
			imagePath: 'v1634046943/decepulis/microsensor_cjc2mn.png',
			alt: 'The Microsensor Labs home page',
			width: 3360,
			height: 2100,
			links: [{ type: 'external', href: 'https://www.microsensorlabs.com/' }]
		},
		{
			header: 'Our Famliy Website',
			summary: `A place for me to put our slideshows so I wouldn't have to bore people in person! Also, a sneaky opportunity to finally write a tribute to the legendary <a href="http://www.firewatchgame.com" target="_blank">Firewatch parallax effect</a>.`,
			technologies: [
				{ name: 'Svelte', details: 'Sapper, SvelteKit, Spring, Stores' },
				{ name: 'Mux Video' },
				{ name: 'Sanity' }
			],
			imageSite,
			imagePath: 'v1634046941/decepulis/kcdc_ouq1g7.png',
			alt: 'The home page of the website; a sunset with a city skyline in front of it.',
			width: 3360,
			height: 2100,
			links: [
				{ type: 'external', href: 'https://www.kcdc.fun/' },
				{ type: 'github', href: 'https://github.com/decepulis/kcdc.fun' }
			]
		},
		{
			header: 'Serverless Weasley Clock',
			summary: `I've been wanting to build a <a href="https://harrypotter.fandom.com/wiki/Weasley_Clock" target="_blank">Weasley Clock</a> for a long time. Some cell phone location data and a Raspberry Pi, and you've got something that seems like magic.`,
			technologies: [
				{ name: 'Svelte', details: 'TypeScript' },
				{ name: 'Netlify Functions' },
				{ name: 'FaunaDB' }
			],
			imageSite,
			imagePath: 'v1634046940/decepulis/weasley-clock_ogq7wf.png',
			alt: `A clock, except instead of hours around the edges, locations like 'Home' and 'Away'`,
			width: 3360,
			height: 2100,
			links: [{ type: 'github', href: 'https://github.com/decepulis/weasley-clock' }]
		},
		{
			header: 'Bosch Sensor Analytics Platform',
			summary: `How I started in hardware and accidentally ended up a web developer. A stack of applications providing sensor data storage, real-time monitoring, and historical analysis; all with a modular API.`,
			technologies: [{ name: 'jQuery' }, { name: 'Node.js' }, { name: 'InfluxDB' }],
			imageSite,
			imagePath: 'v1634046938/decepulis/pisuite_fh0y4z.png',
			alt: 'The Sensor Analytics Platform home page, featuring a complex query below and a line graph of its result above',
			width: 1189,
			height: 719
		},
		{
			header: 'Formula Fun!',
			summary: `Some friends started up a betting pool for the 2021 season of Formula One. "Buy" four drivers and win points based on how they do. I wondered if I could beat the game with a neat app&hellip;`,
			technologies: [{ name: 'Svelte', details: 'TypeScript, Stores' }],
			imageSite,
			imagePath: 'v1634046940/decepulis/formula_fun_wjpgww.png',
			alt: `A website featuring a large table of statistics`,
			width: 3360,
			height: 2100,
			links: [
				{ type: 'external', href: 'https://formula-fun.netlify.app/' },
				{ type: 'github', href: 'https://github.com/decepulis/formula-fun' }
			]
		}
	];
</script>

<section id="projects" class="container">
	<h2>Some Things I've Worked On</h2>
	<section>
		{#each featuredProjects as project}
			<FeaturedProject {project} />
		{/each}
	</section>
	<section class="other-project-section">
		<h3>Other Noteworthy Stuff</h3>
		{#each otherProjects as project}
			<OtherProject {project} />
		{/each}
		<OtherProjectBox noBorder>
			<svelte:fragment slot="header">
				<h4>More</h4>
			</svelte:fragment>
			<p>
				See so much more, including my graveyard of half-finished projects, on
				<a href="https://github.com/decepulis?tab=repositories">GitHub</a>.
			</p>
		</OtherProjectBox>
	</section>
</section>

<style>
	.other-project-section h3 {
		margin-top: 0;
		padding: 0 1rem;
	}
	.other-project-section {
		margin-top: var(--section-padding);

		display: grid;
		gap: var(--main-padding);
		--card-width: calc(var(--container-width) / 3);
	}
	@media (min-width: 42rem) {
		.other-project-section {
			grid-template-columns: 1fr 1fr;
			gap: var(--main-padding);
		}
		.other-project-section h3 {
			padding: var(--section-padding);
		}
	}
</style>
