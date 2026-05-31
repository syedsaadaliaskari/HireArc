import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireArc",
  description:
    "A job searching app that helps user to post jobs and land their first job.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-gray-100 text-black`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>
          <div className="min-h-screen bg-gray-100 ">
            <Navbar />
            <main className="container mx-auto px-6 py-8">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
