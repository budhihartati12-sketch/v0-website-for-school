import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans";

import { Manrope } from "next/font/google"
import "./globals.css"
import { MobileBottomNav } from "@/components/site/mobile-nav"

const geist = GeistSans

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "SMP IT Masjid Syuhada Yogyakarta",
  description: "Sekolah Menengah Pertama Islam Terpadu Masjid Syuhada - Mencetak Generasi Qurani",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function addEnvironmentIndicator() {
                  const url = window.location.href;
                  let environment = 'development';
                  let label = 'DEV';
                  let className = 'dev';
                  
                  if (url.includes('/websekolah-staging/')) {
                    environment = 'staging';
                    label = 'STAGING';
                    className = 'staging';
                  } else if (url.includes('/websekolah/')) {
                    environment = 'production';
                    label = 'PROD';
                    className = 'production';
                  }
                  
                  const indicator = document.createElement('div');
                  indicator.className = 'environment-indicator ' + className;
                  indicator.textContent = label;
                  indicator.title = environment.charAt(0).toUpperCase() + environment.slice(1) + ' Environment';
                  
                  document.body.appendChild(indicator);
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', addEnvironmentIndicator);
                } else {
                  addEnvironmentIndicator();
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <div className="min-h-dvh pb-16 md:pb-0">{children}</div>
        <MobileBottomNav />
      </body>
    </html>
  )
}
