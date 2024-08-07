const baseUrl = import.meta.env.VITE_VERCEL_URL
	? `https://${import.meta.env.VITE_VERCEL_URL}`
	: 'http://localhost:5173';
export default baseUrl;
