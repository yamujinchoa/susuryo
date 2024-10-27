import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// middleware 함수
export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const accessToken = cookies.get("sb-access-token")?.value;

  // 쿠키가 없는 경우
  if (!accessToken) {
    // 강제 로그아웃을 위한 응답 생성
    const response = NextResponse.redirect(new URL("/login", request.url));

    // 모든 supabase 관련 쿠키 제거
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");

    return response;
  }

  // JWT 토큰 검증
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    // 토큰이 유효하지 않은 경우도 강제 로그아웃
    const response = NextResponse.redirect(new URL("/login", request.url));

    // 모든 supabase 관련 쿠키 제거
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");

    return response;
  }

  return NextResponse.next();
}

// matcher 설정
export const config = {
  matcher: ["/talk/create", "/promo-room/create"],
};
