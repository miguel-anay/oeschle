import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barcode Scanner",
  description: "Consulta productos mediante código de barras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
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
