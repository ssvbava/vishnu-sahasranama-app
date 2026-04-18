import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vishnu Sahasranama — The Thousand Names of Lord Vishnu",
  description:
    "Explore the 1,000 divine names of Lord Vishnu with Sanskrit text, transliteration, English meanings, and audio chanting. From the Anushasana Parva of the Mahabharata.",
  keywords: [
    "Vishnu Sahasranama",
    "thousand names",
    "Lord Vishnu",
    "Hindu scriptures",
    "Sanskrit chanting",
    "Mahabharata",
  ],
  openGraph: {
    title: "Vishnu Sahasranama",
    description: "The Thousand Names of Lord Vishnu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
