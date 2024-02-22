'use client';

import { ReactNode } from 'react';
import ReactQueryProvider from './react-query';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
}
