import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ModalProvider } from "@/lib/modal-context";
import { ToastProvider } from "@/lib/toast-context";

// ═════════════════════════════════════════════════════════════════════════════
// IBM PLEX FONT CONFIGURATION
// Carbon Design System's official typeface
// ═════════════════════════════════════════════════════════════════════════════

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-condensed",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Foodies Zimbabwe — Procurement Platform",
  description: "Financial Control, Procurement & Inventory Management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable} ${plexCondensed.variable} font-sans`}>
        <AuthProvider>
          <ModalProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
