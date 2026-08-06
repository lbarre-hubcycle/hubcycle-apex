"use client";

import { useCallback, useEffect, useState } from "react";
import type { Db, FeedbackItem, Okr, UserRole } from "./types";

export interface ClientViewer {
  role: UserRole;
  email?: string;
  name?: string;
  personId?: string;
  legacy: boolean;
}

export interface DirectoryEntry {
  id: string;
  name: string;
  roleId?: string;
}

export type WallItem = FeedbackItem & { toId: string; toName: string };

export function useAdminState() {
  const [db, setDb] = useState<Db | null>(null);
  const [mode, setMode] = useState<string>("memory");
  const [viewer, setViewer] = useState<ClientViewer | null>(null);
  const [directory, setDirectory] = useState<DirectoryEntry[]>([]);
  const [wall, setWall] = useState<WallItem[]>([]);
  const [okrs, setOkrs] = useState<Okr[]>([]);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as {
        db: Db;
        storageMode: string;
        viewer: ClientViewer;
        directory?: DirectoryEntry[];
        wall?: WallItem[];
        okrs?: Okr[];
      };
      setDb(data.db);
      setMode(data.storageMode);
      setViewer(data.viewer);
      setDirectory(data.directory ?? []);
      setWall(data.wall ?? []);
      setOkrs(data.okrs ?? []);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { db, mode, viewer, directory, wall, okrs, refresh };
}
