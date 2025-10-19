"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export default function ThemeClient({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      themes={['light', 'dark']}
    >
      {children}
    </ThemeProvider>
  );
}
