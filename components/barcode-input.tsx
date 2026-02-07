"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidBarcode, getBarcodeError } from "@/lib/validators";
import { cn } from "@/lib/utils";

interface BarcodeInputProps {
  onSearch: (barcode: string) => void;
  isLoading?: boolean;
}

export function BarcodeInput({ onSearch, isLoading = false }: BarcodeInputProps) {
  const [barcode, setBarcode] = useState("");

  const isValid = isValidBarcode(barcode);
  const errorMessage = getBarcodeError(barcode);
  const isDisabled = !isValid || isLoading;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/\D/g, "");
    setBarcode(filtered);
  };

  const handleSearch = () => {
    if (isValid && !isLoading) {
      onSearch(barcode);
      setBarcode("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid && !isLoading) {
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
          disabled={isLoading}
          className={cn(
            "w-full transition-colors duration-200",
            errorMessage && "border-destructive"
          )}
        />
        <Button onClick={handleSearch} disabled={isDisabled}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Buscando
            </>
          ) : (
            "Buscar"
          )}
        </Button>
      </div>
      {errorMessage && (
        <p className="animate-fadeIn text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
