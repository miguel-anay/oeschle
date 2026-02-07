"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useHistoryStore } from "@/store/history";

interface HistoryUpdaterProps {
  code: string;
  product_name: string;
  image_url: string;
}

export function HistoryUpdater({ code, product_name, image_url }: HistoryUpdaterProps) {
  const { addItem } = useHistoryStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    addItem({
      code,
      product_name,
      image_url,
    });

    toast.success("Producto encontrado", {
      description: product_name,
      duration: 2500,
    });
  }, [addItem, code, product_name, image_url]);

  return null;
}
