// The visitor counter is baked in at build time from Vercel Web Analytics,
// so it's as of the last deploy. It needs a VERCEL_ACCESS_TOKEN env var at build;
// without one (say, locally) the counter just shows dashes.
// https://vercel.com/docs/rest-api/web-analytics/counts-page-views

const PROJECT_ID = 'prj_9knBmFDhCNbBxrSPXtjJUnvS5hIN';
const TEAM_ID = 'team_jWejXcbvqLELCGonfEm7ytPB';

export async function getVisits(): Promise<number | null> {
	// process.env rather than $env: $env/dynamic can't be read while prerendering,
	// and $env/static/private fails the build when the variable isn't set
	const token = process.env.VERCEL_ACCESS_TOKEN;
	if (!token) return null;

	try {
		const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
		url.searchParams.set('projectId', PROJECT_ID);
		url.searchParams.set('teamId', TEAM_ID);
		// No since/until on purpose: left open, the count covers the project's whole life.
		// An explicit range on the Hobby plan is limited to the last 31 days.
		const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
		if (!res.ok) throw new Error(`Vercel responded ${res.status}`);
		const body = (await res.json()) as { data?: { pageviews?: unknown } };
		// old-school hit counters counted hits, so: page views, not unique visitors
		const pageviews = body.data?.pageviews;
		if (typeof pageviews !== 'number') throw new Error('Response had no page view count');
		return pageviews;
	} catch (error) {
		console.warn('Could not fetch the visit count; the counter will show dashes.', error);
		return null;
	}
}
