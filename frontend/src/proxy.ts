import { NextRequest, NextResponse } from "next/server";

// Daftar halaman yang HANYA untuk orang yang BELUM login
const authRoutes = ["/login", "/register"];

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
  const sessionCookie = request.cookies.get("better-auth.session_token");
  let isLoggedIn = false;

  // 2. Validasi eksistensi & expiry
  if (sessionCookie?.value && !isJwtExpired(sessionCookie.value)) {
    isLoggedIn = true;
  }

  const isAuthRoute = authRoutes.includes(pathname);

  // Kasus 1: Belum login (atau token kedaluwarsa) dan mencoba akses rute terproteksi
  if (!isLoggedIn && !isAuthRoute) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    
    // Clean up: Hapus cookie yang expired agar browser bersih
    if (sessionCookie?.value) {
      response.cookies.delete("better-auth.session_token");
    }
    
    return response;
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
