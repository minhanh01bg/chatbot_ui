import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeInitializer } from "@/components/theme-initializer";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "ChatAI Pro - Next-Generation AI Chat Platform",
  description: "Transform your digital interactions with our cutting-edge AI chatbot. Experience human-like conversations, instant responses, and intelligent context understanding.",
  keywords: ["AI", "Chatbot", "Artificial Intelligence", "Conversation", "Machine Learning"],
  authors: [{ name: "ChatAI Pro Team" }],
  creator: "ChatAI Pro",
  publisher: "ChatAI Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chataipro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chataipro.com",
    title: "ChatAI Pro - Next-Generation AI Chat Platform",
    description: "Transform your digital interactions with our cutting-edge AI chatbot. Experience human-like conversations, instant responses, and intelligent context understanding.",
    siteName: "ChatAI Pro",
    images: [
      {
        url: "/images/demo-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "ChatAI Pro Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatAI Pro - Next-Generation AI Chat Platform",
    description: "Transform your digital interactions with our cutting-edge AI chatbot. Experience human-like conversations, instant responses, and intelligent context understanding.",
    images: ["/images/demo-thumbnail.png"],
    creator: "@chataipro",
  },
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="chataipro-theme"
          >
            <ThemeInitializer />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
