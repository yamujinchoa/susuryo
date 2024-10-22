// src/app/mypage/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      } else {
        window.location.href = "/login"; // 로그인이 안 되어있으면 로그인 페이지로 리다이렉트
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="container mt-5">
      {user ? (
        <>
          <h1 className="mb-4">Welcome, {user.email}</h1>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log Out
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
