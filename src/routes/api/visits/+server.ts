import { json } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types';

// The one route on the site that runs on a server: an old-fashioned hit counter.
// Backed by Upstash Redis (add it from the Vercel Marketplace, which sets the env vars below).
export const prerender = false;

const COUNT_KEY = 'visits:count';
const DAY_IN_SECONDS = 60 * 60 * 24;

// Count a visitor at most once per day: remember a hash of their IP for a day,
// and only increment when that hash is new. Atomic, and one round trip.
const COUNT_ONCE = `
if redis.call('SET', KEYS[2], 1, 'NX', 'EX', ARGV[1]) then
	return redis.call('INCR', KEYS[1])
end
return tonumber(redis.call('GET', KEYS[1]) or '0')
`;

async function sha256(input: string) {
	const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: RequestHandler = async ({ getClientAddress, fetch }) => {
	const url = env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL;
	const token = env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) {
		return json({ error: 'Visit counter is not configured' }, { status: 503 });
	}

	// the date is part of the hash, so the stored key can't be linked to an IP across days
	const day = new Date().toISOString().slice(0, 10);
	const visitor = await sha256(`${day}:${getClientAddress()}`);

	const res = await fetch(url, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify([
			'EVAL',
			COUNT_ONCE,
			'2',
			COUNT_KEY,
			`visits:seen:${visitor}`,
			String(DAY_IN_SECONDS)
		])
	});
	if (!res.ok) {
		return json({ error: 'Visit counter is unavailable' }, { status: 502 });
	}
	const { result } = (await res.json()) as { result: number };

	return json({ count: result }, { headers: { 'Cache-Control': 'no-store' } });
};
