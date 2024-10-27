// app/api/auth/set-refresh-token/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { refreshToken } = await request.json();

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token is required" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({
    message: "Refresh token set successfully",
  });
  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
