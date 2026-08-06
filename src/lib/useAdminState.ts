"use client";

import { useCallback, useEffect, useState } from "react";
import type { Db, UserRole } from "./types";

export interface ClientViewer {
  role: UserRole;
  email?: string;
  name?: string;
  personId?: string;
  legacy: boolean;
}

export function useAdminState() {
  const [db, setDb] = useState<Db | null>(null);
  const [mode, setMode] = useState<string>("memory");
  const [viewer, setViewer] = useState<ClientViewer | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { db: Db; storageMode: string; viewer: ClientViewer };
      setDb(data.db);
      setMode(data.storageMode);
      setViewer(data.viewer);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { db, mode, viewer, refresh };
}
