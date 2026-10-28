import { Inter } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';
import { Providers } from './providers';
import "./globals.css";
import 'lenis/dist/lenis.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  display: "swap",
  preload: true
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webportofolio-lq360ud6q-ulhaqjackyhaws-projects.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dhiya Ulhaq | Software Developer Portfolio",
    template: "%s | Dhiya Ulhaq"
  },
  description: "Portofolio resmi Dhiya Ulhaq - Software Developer spesialisasi Mobile App Development (Flutter, Android), Web Development (Next.js, React, Laravel), IoT, dan Machine Learning.",
  keywords: [
    "Dhiya Ulhaq",
    "Software Developer",
    "Mobile Developer",
    "Web Developer",
    "Flutter Developer",
    "Next.js Developer",
    "React Js",
    "Laravel",
    "Politeknik Negeri Semarang",
    "Portofolio Dhiya Ulhaq",
    "IoT Developer",
    "Indonesia Software Engineer"
  ],
  authors: [{ name: "Dhiya Ulhaq", url: "https://www.linkedin.com/in/dhiyaulhaq100" }],
  creator: "Dhiya Ulhaq",
  publisher: "Dhiya Ulhaq",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Dhiya Ulhaq | Software Developer Portfolio",
    description: "Portofolio resmi Dhiya Ulhaq - Software Developer spesialisasi Mobile App Development, Web Development, IoT, dan Machine Learning.",
    url: siteUrl,
    siteName: "Dhiya Ulhaq Portfolio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhiya Ulhaq | Software Developer Portfolio",
    description: "Portofolio resmi Dhiya Ulhaq - Software Developer spesialisasi Mobile App Development, Web Development, IoT, dan Machine Learning.",
    creator: "@dhy_lhq",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Dhiya Ulhaq',
      jobTitle: 'Software Developer',
      description: 'Third-year Informatics Engineering student at Politeknik Negeri Semarang focusing on mobile development, IoT, and web development.',
      url: siteUrl,
      sameAs: [
        'https://github.com/ulhaqjackyhaw',
        'https://www.linkedin.com/in/dhiyaulhaq100',
        'https://www.instagram.com/dhy_lhq',
      ],
      knowsAbout: [
        'Mobile Development',
        'Flutter',
        'Android',
        'Web Development',
        'Next.js',
        'React',
        'Laravel',
        'Python',
        'IoT',
        'PostgreSQL',
        'Java',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Dhiya Ulhaq Portfolio',
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="text-zinc-50 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-500">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased dark text-foreground bg-background`} suppressHydrationWarning={true}>
        <GoogleTagManager gtmId="GTM-WRTCTKBL" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
