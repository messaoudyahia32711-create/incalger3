import type { Metadata } from "next";
import { Cairo, Tajawal, Amiri, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'INC ALG 3 — منصة رقمنة حاضنة أعمال جامعة الجزائر 3',
  description: 'منصة رقمية متكاملة لرقمنة خدمات حاضنة الأعمال الجامعية — جامعة الجزائر 3 إبراهيم سلطان شيبوط',
  keywords: ['حاضنة أعمال', 'جامعة الجزائر 3', 'رقمنة', 'ريادة أعمال', 'INC ALG 3', 'IncuBADZ'],
  icons: { icon: '/logo.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${tajawal.variable} ${amiri.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-tajawal), Tajawal, sans-serif' }}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
