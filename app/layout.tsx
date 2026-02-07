import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barcode Scanner",
  description: "Consulta productos mediante código de barras",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <Header />
        <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6 sm:pb-0 lg:px-8">
          {children}
        </div>
        <Toaster
          position="bottom-center"
          duration={3000}
          closeButton
          toastOptions={{
            classNames: {
              toast: "toast bottom-4 w-full max-w-md",
              success: "success bg-green-50 border-green-200",
              error: "error bg-red-50 border-red-200",
              closeButton: "min-h-[44px] min-w-[44px]",
            },
          }}
        />
      </body>
    </html>
  );
}
