import { NextRequest, NextResponse } from "next/server";

// Daftar halaman yang HANYA untuk orang yang BELUM login
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Helper function: Validasi kedaluwarsa JWT
function isJwtExpired(token: string) {
  try {
    const payloadBase64Url = token.split(".")[1];
    if (!payloadBase64Url) return true;

    // Decode base64url
    const decodedJson = Buffer.from(payloadBase64Url, "base64").toString();
    const payload = JSON.parse(decodedJson);

    // payload.exp menggunakan format Unix Timestamp (detik)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp ? payload.exp < currentTime : false;
  } catch (error) {
    // Jika gagal decode, anggap token rusak/expired
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ambil cookie sesi dari BetterAuth
  // CATATAN: BetterAuth menggunakan opaque session token (BUKAN JWT).
  // Token tidak bisa di-decode sebagai JWT. Cukup cek keberadaannya.
  // Validasi keaslian token dilakukan oleh backend saat ada request API.
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isLoggedIn = !!sessionCookie?.value;

  // Mengecek apakah pathname diawali dengan salah satu string di authRoutes
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Kasus 1: Belum login dan mencoba akses rute terproteksi
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kasus 2: Sudah login tapi mau buka halaman login/register
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|favicon.ico).*)",
  ],
};
