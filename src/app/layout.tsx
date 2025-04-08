import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext'
import Nav from "./nav/page";
import Footer from "./footer/page";
import Background from "./background/page";

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
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-100[dvh]`}
        >
          <Background></Background>
          <AuthProvider>
            <Nav></Nav>
            {children}
          </AuthProvider>
          <Footer></Footer>
        </body>
    </html>
  );
}
