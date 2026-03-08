import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

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
      <body className="antialiased">
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
