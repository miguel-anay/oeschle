"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidBarcode } from "@/lib/validators";

interface BarcodeInputProps {
  onSearch: (barcode: string) => void;
}

export function BarcodeInput({ onSearch }: BarcodeInputProps) {
  const [barcode, setBarcode] = useState("");

  const isValid = isValidBarcode(barcode);

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
    <div className="flex w-full gap-2">
      <Input
        type="text"
        inputMode="numeric"
        placeholder="Ingresa código de barras..."
        value={barcode}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      <Button onClick={handleSearch} disabled={!isValid}>
        Buscar
      </Button>
    </div>
  );
}
