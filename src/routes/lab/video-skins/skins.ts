import type { Component, Snippet } from 'svelte';

import ScaffoldSkin from '$lib/videojs/scaffold/ScaffoldSkin.svelte';
import BasReliefSkin from '$lib/videojs/skins/bas-relief/Skin.svelte';
import TablePlainSkin from '$lib/videojs/skins/table-plain/Skin.svelte';
import TableTabsSkin from '$lib/videojs/skins/table-tabs/Skin.svelte';
import TableSkin from '$lib/videojs/skins/table/Skin.svelte';
import TabsTableSkin from '$lib/videojs/skins/tabs-table/Skin.svelte';
import TabsSkin from '$lib/videojs/skins/tabs/Skin.svelte';

export type LabSkin = {
	title: string;
	description: string;
	Skin: Component<{ children?: Snippet; class?: string }>;
};

/** Ordered along the gradient from the HTML 3.2 table skin to the Tabs sibling skin. */
export const skins = {
	scaffold: {
		title: 'Scaffold (baseline)',
		description: 'The Video.js scaffold skin, ported to Tailwind. Every direction forks this.',
		Skin: ScaffoldSkin
	},
	table: {
		title: 'A. HTML 3.2 table',
		description:
			'The control bar as a bevelled table with cellpadding, menus as select and fieldset/legend, and feedback indicators that stamp in like rubber stamps.',
		Skin: TableSkin
	},
	'table-plain': {
		title: 'B. Table, minus Windows',
		description:
			'The table skin with the operating system taken out: what a browser drew, not what Windows drew.',
		Skin: TablePlainSkin
	},
	'bas-relief': {
		title: 'B/C. Bas-relief',
		description:
			'Between B and C, built from period sources: HTML 3.2 bas-relief tables, sans-serif form controls, serif copy.',
		Skin: BasReliefSkin
	},
	'table-tabs': {
		title: 'C. Halfway',
		description:
			'Table structure and fieldset menus, with the flat bordered controls and sliding panels of the homepage tabs.',
		Skin: TableTabsSkin
	},
	'tabs-table': {
		title: 'D. Tabs, with table bones',
		description:
			'The Tabs sibling, borrowing just the table skin’s grid, select-style lists and a calmer stamp.',
		Skin: TabsTableSkin
	},
	tabs: {
		title: 'E. The Tabs sibling',
		description:
			'A cousin of the homepage tabs: flat gainsboro buttons with silver borders, the open-bottom active border, and a settings menu that slides between panels like tab panels.',
		Skin: TabsSkin
	}
} satisfies Record<string, LabSkin>;

export type SkinSlug = keyof typeof skins;
