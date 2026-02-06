---
name: html5-qrcode
description: >
  html5-qrcode patterns for barcode/QR scanning in React.
  Trigger: When implementing camera scanner, barcode detection, or QR code reading with html5-qrcode.
license: Apache-2.0
metadata:
  author: barcode-scanner
  version: "1.0"
  scope: [root]
  auto_invoke: "Implementing camera scanner"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## When to Use

- Implementing camera-based barcode scanning
- Adding QR code reader functionality
- Handling camera permissions in React
- Configuring scan formats (EAN, UPC, QR, etc.)

## Critical Patterns

### Basic Scanner Component

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onError?: (error: string) => void;
}

const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 150 },
  aspectRatio: 1.777778,
  formatsToSupport: [
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.QR_CODE,
  ],
} as const;

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    if (!containerRef.current) return;

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
        () => {} // Ignore scan failures
      );

      setIsScanning(true);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Camera access denied");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id="scanner-container"
        ref={containerRef}
        className="w-full aspect-video bg-slate-900 rounded-lg overflow-hidden"
      />
      <button
        onClick={isScanning ? stopScanner : startScanner}
        className="w-full py-2 px-4 bg-primary text-white rounded-lg"
      >
        {isScanning ? "Stop Scanner" : "Start Scanner"}
      </button>
    </div>
  );
}
```

### Permission Handling

```typescript
const CAMERA_STATUS = {
  IDLE: "idle",
  REQUESTING: "requesting",
  GRANTED: "granted",
  DENIED: "denied",
} as const;

type CameraStatus = (typeof CAMERA_STATUS)[keyof typeof CAMERA_STATUS];

export function useCameraPermission() {
  const [status, setStatus] = useState<CameraStatus>(CAMERA_STATUS.IDLE);

  const requestPermission = async () => {
    setStatus(CAMERA_STATUS.REQUESTING);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setStatus(CAMERA_STATUS.GRANTED);
      return true;
    } catch {
      setStatus(CAMERA_STATUS.DENIED);
      return false;
    }
  };

  return { status, requestPermission };
}
```

### Error States UI

```typescript
interface ScannerErrorProps {
  error: string;
  onRetry: () => void;
}

export function ScannerError({ error, onRetry }: ScannerErrorProps) {
  const isDenied = error.includes("denied") || error.includes("NotAllowedError");

  return (
    <div className="text-center p-6 space-y-4">
      <div className="text-4xl">{isDenied ? "🔒" : "⚠️"}</div>
      <h3 className="font-semibold">
        {isDenied ? "Camera Access Required" : "Scanner Error"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {isDenied
          ? "Please allow camera access in your browser settings"
          : error}
      </p>
      <button onClick={onRetry} className="btn-primary">
        Try Again
      </button>
    </div>
  );
}
```

### Supported Formats Reference

```typescript
import { Html5QrcodeSupportedFormats } from "html5-qrcode";

// Barcode formats
Html5QrcodeSupportedFormats.EAN_13      // Standard product barcodes
Html5QrcodeSupportedFormats.EAN_8       // Short product barcodes
Html5QrcodeSupportedFormats.UPC_A       // US product barcodes
Html5QrcodeSupportedFormats.UPC_E       // Compressed UPC
Html5QrcodeSupportedFormats.CODE_128    // Logistics/shipping
Html5QrcodeSupportedFormats.CODE_39     // Industrial

// QR formats
Html5QrcodeSupportedFormats.QR_CODE     // Standard QR
Html5QrcodeSupportedFormats.DATA_MATRIX // Industrial 2D
```

### Best Practices

```typescript
// ✅ Always cleanup on unmount
useEffect(() => {
  return () => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.stop();
    }
  };
}, []);

// ✅ Use environment camera (back) on mobile
{ facingMode: "environment" }

// ✅ Optimize FPS for battery
{ fps: 10 }  // Not too high

// ✅ Provide visual feedback
<div className="relative">
  {isScanning && (
    <div className="absolute inset-0 border-2 border-primary animate-pulse" />
  )}
</div>

// ❌ NEVER leave camera running
// Always stop on navigation or component unmount
```

### Integration with Manual Input

```typescript
export function BarcodeInput() {
  const [code, setCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (scannedCode: string) => {
    setCode(scannedCode);
    setShowScanner(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter barcode..."
          className="flex-1"
        />
        <button onClick={() => setShowScanner(true)}>
          📷
        </button>
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onError={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
```

## Commands

```bash
# Install
pnpm add html5-qrcode

# Types included in package
# No need for @types/html5-qrcode
```

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Safari | ✅ iOS 14.3+ |
| Firefox | ✅ Full |
| Edge | ✅ Full |

**Note**: Requires HTTPS in production (camera API requirement).
