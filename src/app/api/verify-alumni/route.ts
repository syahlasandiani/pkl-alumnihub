import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, verification_status, account_status")
      .eq("id", user.id)
      .single();

    if (!profile || profile.account_status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Akun tidak aktif atau profil tidak ditemukan." },
        { status: 403 }
      );
    }

    if (profile.role === "ADMIN" || profile.verification_status === "VERIFIED") {
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

    const { error: insertError } = await supabase
      .from("verification_requests")
      .insert({
        user_id: user.id,
        full_name: fullName,
        intake_year: intakeYear,
        program,
        institution,
        document_url: documentUrl,
        status: "PENDING",
        submission_number: nextSubmissionNumber,
        admin_note: null,
        reviewed_by: null,
        reviewed_at: null,
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message || "Gagal menyimpan pengajuan." },
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