import Footer from '@/components/layout/Footer';
import Nav from '@/components/layout/Nav';
import { Toaster } from '@/components/ui/toaster';
import { Montserrat_Alternates } from '@next/font/google';
import './globals.css';
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'MoodWav',
  description:
    'Providing personalized mood profiles based on recent Spotify listening history.',
};

const MA = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={MA.className}>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className='text-foreground min-h-screen flex flex-col items-center w-full text-white moodring'>
        <Nav />
        <main className='flex-1 justify-center items-center flex flex-col container'>
          {children}
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
