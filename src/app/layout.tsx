import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext'
import Nav from "./nav/page";
import Footer from "./footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Gestor de tareas simple con Next.js y Node.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html 
        lang="es"
        className="h-[100dvh]"
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-100[dvh]`}
        >
          <AuthProvider>
            <Nav></Nav>
            {children}
          </AuthProvider>
          <Footer></Footer>
        </body>
    </html>
  );
}
