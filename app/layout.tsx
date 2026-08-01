import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Sora } from "next/font/google";
import { readSiteContent } from "@/lib/content-store";
import { siteMetadataBaseUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await readSiteContent();
  return {
    metadataBase: new URL(siteMetadataBaseUrl()),
    title: content.metadata.title,
    description: content.metadata.description,
    icons: {
      icon: [{ url: "/icon.png", type: "image/png", sizes: "192x192" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await headers();

  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`${inter.variable} ${sora.variable} min-h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
