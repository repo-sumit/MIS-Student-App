import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Montserrat, Mukta } from "next/font/google";
import { AppProviders } from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap"
});

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap"
});

export const metadata: Metadata = {
  title: "HPU Admission",
  description: "Student admission portal for Himachal Pradesh University affiliated colleges",
  applicationName: "HPU Admission",
  icons: {
    icon: [
      { url: "/assets/HPU_Logo.png", type: "image/png" }
    ],
    shortcut: "/assets/HPU_Logo.png",
    apple: "/assets/HPU_Logo.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  themeColor: "#386AF6"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${mukta.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
