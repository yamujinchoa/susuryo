// src/app/mypage/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          window.location.href = "/login";
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    // Supabase에서 로그아웃 처리
    await supabase.auth.signOut();

    // 서버 측 API를 호출하여 refresh token을 httpOnly 쿠키에서 삭제
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    // 로그아웃 후 로그인 페이지로 리다이렉트
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      // Supabase에서 로그아웃 처리
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      // 계정 삭제 처리
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user?.id ?? ""
      );
      if (deleteError) {
        alert("계정 삭제에 실패했습니다. 다시 시도해 주세요.");
      } else {
        // 서버 측 API 호출하여 refresh token 쿠키 삭제
        await fetch("/api/auth/logout", {
          method: "POST",
        });

        alert("계정이 성공적으로 삭제되었습니다.");
        window.location.href = "/"; // 계정 삭제 후 홈페이지로 리다이렉트
      }
    }
  };

  return (
    <div className="container mt-5">
      {user ? (
        <>
          <h1 className="mb-4">Welcome, {user.email}</h1>
          <button className="btn btn-secondary me-2" onClick={handleLogout}>
            Log Out
          </button>
          <button className="btn btn-danger" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
