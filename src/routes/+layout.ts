import { inject } from '@vercel/analytics';

import { dev } from '$app/env';

inject({ mode: dev ? 'development' : 'production' });

export const prerender = true;
