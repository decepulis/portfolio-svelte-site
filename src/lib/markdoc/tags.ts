import type { Schema } from '@markdoc/markdoc';

export const grid: Schema = {
	render: 'Grid',
	attributes: {}
};

export const color: Schema = {
	render: 'Color',
	attributes: {
		color: {
			type: String,
			required: true
		}
	}
};

export const video: Schema = {
	render: 'Video',
	attributes: {
		playbackId: {
			type: String,
			required: true,
			errorLevel: 'critical'
		},
		title: {
			type: String,
			required: true,
			errorLevel: 'warning'
		},
		width: {
			type: Number,
			required: true
		},
		height: {
			type: Number,
			required: true
		},
		caption: {
			type: String,
			required: false
		},
		muted: {
			type: Boolean,
			required: false
		},
		autoplay: {
			type: Boolean,
			required: false
		},
		loop: {
			type: Boolean,
			required: false
		}
	}
};
