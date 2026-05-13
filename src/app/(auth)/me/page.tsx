import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/rbac/getProfile";

export default async function MePage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">My Dashboard</h1>
      <p className="mt-2 text-sm opacity-80">
        Ini halaman test RBAC. Semua user login boleh masuk.
      </p>

      <div className="mt-6 rounded-2xl border p-5">
        <h2 className="font-medium">RBAC Status</h2>
        <div className="mt-3 grid gap-2 text-sm">
          <div><span className="opacity-70">display_name:</span> {profile.display_name ?? "-"}</div>
          <div><span className="opacity-70">role:</span> {profile.role}</div>
          <div><span className="opacity-70">verification_status:</span> {profile.verification_status}</div>
          <div><span className="opacity-70">user_id:</span> {profile.id}</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <a className="rounded-xl border px-4 py-2" href="/admin">Go Admin</a>
          <a className="rounded-xl border px-4 py-2" href="/dashboard">Go Alumni Dashboard</a>
        </div>

        <p className="mt-3 text-xs opacity-70">
          Expected: Admin bisa masuk /admin & /dashboard. User biasa hanya bisa /me.
        </p>
      </div>
    </div>
  );
}