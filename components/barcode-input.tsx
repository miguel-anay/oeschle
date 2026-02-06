"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidBarcode, getBarcodeError } from "@/lib/validators";
import { cn } from "@/lib/utils";

interface BarcodeInputProps {
  onSearch: (barcode: string) => void;
}

export function BarcodeInput({ onSearch }: BarcodeInputProps) {
  const [barcode, setBarcode] = useState("");

  const isValid = isValidBarcode(barcode);
  const errorMessage = getBarcodeError(barcode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/\D/g, "");
    setBarcode(filtered);
  };

  const handleSearch = () => {
    if (isValid) {
      onSearch(barcode);
      setBarcode("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid) {
      onSearch(barcode);
      setBarcode("");
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full gap-2">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Ingresa código de barras..."
          value={barcode}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn("w-full", errorMessage && "border-destructive")}
        />
        <Button onClick={handleSearch} disabled={!isValid}>
          Buscar
        </Button>
      </div>
      {errorMessage && (
        <p className="text-destructive text-sm">{errorMessage}</p>
      )}
    </div>
  );
}
