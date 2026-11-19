import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const DESCRIPTION =
  "Private, comfortable, and stress-free transportation for pets and their humans across Bali. Pet taxi, dog walking and in-home pet sitting.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The PawCab | Exclusive Pet Mobility in Bali",
    template: "%s",
  },
  description: DESCRIPTION,
  keywords: [
    "pet taxi Bali",
    "pet transport Bali",
    "dog walking Bali",
    "pet sitting Bali",
    "pet mobility Bali",
    "airport pet transfer Bali",
    "The PawCab",
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "The PawCab | Exclusive Pet Mobility in Bali",
    description: DESCRIPTION,
    images: [{ url: "/images/hero.jpeg", alt: "The PawCab pet transport in Bali" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The PawCab | Exclusive Pet Mobility in Bali",
    description: DESCRIPTION,
    images: ["/images/hero.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const site = getContent().site;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/images/hero.jpeg`,
  logo: `${SITE_URL}/images/logo-pawcab.png`,
  telephone: site.phone,
  email: site.email,
  openingHours: "Mo-Su 07:00-21:00",
  areaServed: { "@type": "AdministrativeArea", name: "Bali, Indonesia" },
  address: { "@type": "PostalAddress", addressRegion: "Bali", addressCountry: "ID" },
  sameAs: [site.instagramUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
