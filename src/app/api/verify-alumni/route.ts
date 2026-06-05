import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Kamu harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const intakeYear = Number(body.intakeYear || 0);
    const program = String(body.program || "").trim();
    const institution = String(body.institution || "").trim();
    const documentUrl = String(body.documentUrl || "").trim();

    if (!fullName || !intakeYear || !program || !institution || !documentUrl) {
      return NextResponse.json(
        { error: "Semua field dan dokumen wajib diisi." },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    if (intakeYear < 1900 || intakeYear > currentYear + 1) {
      return NextResponse.json(
        { error: "Tahun penerimaan tidak valid." },
        { status: 400 }
      );
    }

    let profile = null;
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role, verification_status, account_status")
      .eq("id", user.id)
      .single();

    if (profileError) {
      if (profileError.code === "PGRST116") {
        // Create profile row dynamically if missing
        const displayName =
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User";

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            display_name: displayName.substring(0, 100),
            role: "USER",
            account_status: "ACTIVE",
            verification_status: "NONE",
            email: user.email,
          })
          .select("role, verification_status, account_status")
          .single();

        if (createError) {
          console.error("Gagal membuat profil otomatis:", createError);
          return NextResponse.json(
            { error: `Profil tidak ditemukan dan gagal dibuat secara otomatis: ${createError.message}` },
            { status: 500 }
          );
        }
        profile = newProfile;
      } else {
        console.error("Profile query error:", profileError);
        return NextResponse.json(
          { error: `Gagal mengambil profil: ${profileError.message} (code: ${profileError.code})` },
          { status: 500 }
        );
      }
    } else {
      profile = existingProfile;
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Profil tidak ditemukan untuk akun ini." },
        { status: 404 }
      );
    }

    if (profile.account_status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Akun tidak aktif. Hubungi admin untuk mengaktifkan kembali." },
        { status: 403 }
      );
    }

    if (profile.role === "ADMIN" || profile.role === "ALUMNI" || profile.verification_status === "VERIFIED") {
      return NextResponse.json(
        { error: "Akun ini tidak perlu mengajukan verifikasi alumni." },
        { status: 400 }
      );
    }

    const { data: latestRequest } = await supabase
      .from("verification_requests")
      .select("id, status, submission_number")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestRequest?.status === "PENDING") {
      return NextResponse.json(
        { error: "Kamu masih punya pengajuan yang sedang diproses." },
        { status: 400 }
      );
    }

    const nextSubmissionNumber =
      latestRequest?.submission_number && latestRequest.submission_number > 0
        ? latestRequest.submission_number + 1
        : 1;

    if (nextSubmissionNumber > 3) {
      return NextResponse.json(
        { error: "Batas pengajuan ulang sudah tercapai." },
        { status: 400 }
      );
    }

    const { data: requestData, error: insertError } = await supabase
      .from("verification_requests")
      .insert({
        user_id: user.id,
        full_name: fullName,
        intake_year: intakeYear,
        program,
        institution,
        status: "PENDING",
        submission_number: nextSubmissionNumber,
        admin_note: null,
        reviewed_by: null,
        reviewed_at: null,
      })
      .select("id")
      .single();

    if (insertError || !requestData) {
      return NextResponse.json(
        { error: insertError?.message || "Gagal menyimpan pengajuan." },
        { status: 500 }
      );
    }

    const { error: docError } = await supabase
      .from("verification_documents")
      .insert({
        verification_request_id: requestData.id,
        file_path: documentUrl,
        original_filename: "bukti_alumni",
        document_type: "OTHER",
      });

    if (docError) {
      // Rollback request
      await supabase.from("verification_requests").delete().eq("id", requestData.id);
      return NextResponse.json(
        { error: docError.message || "Gagal menyimpan dokumen bukti." },
        { status: 500 }
      );
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ verification_status: "PENDING" })
      .eq("id", user.id);

    if (profileUpdateError) {
      return NextResponse.json(
        { error: profileUpdateError.message || "Gagal memperbarui status user." },
        { status: 500 }
      );
    }

    // Kirim notifikasi email secara asinkron
    sendVerificationEmail({
      toEmail: user.email || "",
      userName: fullName,
      status: "PENDING",
    }).catch((err) => {
      console.error("Gagal mengirim email verifikasi diajukan:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Pengajuan verifikasi berhasil dikirim.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim pengajuan." },
      { status: 500 }
    );
  }
}