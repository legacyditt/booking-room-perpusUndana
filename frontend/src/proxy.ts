import { NextRequest, NextResponse } from "next/server";

// Daftar halaman yang HANYA untuk orang yang BELUM login
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah ada cookie sesi dari BetterAuth
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isLoggedIn = !!sessionCookie?.value;

  const isAuthRoute = authRoutes.includes(pathname);

  // Kasus 1: Belum login dan mencoba mengakses halaman selain login/register -> Wajib Login
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kasus 2: Sudah login tapi mau buka halaman login/register -> Lempar ke beranda
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi agar middleware tidak ikut mengecek file gambar, api, dan statis lainnya
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|favicon.ico).*)",
  ],
};
