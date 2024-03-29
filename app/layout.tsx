import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/providers/react-query";
import { ThemeProvider } from "@/providers/theme-provider";
import { Montserrat } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MoodWav",
  description:
    "Providing personalized mood profiles based on recent Spotify listening history.",
};

const MA = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={MA.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <div className="moodring flex min-h-screen w-full flex-col items-center bg-background font-medium text-white antialiased">
              <nav className="container">
                <Nav />
              </nav>
              <main className="container flex flex-1 flex-col items-center justify-center">
                {children}
              </main>
              <footer className="container">
                <Footer />
              </footer>
            </div>
            <SpeedInsights />
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
