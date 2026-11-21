import { H, W, edge, rect, text } from './pixel';

// Every color here is from the 216-color web-safe palette.

export type Draw = (ctx: CanvasRenderingContext2D, frame: number, value: number | null) => void;

export type BadgeSpec = {
	id: string;
	label: string;
	href?: string;
	/** the animated badge, called once per frame */
	draw: Draw;
	/** a still "lit" version shown on hover, like an old onMouseOver image swap */
	lit?: (ctx: CanvasRenderingContext2D) => void;
	/** what the status bar says while this badge is hovered */
	status?: string;
};

const BUTTERFLY_UP = [
	'XX.....XX',
	'XXX...XXX',
	'XXXX.XXXX',
	'.XXXXXXX.',
	'..XX.XX..',
	'.XXX.XXX.',
	'.XX...XX.'
];
const BUTTERFLY_DOWN = [
	'.........',
	'.X.....X.',
	'.XXX.XXX.',
	'..XXXXX..',
	'..XX.XX..',
	'..XX.XX..',
	'.........'
];

/** Draw a tiny bitmap where 'X' is a filled pixel. */
function sprite(
	ctx: CanvasRenderingContext2D,
	rows: string[],
	x: number,
	y: number,
	color: string
) {
	rows.forEach((row, dy) =>
		[...row].forEach((c, dx) => c === 'X' && rect(ctx, color, x + dx, y + dy, 1, 1))
	);
}

const RAINBOW = ['#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#3399FF', '#FF00FF'];

const email: BadgeSpec = {
	id: 'email',
	label: 'Email me at darius@cepulis.net',
	href: 'mailto:darius@cepulis.net',
	draw(ctx, f) {
		rect(ctx, '#000099', 0, 0, W, H);
		// envelope
		rect(ctx, '#FFFFFF', 5, 8, 22, 15);
		for (let i = 0; i < 11; i++) {
			const y = 8 + Math.floor(i * 0.7);
			rect(ctx, '#000000', 5 + i, y, 1, 1);
			rect(ctx, '#000000', 26 - i, y, 1, 1);
		}
		// "you've got mail" flag
		if (f % 4 < 2) {
			rect(ctx, '#FF0000', 22, 4, 7, 7);
			rect(ctx, '#FFFFFF', 25, 5, 1, 3);
			rect(ctx, '#FFFFFF', 25, 9, 1, 1);
		}
		text(ctx, 'MAIL', 33, 14, '#FFFF00');
		text(ctx, 'ME!', 33, 25, f % 2 ? '#00FFFF' : '#FFFFFF');
		edge(ctx);
	},
	lit(ctx) {
		rect(ctx, '#FFFF00', 0, 0, W, H);
		// an open envelope with the letter sliding out
		rect(ctx, '#000000', 8, 3, 16, 13);
		rect(ctx, '#FFFFFF', 9, 4, 14, 12);
		for (const y of [6, 8, 10]) rect(ctx, '#999999', 11, y, 10, 1);
		rect(ctx, '#000000', 5, 13, 22, 13);
		rect(ctx, '#FFFFFF', 6, 14, 20, 11);
		for (let i = 0; i < 10; i++) {
			const y = 14 + Math.floor(i * 0.5);
			rect(ctx, '#000000', 6 + i, y, 1, 1);
			rect(ctx, '#000000', 25 - i, y, 1, 1);
		}
		text(ctx, 'SEND', 33, 14, '#000099');
		text(ctx, 'MAIL!', 33, 25, '#000099');
		edge(ctx, '#FFFFFF', '#999900');
	},
	status: 'Write to me at darius@cepulis.net'
};

const github: BadgeSpec = {
	id: 'github',
	label: 'GitHub',
	href: 'https://github.com/decepulis',
	draw(ctx, f) {
		rect(ctx, '#000000', 0, 0, W, H);
		rect(ctx, '#CCCCCC', 0, 0, 27, H);
		text(ctx, '</>', 14, 19, '#000000', { align: 'center' });
		text(ctx, 'GITHUB', 31, 13, '#00FF00');
		// a scrolling ticker of the username
		ctx.save();
		ctx.beginPath();
		ctx.rect(28, 15, 59, 14);
		ctx.clip();
		const scroll = 31 - ((f * 2) % 72);
		text(ctx, 'decepulis', scroll, 25, '#999999');
		text(ctx, 'decepulis', scroll + 72, 25, '#999999');
		ctx.restore();
		edge(ctx, '#FFFFFF', '#666666');
	},
	lit(ctx) {
		rect(ctx, '#00FF00', 0, 0, W, H);
		rect(ctx, '#000000', 0, 0, 27, H);
		text(ctx, '</>', 14, 19, '#00FF00', { align: 'center' });
		text(ctx, 'READ MY', 31, 14, '#000000');
		text(ctx, 'CODE >', 31, 25, '#000000');
		edge(ctx, '#FFFFFF', '#006600');
	},
	status: 'Read my code at github.com/decepulis'
};

const linkedin: BadgeSpec = {
	id: 'linkedin',
	label: 'LinkedIn',
	href: 'https://www.linkedin.com/in/decepulis/',
	draw(ctx, f) {
		rect(ctx, '#FFFFFF', 0, 0, W, H);
		rect(ctx, '#0066CC', 2, 2, 27, 27);
		text(ctx, 'in', 15, 21, '#FFFFFF', { size: 16, align: 'center' });
		text(ctx, 'HIRE', 34, 14, '#000000');
		text(ctx, f % 6 < 3 ? 'ME?' : 'ME!', 34, 25, '#0066CC');
		edge(ctx, '#CCCCCC', '#000000');
	},
	lit(ctx) {
		rect(ctx, '#0066CC', 0, 0, W, H);
		rect(ctx, '#FFFFFF', 2, 2, 27, 27);
		text(ctx, 'in', 15, 21, '#0066CC', { size: 16, align: 'center' });
		text(ctx, 'HIRE', 34, 14, '#FFFFFF');
		text(ctx, 'ME!', 34, 25, '#FFFF00');
		edge(ctx, '#99CCFF', '#000066');
	},
	status: "See where I've worked at linkedin.com/in/decepulis"
};

const bluesky: BadgeSpec = {
	id: 'bluesky',
	label: 'Bluesky',
	href: 'https://bsky.app/profile/darius.place',
	draw(ctx, f) {
		const sky = ['#0066FF', '#0066FF', '#3399FF', '#3399FF', '#66CCFF', '#99FFFF'];
		sky.forEach((c, i) =>
			rect(ctx, c, 0, Math.round((i * H) / sky.length), W, Math.ceil(H / sky.length))
		);
		// a drifting cloud
		const cx = W - (f % (W + 20));
		rect(ctx, '#FFFFFF', cx, 21, 14, 4);
		rect(ctx, '#FFFFFF', cx + 3, 18, 7, 3);
		text(ctx, 'BLUE', 6, 14, '#FFFFFF');
		text(ctx, 'SKY', 6, 25, '#000066');
		// butterfly, flapping
		sprite(ctx, f % 2 ? BUTTERFLY_UP : BUTTERFLY_DOWN, 64, 8, '#000066');
		edge(ctx);
	},
	lit(ctx) {
		rect(ctx, '#000066', 0, 0, W, H);
		text(ctx, 'FOLLOW', 6, 14, '#FFFFFF');
		text(ctx, 'ME >', 6, 25, '#99FFFF');
		sprite(ctx, BUTTERFLY_UP, 64, 12, '#99FFFF');
		edge(ctx, '#3399FF', '#000000');
	},
	status: 'Follow me on Bluesky at @darius.place'
};

const instagram: BadgeSpec = {
	id: 'instagram',
	label: 'Instagram',
	href: 'https://www.instagram.com/darius_cepulis/',
	draw(ctx, f) {
		rect(ctx, '#000000', 0, 0, W, H);
		'PHOTOS'.split('').forEach((ch, i) => {
			const bounce = (f + i) % 4 < 2 ? 0 : -2;
			text(ctx, ch, 10 + i * 12, 20 + bounce, RAINBOW[(i + f) % RAINBOW.length]);
		});
		edge(ctx, '#999999', '#333333');
	},
	lit(ctx) {
		// the rainbow moves out of the letters and into the background
		const band = Math.ceil(W / RAINBOW.length);
		RAINBOW.forEach((c, i) => rect(ctx, c, i * band, 0, band, H));
		'PHOTOS'.split('').forEach((ch, i) => text(ctx, ch, 10 + i * 12, 20, '#000000'));
		edge(ctx, '#FFFFFF', '#000000');
	},
	status: 'See my photos at instagram.com/darius_cepulis'
};

const xDotCom: BadgeSpec = {
	id: 'x',
	label: 'X',
	href: 'https://x.com/darius_cepulis',
	draw(ctx, f) {
		rect(ctx, '#CCCCCC', 0, 0, W, H);
		text(ctx, 'X.COM', W / 2, 14, '#000000', { align: 'center' });
		text(ctx, f % 8 < 4 ? 'FOLLOW' : 'ME!', W / 2, 25, '#990000', { align: 'center' });
		edge(ctx);
	},
	lit(ctx) {
		rect(ctx, '#000000', 0, 0, W, H);
		text(ctx, 'X.COM', W / 2, 14, '#FFFFFF', { align: 'center' });
		text(ctx, 'FOLLOW ME', W / 2, 25, '#FF3333', { align: 'center' });
		edge(ctx, '#666666', '#333333');
	},
	status: 'Find me on X at @darius_cepulis'
};

/**
 * An odometer. `value` is a float that tweens toward the real count;
 * each wheel turns only while the wheels to its right roll over, like a real one.
 */
const DIGITS = 6;
const counter: BadgeSpec = {
	id: 'counter',
	label: 'Visitor counter',
	draw(ctx, _f, value) {
		rect(ctx, '#333333', 0, 0, W, H);
		text(ctx, 'VISITORS', W / 2, 10, '#FFFFFF', { align: 'center' });
		const cellW = 11;
		const cellH = 14;
		const x0 = (W - DIGITS * (cellW + 1) + 1) / 2;
		const y0 = 13;
		for (let i = 0; i < DIGITS; i++) {
			const cx = Math.round(x0 + i * (cellW + 1));
			rect(ctx, '#000000', cx, y0, cellW, cellH);
			ctx.save();
			ctx.beginPath();
			ctx.rect(cx, y0, cellW, cellH);
			ctx.clip();
			if (value === null) {
				text(ctx, '-', cx + cellW / 2, y0 + 10, '#006600', { align: 'center' });
			} else {
				const place = 10 ** (DIGITS - 1 - i);
				const base = Math.floor(value / place) % 10;
				const below = value % place;
				// only roll once everything to the right is about to wrap
				const roll = place === 1 ? value % 1 : Math.max(0, below - (place - 1));
				const dy = Math.round(roll * cellH);
				text(ctx, String(base), cx + cellW / 2, y0 + 10 - dy, '#00FF00', { align: 'center' });
				text(ctx, String((base + 1) % 10), cx + cellW / 2, y0 + 10 - dy + cellH, '#00FF00', {
					align: 'center'
				});
			}
			ctx.restore();
		}
		edge(ctx, '#666666', '#000000');
	}
};

const browser: BadgeSpec = {
	id: 'browser',
	label: 'Best viewed in any browser',
	draw(ctx, f) {
		rect(ctx, '#FFFF00', 0, 0, W, H);
		text(ctx, 'BEST VIEWED', W / 2, 13, '#000000', { align: 'center' });
		text(ctx, 'ANY BROWSER', W / 2, 24, f % 4 < 2 ? '#FF0000' : '#0000FF', { align: 'center' });
		edge(ctx, '#FFFFFF', '#999900');
	},
	status: 'Any browser. Seriously, any of them.'
};

export const links = [email, github, linkedin, bluesky, instagram, xDotCom];
export const extras = { counter, browser };
