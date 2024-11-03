// app/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  return response;
}

export const config = {
  matcher: [
    // 미들웨어가 적용될 경로 설정
    "/talk/create",
    "/promo-room/create",
    // 추가 경로 설정 가능
  ],
};
