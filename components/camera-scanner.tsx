"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CameraScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}

const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 150 },
  formatsToSupport: [
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.QR_CODE,
  ],
} as const;

export function CameraScanner({ onScan, onError }: CameraScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const scanner = new Html5Qrcode("scanner-container");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        SCANNER_CONFIG,
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {
          // Ignore scan failures (continuous scanning noise)
        }
      );

      setIsActive(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Camera access denied";
      onError?.(errorMessage);
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
      } catch {
        // Ignore errors during cleanup
      }
    }
    setIsActive(false);
  };

  const handleButtonClick = () => {
    if (isActive) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        try {
          if (scanner.isScanning) {
            scanner.stop();
          }
          scanner.clear();
        } catch {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {isActive && (
        <div
          id="scanner-container"
          data-testid="scanner-container"
          className={cn("w-full aspect-video bg-slate-900 rounded-lg overflow-hidden")}
        />
      )}
      <Button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="w-full"
      >
        {isActive ? "Cerrar cámara" : "Activar cámara"}
      </Button>
    </div>
  );
}
