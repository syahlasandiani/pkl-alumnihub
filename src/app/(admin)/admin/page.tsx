import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/rbac/getProfile";

export default async function AdminPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-sm opacity-80">RBAC test: hanya ADMIN yang bisa lihat page ini.</p>

      <div className="mt-6 rounded-2xl border p-5">
        <div className="text-sm">
          Logged as: <span className="font-medium">{profile.display_name}</span>
        </div>
        <div className="mt-2 text-sm opacity-80">
          role: {profile.role} • status: {profile.verification_status}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <div className="font-medium">Verifications Queue</div>
            <div className="text-sm opacity-70">Coming soon (next step).</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="font-medium">Moderation</div>
            <div className="text-sm opacity-70">Coming soon (next step).</div>
          </div>
        </div>
      </div>
    </div>
  );
}