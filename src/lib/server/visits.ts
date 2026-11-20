// The visitor counter is baked in at build time from Vercel Web Analytics,
// so it's as of the last deploy. It needs a VERCEL_ACCESS_TOKEN env var at build;
// without one (say, locally) the counter just shows dashes.
// https://vercel.com/docs/rest-api/web-analytics/counts-page-views

const PROJECT_ID = 'prj_9knBmFDhCNbBxrSPXtjJUnvS5hIN';
const TEAM_ID = 'team_jWejXcbvqLELCGonfEm7ytPB';

export async function getVisits(): Promise<number | null> {
	const token = process.env.VERCEL_ACCESS_TOKEN;
	if (!token) return null;

	try {
		const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
		url.searchParams.set('projectId', PROJECT_ID);
		url.searchParams.set('teamId', TEAM_ID);
		const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
		if (!res.ok) throw new Error(`Vercel responded ${res.status}`);
		const { data } = (await res.json()) as { data: { pageviews: number } };
		// old-school hit counters counted hits, so: page views, not unique visitors
		return data.pageviews;
	} catch (error) {
		console.warn('Could not fetch the visit count; the counter will show dashes.', error);
		return null;
	}
}
