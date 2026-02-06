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
  const [showContainer, setShowContainer] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    if (isLoading) return;

    setIsLoading(true);
    // Show the container first so it exists in DOM before scanner initializes
    setShowContainer(true);

    // Wait for next render cycle so container is in DOM
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const scanner = new Html5Qrcode("scanner-container");
      scannerRef.current = scanner;

      // Try with exact environment constraint first (better for mobile)
      try {
        await scanner.start(
          { facingMode: { exact: "environment" } },
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
      } catch (exactErr) {
        // Fallback: Try to enumerate cameras and use the first rear camera
        try {
          const cameras = await Html5Qrcode.getCameras();

          if (cameras && cameras.length > 0) {
            // Try to find a rear camera by label
            const rearCamera = cameras.find(
              (camera) =>
                camera.label.toLowerCase().includes("back") ||
                camera.label.toLowerCase().includes("rear") ||
                camera.label.toLowerCase().includes("environment")
            );

            const cameraId = rearCamera ? rearCamera.id : cameras[cameras.length - 1].id;

            await scanner.start(
              cameraId,
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
          } else {
            throw new Error("No cameras found on this device");
          }
        } catch (fallbackErr) {
          // If enumeration also fails, try simple facingMode
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
        }
      }
    } catch (err) {
      let errorMessage = "Camera access denied";

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide more helpful error messages
        if (errorMessage.includes("Permission")) {
          errorMessage = "Camera permission denied. Please allow camera access in your browser settings.";
        } else if (errorMessage.includes("NotFoundError") || errorMessage.includes("not found")) {
          errorMessage = "No camera found on this device.";
        } else if (errorMessage.includes("NotAllowedError")) {
          errorMessage = "Camera access was blocked. Please check your browser permissions.";
        } else if (errorMessage.includes("NotReadableError")) {
          errorMessage = "Camera is already in use by another application.";
        }
      }

      onError?.(errorMessage);
      setIsActive(false);
      setShowContainer(false);
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
    setShowContainer(false);
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
      setShowContainer(false);
    };
  }, []);

  return (
    <div className="space-y-4">
      {showContainer && (
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
