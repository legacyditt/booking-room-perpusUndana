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
