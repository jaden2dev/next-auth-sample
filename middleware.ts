import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 로그인이 안 되어 있으면 로그인 페이지로 이동
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role 기반 접근 제한 설정
  const role = token.role;

  const adminRoutes = ["/admin"];
  const userRoutes = ["/dashboard"];
  
  const path = req.nextUrl.pathname;

  if (adminRoutes.includes(path) && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url)); // 권한 없음 페이지
  }

  if (userRoutes.includes(path) && !["admin", "user"].includes(role as string)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url)); // 기본 사용자 접근 제한
  }

  return NextResponse.next();
}

// ✅ Middleware가 적용될 경로 설정
export const config = {
  matcher: ["/admin/:path*", "/settings/:path*", "/dashboard/:path*", "/profile/:path*"],
};
