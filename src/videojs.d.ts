import type { HTMLAttributes, HTMLVideoAttributes } from 'svelte/elements';

import type { MuxDataExtension } from '@videojs/html/extensions/mux-data';
import type { MuxSource } from '@videojs/html/media/mux-video';
import type { NeutralVideoSkinElement, VideoPlayerElement } from '@videojs/html/video';

// Video.js custom elements used in markup. Object-valued options (`source`, `metadata`) are set
// as properties, so they're typed from the element classes rather than as attributes.
declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'video-player': HTMLAttributes<VideoPlayerElement> & {
			'content-title'?: string | null;
		};
		'video-neutral-skin': HTMLAttributes<NeutralVideoSkinElement>;
		'mux-video': HTMLVideoAttributes & {
			source?: MuxSource;
		};
		'mux-data': HTMLAttributes<MuxDataExtension> & {
			'env-key'?: string | null;
			metadata?: MuxDataExtension['metadata'];
			debug?: boolean | null;
		};
	}
}

export {};
