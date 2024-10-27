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
  const accessToken = cookies.get("sb-access-token")?.value; // Supabase에서 발급된 JWT 토큰

  if (!accessToken) {
    // 로그인된 사용자가 아니면 리다이렉트
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // JWT 토큰 검증
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    // 유효하지 않은 토큰이거나 인증되지 않은 경우 리다이렉트
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 로그인된 사용자는 요청을 그대로 통과
  return NextResponse.next();
}

// matcher 설정
export const config = {
  matcher: ["/talk/create", "/promo-room/create"],
};
