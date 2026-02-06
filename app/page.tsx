"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarcodeInput } from "@/components/barcode-input";
import { CameraScanner } from "@/components/camera-scanner";

export default function HomePage() {
  const router = useRouter();
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleSearch = (barcode: string) => {
    router.push(`/product/${barcode}`);
  };

  const handleCameraError = (error: string) => {
    setCameraError(error);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
        <p className="text-muted-foreground">
          Escanea o ingresa un código de barras para buscar productos
        </p>
        <BarcodeInput onSearch={handleSearch} />

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">o usa la cámara</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <CameraScanner onScan={handleSearch} onError={handleCameraError} />

        {cameraError && (
          <p className="text-sm text-destructive">{cameraError}</p>
        )}

        <Link
          href="/history"
          className="inline-block text-sm text-primary hover:underline"
        >
          Ver historial de búsquedas
        </Link>
      </div>
    </main>
  );
}
