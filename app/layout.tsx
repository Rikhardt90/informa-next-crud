import type { Metadata } from "next";
import Image from "next/image";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Aplicación CRUD de tareas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={roboto.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <header className="bg-primary px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-center">
            <Image
              src="/logo-informa.svg"
              alt="Task Manager"
              width={100}
              height={40}
              className="h-auto w-auto"
            />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}