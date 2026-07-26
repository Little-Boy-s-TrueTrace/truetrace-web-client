import type { Metadata } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: {
    default: "TrueTrace Bank | Deepfake & AML Compliance",
    template: "%s | TrueTrace — TrueTrace Bank",
  },
  description:
    "Customer banking portal protected by TrueTrace multi-agent deepfake KYC, money-trail analysis, and human-reviewed AML reporting.",
  keywords: [
    "Little Boy's",
    "TrueTrace",
    "TrueTrace Bank",
    "deepfake KYC",
    "anti-money laundering",
    "mule account detection",
    "suspicious transaction report",
    "multi-agent compliance",
    "Vietnam fintech",
  ],
  authors: [
    { name: "Little Boy's", url: "https://github.com/Little-Boy-s-TrueTrace" },
  ],
  creator: "Little Boy's",
  publisher: "TrueTrace",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/Little-Boy-s-TrueTrace/truetrace",
    siteName: "TrueTrace — TrueTrace Bank",
    title: "TrueTrace Bank | Deepfake & AML Compliance",
    description:
      "Multi-agent banking compliance for deepfake KYC, money-trail detection, and human-reviewed STR drafts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueTrace Bank | Deepfake & AML Compliance",
    description:
      "TrueTrace coordinates deepfake inspection, transaction-graph analysis, and AML report drafting.",
    creator: "@truetrace",
  },
  metadataBase: new URL("https://github.com/Little-Boy-s-TrueTrace/truetrace"),
  alternates: {
    canonical: "https://github.com/Little-Boy-s-TrueTrace/truetrace",
  },
  category: "Financial Compliance",
  other: {
    "application-name": "TrueTrace Bank by Little Boy's",
    "apple-mobile-web-app-title": "TrueTrace",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TrueTrace",
  alternateName: ["TrueTrace", "TrueTrace Bank", "Little Boy's"],
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  description:
    "TrueTrace is a multi-agent deepfake KYC and AML decision-support platform for banks, with transaction graph analysis and human-reviewed STR drafting.",
  author: {
    "@type": "Organization",
    name: "Little Boy's",
    url: "https://github.com/Little-Boy-s-TrueTrace",
  },
  keywords:
    "Little Boy's, TrueTrace, deepfake KYC, AML, mule accounts, STR, agentic AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
