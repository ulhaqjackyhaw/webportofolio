import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webportofolio-lq360ud6q-ulhaqjackyhaws-projects.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
