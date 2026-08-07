import { NextRequest, NextResponse } from "next/server";

// Daftar halaman yang WAJIB login
const protectedRoutes = ["/dashboard"];
// Daftar halaman yang HANYA untuk orang yang BELUM login
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah ada cookie sesi dari BetterAuth
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isLoggedIn = !!sessionCookie?.value;

  // Kasus 1: Belum login tapi mau masuk dashboard -> Lempar ke login
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kasus 2: Sudah login tapi mau buka halaman login/register -> Lempar ke dashboard
  if (authRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi agar middleware tidak ikut mengecek file gambar, api, dan statis lainnya
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
