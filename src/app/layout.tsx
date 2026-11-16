import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import { site } from "@/data/content";
import BookingProvider from "@/components/booking/BookingProvider";
import CustomCursor from "@/components/animations/CustomCursor";
import MotionProvider from "@/components/animations/MotionProvider";
import ScrollProgress from "@/components/animations/ScrollProgress";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";

const sans = Inter({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--f-serif", display: "swap", style: ["normal", "italic"], weight: ["500", "600", "700"] });
const script = Great_Vibes({ subsets: ["latin"], variable: "--f-script", display: "swap", weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: site.title, template: '%s — Badawy Productions' },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    images: [{ url: "/images/hero.png", width: 2023, height: 777, alt: "Badawy Productions" }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/images/hero.png"] },
};

export const viewport: Viewport = { colorScheme: "dark light" };

/**
 * Runs before first paint: marks JS-enabled, and skips the intro if it was already played this session or the visit
 * starts on an inner page (the cinematic preloader only runs on the homepage).
 */
/** Dark is the default. Set NEXT_PUBLIC_THEME_FOLLOW_SYSTEM=true to honour the OS preference when the visitor has not chosen yet. */
const FOLLOW_SYSTEM = process.env.NEXT_PUBLIC_THEME_FOLLOW_SYSTEM === "true";
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var t='dark';try{var s=localStorage.getItem('badawy-theme');if(s==='light'||s==='dark'){t=s}else if(${FOLLOW_SYSTEM}&&window.matchMedia('(prefers-color-scheme: light)').matches){t='light'}}catch(e){}d.dataset.theme=t;d.style.colorScheme=t;try{if(location.pathname!=='/'||sessionStorage.getItem('badawy-intro')){d.classList.add('intro-done')}else{d.classList.add('preloading')}}catch(e){d.classList.add('intro-done')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0b0b0b" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <BookingProvider>
          <a href="#main" className="sr-only z-[120] bg-copper px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Skip to content
          </a>
          <ScrollProgress />
          <CustomCursor />
          <Header />
          {children}
          <Footer />
          <BackToTop />
          <MotionProvider />
        </BookingProvider>
      </body>
    </html>
  );
}
