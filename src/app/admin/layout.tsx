import { getViewer, ssoConfigured } from "@/lib/auth";
import { storageMode } from "@/lib/storage";
import { AdminShell } from "@/components/ui";
import { Login } from "./login";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  const devMode = process.env.AUTH_DEV_MODE === "true" && !process.env.VERCEL;
  if (!viewer) {
    return <Login ssoEnabled={ssoConfigured()} devMode={devMode} />;
  }
  return (
    <AdminShell
      demoMode={storageMode() === "memory"}
      viewer={{ role: viewer.role, name: viewer.name ?? viewer.email ?? "", legacy: viewer.legacy ?? false }}
    >
      {children}
    </AdminShell>
  );
}
