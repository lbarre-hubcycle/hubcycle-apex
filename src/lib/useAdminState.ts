"use client";

import { useCallback, useEffect, useState } from "react";
import type { Db } from "./types";

export function useAdminState() {
  const [db, setDb] = useState<Db | null>(null);
  const [mode, setMode] = useState<string>("memory");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { db: Db; storageMode: string };
      setDb(data.db);
      setMode(data.storageMode);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { db, mode, refresh };
}
