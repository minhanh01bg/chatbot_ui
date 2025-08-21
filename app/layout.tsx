import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { AuthErrorHandler } from "@/components/auth-error-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatAI Pro - Next-Generation AI Chat Platform",
  description: "Experience the future of AI conversations with our cutting-edge chatbot platform. Transform your digital interactions with intelligent, context-aware responses.",
  keywords: ["AI Chat", "Chatbot", "Artificial Intelligence", "Conversation AI", "AI Assistant"],
  authors: [{ name: "ChatAI Pro Team" }],
  creator: "ChatAI Pro",
  publisher: "ChatAI Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "ChatAI Pro - Next-Generation AI Chat Platform",
    description: "Experience the future of AI conversations with our cutting-edge chatbot platform.",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: "ChatAI Pro",
    images: [
      {
        url: "/images/demo-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "ChatAI Pro - AI Chat Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatAI Pro - Next-Generation AI Chat Platform",
    description: "Experience the future of AI conversations with our cutting-edge chatbot platform.",
    images: ["/images/demo-thumbnail.png"],
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
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <AuthErrorHandler />
                {children}
                <Toaster />
              </AuthProvider>
            </ThemeProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
