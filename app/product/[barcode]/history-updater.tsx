"use client";

import { useEffect } from "react";
import { useHistoryStore } from "@/store/history";

interface HistoryUpdaterProps {
  code: string;
  product_name: string;
  image_url: string;
}

export function HistoryUpdater({ code, product_name, image_url }: HistoryUpdaterProps) {
  const { addItem } = useHistoryStore();

  useEffect(() => {
    addItem({
      code,
      product_name,
      image_url,
    });
  }, [addItem, code, product_name, image_url]);

  return null;
}
