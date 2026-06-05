import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Helper to get app URL
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

/**
 * Sends a beautifully styled verification email matching the theme in Photo 2.
 * Also saves a copy of the HTML locally to scratch/emails/ for easy developer preview.
 */
export async function sendVerificationEmail({
  toEmail,
  userName,
  status,
  adminNote = null,
}: {
  toEmail: string;
  userName: string;
  status: VerificationStatus;
  adminNote?: string | null;
}) {
  let subject = "";
  let title = "";
  let messageContent = "";
  let buttonText = "";
  let buttonUrl = "";

  if (status === "PENDING") {
    subject = "Pengajuan Verifikasi Alumni - Alumni Hub Beasiswa Unggulan";
    title = "Pengajuan Verifikasi Alumni";
    messageContent = `
      <p style="margin: 0 0 16px; color: #334155; font-size: 15px; line-height: 24px;">
        Halo, <strong style="color: #0f172a;">${userName}</strong> (${toEmail})
      </p>
      <p style="margin: 0 0 16px; color: #334155; font-size: 15px; line-height: 24px;">
        Terima kasih telah mengajukan verifikasi sebagai alumni di <strong>Alumni Hub Beasiswa Unggulan</strong>. 
        Tim kami telah menerima pengajuan verifikasi kamu dan akan segera melakukan pemeriksaan kesesuaian dokumen bukti yang telah dilampirkan.
      </p>
      <p style="margin: 0 0 24px; color: #334155; font-size: 15px; line-height: 24px;">
        Proses peninjauan biasanya memerlukan waktu 1-3 hari kerja. Kamu dapat memantau status pengajuan kamu secara berkala melalui platform.
      </p>
    `;
    buttonText = "Cek Status Pengajuan";
    buttonUrl = `${APP_URL}/verify-alumni`;
  } else if (status === "VERIFIED") {
    subject = "Verifikasi Alumni Disetujui - Alumni Hub Beasiswa Unggulan";
    title = "Verifikasi Alumni Disetujui";
    messageContent = `
      <p style="margin: 0 0 16px; color: #334155; font-size: 15px; line-height: 24px;">
        Halo, <strong style="color: #0f172a;">${userName}</strong>
      </p>
      <p style="margin: 0 0 16px; color: #334155; font-size: 15px; line-height: 24px; font-weight: 500; color: #059669;">
        Selamat! Pengajuan verifikasi alumni kamu telah disetujui oleh admin.
      </p>
      <p style="margin: 0 0 24px; color: #334155; font-size: 15px; line-height: 24px;">
        Sekarang kamu telah resmi terdaftar sebagai <strong>Alumni Verified</strong>. 
        Kamu sudah bisa mengakses dashboard alumni, melengkapi profil profesional, membagikan artikel/post komunitas, membuat event alumni, dan mengunggah resource pembelajaran.
      </p>
    `;
    buttonText = "Masuk ke Alumni Hub";
    buttonUrl = `${APP_URL}/alumni`;
  } else if (status === "REJECTED") {
    subject = "Verifikasi Alumni Ditolak - Alumni Hub Beasiswa Unggulan";
    title = "Verifikasi Alumni Ditolak";
    messageContent = `
      <p style="margin: 0 0 16px; color: #334155; font-size: 15px; line-height: 24px;">
        Halo, <strong style="color: #0f172a;">${userName}</strong>
      </p>
      <p style="margin: 0 0 16px; color: #334155; font-size: 15px; line-height: 24px; color: #dc2626; font-weight: 500;">
        Mohon maaf, pengajuan verifikasi alumni kamu saat ini belum dapat disetujui oleh admin.
      </p>
      
      <!-- Admin Notes Box -->
      <div style="margin: 20px 0; padding: 16px; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 12px; text-align: left;">
        <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #991b1b; text-transform: uppercase; letter-spacing: 0.05em;">
          Catatan Admin:
        </p>
        <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 20px; font-style: italic;">
          "${adminNote || "Dokumen bukti yang dilampirkan kurang jelas atau tidak sesuai."}"
        </p>
      </div>

      <p style="margin: 0 0 24px; color: #334155; font-size: 15px; line-height: 24px;">
        Jangan berkecil hati, kamu masih dapat mengajukan kembali dengan melampirkan berkas bukti yang valid melalui halaman pengajuan verifikasi jika kuota resubmit kamu masih tersedia (maksimal 3 kali pengajuan).
      </p>
    `;
    buttonText = "Ajukan Ulang Verifikasi";
    buttonUrl = `${APP_URL}/verify-alumni`;
  }

  // Beautiful HTML Email Template (centered card layout matching Photo 2 / user screenshot)
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center" valign="top">
        <!-- Logo Kemendikbud (Tut Wuri Handayani) -->
        <table width="100%" max-width="580px" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; margin-bottom: 24px; text-align: center;">
          <tr>
            <td align="center" style="padding-bottom: 8px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/240px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png" alt="Logo Kemendikbud" style="width: 80px; height: auto; display: block;" />
            </td>
          </tr>
          <tr>
            <td align="center">
              <h2 style="margin: 4px 0 2px; font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.025em;">
                Alumni Hub Beasiswa Unggulan
              </h2>
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
                Puslapdik Kemendikdasmen
              </p>
            </td>
          </tr>
        </table>

        <!-- Main Card -->
        <table width="100%" max-width="580px" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden; border: 1px solid #e2e8f0;">
          <!-- Content Section -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                ${title}
              </h3>
              ${messageContent}
              
              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px; margin-bottom: 8px;">
                <tr>
                  <td align="center">
                    <a href="${buttonUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #2563eb; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2); transition: background-color 0.2s;">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #f1f5f9; width: 100%;"></div>
            </td>
          </tr>

          <!-- Footer fallback link section -->
          <tr>
            <td style="padding: 24px 40px 40px; font-size: 12px; color: #64748b; line-height: 20px; background-color: #fafafa;">
              Jika tombol tidak berfungsi, salin dan buka link berikut di browser Anda:
              <br>
              <a href="${buttonUrl}" target="_blank" style="color: #2563eb; text-decoration: none; word-break: break-all; display: block; margin-top: 8px; font-weight: 500;">
                ${buttonUrl}
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Bottom Footer -->
        <table width="100%" max-width="580px" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; margin-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 12px; color: #94a3b8; line-height: 16px;">
              &copy; ${new Date().getFullYear()} Alumni Hub Beasiswa Unggulan. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 1. SAVE COPY TO LOCAL SCRATCH DIRECTORY FOR DEVELOPER PREVIEW
  try {
    const scratchDir = "/Users/syahlasandiani/Desktop/pkl-alumnihub/scratch/emails";
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    const safeEmail = toEmail.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `email_${safeEmail}_${status}_${Date.now()}.html`;
    const filePath = path.join(scratchDir, filename);
    fs.writeFileSync(filePath, htmlContent, "utf8");
    console.log(`[Email Mock] Saved preview copy to file://${filePath}`);
  } catch (err) {
    console.error("Gagal menyimpan preview email ke local:", err);
  }

  // 2. SEND REAL EMAIL VIA SMTP IF ENV IS CONFIGURED
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 3000, // 3 seconds timeout
        greetingTimeout: 3000,
        socketTimeout: 3000,
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || `"Alumni Hub" <${smtpUser}>`,
        to: toEmail,
        subject: subject,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[SMTP] Email successfully sent to ${toEmail}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error("[SMTP] Gagal mengirim email via SMTP:", err);
      // Don't crash the server, fallback to success since mock copy is saved
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[Email Mock] SMTP settings not fully configured in env. Email printed to log.`);
    return { success: true, mock: true };
  }
}
