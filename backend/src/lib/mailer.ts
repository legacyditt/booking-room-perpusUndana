import nodemailer from "nodemailer";

const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  resetLink: string,
): Promise<void> => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `[mailer] EMAIL_USER/EMAIL_APP_PASSWORD belum diisi. Reset link: ${resetLink}`,
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: `Perpustakaan Undana <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Kata Sandi - Booking Ruangan Perpustakaan",
      text: `Klik tautan berikut untuk mereset kata sandi Anda: ${resetLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f766e;">Reset Kata Sandi</h2>
          <p>Halo,</p>
          <p>Kami menerima permintaan untuk mereset kata sandi akun Anda. Klik tombol di bawah untuk melanjutkan:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0f766e; color: #ffffff; text-decoration: none; border-radius: 8px;">Reset Kata Sandi</a>
          </p>
          <p style="font-size: 12px; color: #64748b;">Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset kata sandi, abaikan email ini.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[mailer] Gagal mengirim email:", err);
    throw err;
  }
};

export const sendBookingCancellationEmail = async (
  to: string,
  userName: string,
  roomName: string,
  date: string,
  sessionTime: string,
): Promise<void> => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `[mailer] EMAIL_USER belum diisi. Gagal kirim email batal ke: ${to}`,
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: `Perpustakaan Undana <${process.env.EMAIL_USER}>`,
      to,
      subject: "Pemesanan Ruangan Dibatalkan - Perpustakaan Undana",
      text: `Halo ${userName}, pemesanan Anda untuk ${roomName} pada ${date} (${sessionTime}) telah berhasil dibatalkan.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #ef4444;">Pemesanan Dibatalkan</h2>
          <p>Halo <strong>${userName}</strong>,</p>
          <p>Pemesanan ruangan Anda telah berhasil dibatalkan sesuai dengan permintaan Anda. Berikut adalah detail pemesanan yang dibatalkan:</p>
          <ul style="background-color: #f8fafc; padding: 16px; border-radius: 8px; list-style: none; margin: 16px 0;">
            <li style="margin-bottom: 8px;"><strong>Ruangan:</strong> ${roomName}</li>
            <li style="margin-bottom: 8px;"><strong>Tanggal:</strong> ${date}</li>
            <li><strong>Sesi:</strong> ${sessionTime}</li>
          </ul>
          <p style="font-size: 14px; color: #475569;">Jika Anda membutuhkan ruangan di waktu lain, silakan buat pemesanan baru melalui sistem kami.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[mailer] Gagal mengirim email pembatalan:", err);
  }
};

export const sendBookingStatusUpdateEmail = async (
  to: string,
  userName: string,
  roomName: string,
  newStatus: string,
): Promise<void> => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `[mailer] EMAIL_USER belum diisi. Gagal kirim email status ke: ${to}`,
    );
    return;
  }

  const isApproved = newStatus === "APPROVED";
  const color = isApproved ? "#0f766e" : "#ef4444";
  const statusLabel = isApproved ? "DISETUJUI" : "DITOLAK";

  try {
    await transporter.sendMail({
      from: `Perpustakaan Undana <${process.env.EMAIL_USER}>`,
      to,
      subject: `Status Pemesanan Ruangan: ${statusLabel} - Perpustakaan Undana`,
      text: `Halo ${userName}, status pemesanan Anda untuk ${roomName} telah diperbarui menjadi: ${statusLabel}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: ${color};">Status Pemesanan Diperbarui</h2>
          <p>Halo <strong>${userName}</strong>,</p>
          <p>Pemesanan Anda untuk ruangan <strong>${roomName}</strong> telah ditinjau dan statusnya saat ini adalah: <strong style="color: ${color};">${statusLabel}</strong>.</p>
          <p style="font-size: 14px; color: #475569; margin-top: 24px;">Silakan cek aplikasi untuk detail lebih lanjut.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[mailer] Gagal mengirim email update status:", err);
  }
};
