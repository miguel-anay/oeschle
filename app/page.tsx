"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-6 sm:min-h-[calc(100vh-4rem)] sm:py-8 lg:py-12">
      <div className="w-full max-w-md space-y-6 text-center sm:space-y-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
          Barcode Scanner
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Escanea o ingresa un codigo de barras para buscar productos
        </p>
        <BarcodeInput onSearch={handleSearch} />

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">o usa la camara</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <CameraScanner onScan={handleSearch} onError={handleCameraError} />

        {cameraError && <p className="text-sm text-destructive">{cameraError}</p>}
      </div>
    </main>
  );
}
