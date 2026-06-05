import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { sendVerificationEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("id", user.id)
      .single();

    if (
      !adminProfile ||
      adminProfile.role !== "ADMIN" ||
      adminProfile.account_status !== "ACTIVE"
    ) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await req.json();
    const action = String(body.action || "").trim();
    const adminNote = String(body.adminNote || "").trim();

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { error: "Action tidak valid." },
        { status: 400 }
      );
    }

    if (action === "REJECT" && !adminNote) {
      return NextResponse.json(
        { error: "Catatan admin wajib diisi saat reject." },
        { status: 400 }
      );
    }

    const { data: verificationRequest } = await supabase
      .from("verification_requests")
      .select("id, user_id, status, full_name")
      .eq("id", id)
      .maybeSingle();

    if (!verificationRequest) {
      return NextResponse.json(
        { error: "Pengajuan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (verificationRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Pengajuan ini sudah diproses." },
        { status: 400 }
      );
    }

    const nextRequestStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    const nextProfileStatus = action === "APPROVE" ? "VERIFIED" : "REJECTED";

    const { error: requestUpdateError } = await supabase
      .from("verification_requests")
      .update({
        status: nextRequestStatus,
        admin_note: action === "REJECT" ? adminNote : null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (requestUpdateError) {
      return NextResponse.json(
        { error: requestUpdateError.message || "Gagal update pengajuan." },
        { status: 500 }
      );
    }

    const profileUpdateData: any = {
      verification_status: nextProfileStatus,
    };

    if (action === "APPROVE") {
      profileUpdateData.role = "ALUMNI";
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server error: SUPABASE_SERVICE_ROLE_KEY belum di-set di .env.local" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdateData)
      .eq("id", verificationRequest.user_id);

    if (profileUpdateError) {
      return NextResponse.json(
        { error: profileUpdateError.message || "Gagal update status user." },
        { status: 500 }
      );
    }

    // Ambil data profil (email) untuk kirim email notifikasi
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("email, display_name")
      .eq("id", verificationRequest.user_id)
      .maybeSingle();

    const userEmail = userProfile?.email || "";
    const userName = verificationRequest.full_name || userProfile?.display_name || "Alumni";

    if (userEmail) {
      sendVerificationEmail({
        toEmail: userEmail,
        userName: userName,
        status: nextProfileStatus,
        adminNote: action === "REJECT" ? adminNote : null,
      }).catch((err) => {
        console.error("Gagal mengirim email notifikasi verifikasi:", err);
      });
    } else {
      console.warn(`[Verification Email] Skip sending email because email is empty for user_id: ${verificationRequest.user_id}. Pastikan kolom 'email' di tabel 'profiles' sudah terisi.`);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/verifications", "page");

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? "Pengajuan berhasil disetujui."
          : "Pengajuan berhasil ditolak.",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pengajuan." },
      { status: 500 }
    );
  }
}