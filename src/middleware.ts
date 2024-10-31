// src 레벨에 생성하는 nextjs 레이어 middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 여기에 다른 미들웨어 설정을 넣어도 됩니다
    "/talk/create",
    "/promo-room/create",
  ],
};
