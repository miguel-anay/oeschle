"use client";

import { useEffect } from "react";

interface TitleUpdaterProps {
  title: string;
}

export function TitleUpdater({ title }: TitleUpdaterProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
