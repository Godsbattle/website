import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Libre_Baskerville } from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "optional",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  preload: false,
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif-italic",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  preload: false,
});

const SITE_URL = "https://godsbattle.net";
const SITE_NAME = "Christian Obanaka";
const SITE_TITLE = "Christian Obanaka — Software Engineer";
const SITE_DESCRIPTION =
  "Software engineer and futures trader building clear, polished products for trading and fintech.";
const SOCIAL_IMAGE = {
  url: "/og/design-engineer-2026/",
  width: 1200,
  height: 630,
  alt: "Christian Obanaka — Software engineer",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · christian obanaka",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
    locale: "en_US",
    firstName: "Christian",
    lastName: "Obanaka",
    username: "chrisgoingturbo",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@chrisgoingturbo",
    images: [SOCIAL_IMAGE],
  },
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    "software engineer",
    "design engineer",
    "product design engineer",
    "frontend engineer",
    "trading product design",
    "fintech product design",
    "futures trading",
    "prop firms",
  ],
};

export const viewport: Viewport = {
  themeColor: "#fcfcfc",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light ${inter.variable} ${geistMono.variable} ${libreBaskerville.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-[14px] focus:font-medium focus:text-background"
        >
          skip to content
        </a>
        {children}
        {process.env.NODE_ENV === "development" ? <Agentation /> : null}
      </body>
    </html>
  );
}
