import './globals.css';
import WebsiteShell from '@/components/WebsiteShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vaswaniindustries.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vaswani Industries Ltd. | Leading Integrated Steel Manufacturer India',
    template: '%s | Vaswani Industries Ltd.',
  },
  description: 'Vaswani Industries Limited — Leading integrated steel manufacturer in Central India. Producing sponge iron (DRI), steel billets, forgings, TMT bars with captive power & solar energy. BSE Listed.',
  keywords: ['vaswani industries', 'steel manufacturer india', 'sponge iron', 'DRI', 'steel billets', 'chhattisgarh steel', 'captive power plant', 'TMT bars', 'forgings', 'BSE listed'],
  authors: [{ name: 'Vaswani Industries Ltd.' }],
  creator: 'Vaswani Industries Ltd.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Vaswani Industries Ltd.',
    title: 'Vaswani Industries Ltd. | Integrated Steel Manufacturer',
    description: 'Leading integrated steel manufacturer in Central India with captive power & solar energy.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vaswani Industries' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaswani Industries Ltd.',
    description: 'Integrated Steel Manufacturer in India — Sponge Iron, Billets, Power.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
  verification: { google: '' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14b8a6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-gray-800 antialiased min-h-screen" suppressHydrationWarning={true}>
        <WebsiteShell>
          {children}
        </WebsiteShell>
      </body>
    </html>
  );
}
