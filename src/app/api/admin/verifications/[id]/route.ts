import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

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
      .select("id, user_id, status")
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

    const nextStatus = action === "APPROVE" ? "VERIFIED" : "REJECTED";

    const { error: requestUpdateError } = await supabase
      .from("verification_requests")
      .update({
        status: nextStatus,
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

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        verification_status: nextStatus,
      })
      .eq("id", verificationRequest.user_id);

    if (profileUpdateError) {
      return NextResponse.json(
        { error: profileUpdateError.message || "Gagal update status user." },
        { status: 500 }
      );
    }

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