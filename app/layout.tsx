import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "HireArc",
  description: "Find your dream job",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F7F8FC] min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
