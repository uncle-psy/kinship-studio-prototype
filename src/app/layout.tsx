import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kinship Studio",
  description: "Creator Studio for Kinship Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <Header />
        <div className="flex pt-[60px]">
          <Sidebar />
          <main className="flex-1 ml-[220px] p-8 min-h-[calc(100vh-60px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
