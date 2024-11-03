// app/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const protectedRoutes = ["/talk/create", "/promo-room/create"];
const publicRoutes = ["/login", "signup", "/"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const session = await updateSession(request);
  console.log("middleware session : ", session);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  const matchingRoute = publicRoutes.find((route) =>
    request.nextUrl.pathname.includes(route)
  );

  if (matchingRoute && session) {
    return NextResponse.redirect(new URL(matchingRoute, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
