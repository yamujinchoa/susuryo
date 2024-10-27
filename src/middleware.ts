// middleware.ts

import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

// middleware 함수
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

// matcher 설정
export const config = {
  matcher: ["/talk/create", "/promo-room/create"],
};
