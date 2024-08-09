import baseUrl from '$lib/stores/baseUrl';

export async function GET() {
	return new Response(
		`
User-agent: *
Allow: /
Disallow: /RSTG-SA.pdf
Host: ${baseUrl}
Sitemap: ${baseUrl}/sitemap.xml
    `.trim(),
		{
			headers: {
				'Content-Type': 'text/plain'
			}
		}
	);
}
