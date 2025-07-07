import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner"

import "./globals.css";
import { EdgeStoreProvider } from '../lib/edgestore';
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alexianotion",
  description: "The official website of Alexianotion",
  // icons: {
  //   icon: [
  //     {
  //       media: "(prefers-color-scheme: light)",
  //       url: "/favicon-light.svg",
  //       herf: "/favicon-light.svg",
  //     },
  //     {
  //       media: "(prefers-color-scheme: dark)",
  //       url: "/favicon-dark.svg",
  //       herf: "/favicon-dark.svg",
  //     }
  //   ]
  // }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  // 忽略水和警告
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
              disableTransitionOnChange
              storageKey="joint-theme"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
