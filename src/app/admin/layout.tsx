import { isAdmin } from "@/lib/auth";
import { storageMode } from "@/lib/storage";
import { AdminShell } from "@/components/ui";
import { Login } from "./login";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    return <Login />;
  }
  return <AdminShell demoMode={storageMode() === "memory"}>{children}</AdminShell>;
}
