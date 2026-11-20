import type { Component, Snippet } from 'svelte';

import ScaffoldSkin from '$lib/videojs/scaffold/ScaffoldSkin.svelte';
import HyperlinkSkin from '$lib/videojs/skins/hyperlink/Skin.svelte';
import NetscapeSkin from '$lib/videojs/skins/netscape/Skin.svelte';
import TableSkin from '$lib/videojs/skins/table/Skin.svelte';
import TabsSkin from '$lib/videojs/skins/tabs/Skin.svelte';

export type LabSkin = {
	title: string;
	description: string;
	Skin: Component<{ children?: Snippet; class?: string }>;
};

export const skins = {
	scaffold: {
		title: 'Scaffold (baseline)',
		description: 'The Video.js scaffold skin, ported to Tailwind. Every direction forks this.',
		Skin: ScaffoldSkin
	},
	tabs: {
		title: '1. The Tabs sibling',
		description:
			'A cousin of the homepage tabs: flat gainsboro buttons with silver borders, the open-bottom active border, and a settings menu that slides between panels like tab panels.',
		Skin: TabsSkin
	},
	netscape: {
		title: '2. Netscape progress bar',
		description:
			'Plain controls; the flourish is the timeline. Chunky block fill, dithered buffer, table-cell chapters, a framed thumbnail with a Times caption, and a stepped throbber.',
		Skin: NetscapeSkin
	},
	hyperlink: {
		title: '3. Hyperlink controls',
		description:
			'Controls are text links: [Play] [Mute] [CC] in link blue, time in Courier, watched chapters in visited purple, and an underline that grows with playback.',
		Skin: HyperlinkSkin
	},
	table: {
		title: '4. HTML 3.2 table layout',
		description:
			'The control bar as a bordered table with cellpadding, menus as select and fieldset/legend, and feedback indicators that stamp in like banners.',
		Skin: TableSkin
	}
} satisfies Record<string, LabSkin>;

export type SkinSlug = keyof typeof skins;
