// Helpers for drawing 88×31 buttons on a canvas, the size of the classic web badge.
// Text is drawn with hard edges (no anti-aliasing), the way a GIF would have it.

export const W = 88;
export const H = 31;
export const FONT = 'Silkscreen';

type Align = 'left' | 'center' | 'right';

// Each distinct (text, color, size, align) is rasterized once, then stamped with drawImage.
const CACHE_W = 128;
const CACHE_H = 32;
const BASELINE = 22;
const anchorX = { left: 4, center: CACHE_W / 2, right: CACHE_W - 4 };
const cache = new Map<string, HTMLCanvasElement>();

function rasterize(text: string, color: string, size: number, align: Align) {
	const key = `${text}|${color}|${size}|${align}`;
	const hit = cache.get(key);
	if (hit) return hit;

	const canvas = document.createElement('canvas');
	canvas.width = CACHE_W;
	canvas.height = CACHE_H;
	const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
	ctx.font = `${size}px ${FONT}, monospace`;
	ctx.textAlign = align;
	ctx.textBaseline = 'alphabetic';
	ctx.fillStyle = color;
	ctx.fillText(text, anchorX[align], BASELINE);

	// snap every pixel to fully on or fully off
	const img = ctx.getImageData(0, 0, CACHE_W, CACHE_H);
	for (let i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] > 110 ? 255 : 0;
	ctx.putImageData(img, 0, 0);

	cache.set(key, canvas);
	return canvas;
}

/** Draw hard-edged text with its baseline at (x, y). */
export function text(
	ctx: CanvasRenderingContext2D,
	str: string,
	x: number,
	y: number,
	color: string,
	{ size = 8, align = 'left' }: { size?: number; align?: Align } = {}
) {
	const c = rasterize(str, color, size, align);
	ctx.drawImage(c, Math.round(x - anchorX[align]), Math.round(y - BASELINE));
}

/** Fill a rectangle; a shorthand that keeps the badge drawings compact. */
export function rect(
	ctx: CanvasRenderingContext2D,
	color: string,
	x: number,
	y: number,
	w: number,
	h: number
) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

/** The 1px raised edge most 88×31s had. */
export function edge(ctx: CanvasRenderingContext2D, light = '#FFFFFF', dark = '#000000') {
	rect(ctx, light, 0, 0, W, 1);
	rect(ctx, light, 0, 0, 1, H);
	rect(ctx, dark, 0, H - 1, W, 1);
	rect(ctx, dark, W - 1, 0, 1, H);
}
