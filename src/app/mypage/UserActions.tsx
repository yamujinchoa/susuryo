"use client";
import { supabase } from "../../lib/supabaseClient";

interface UserActionsProps {
  userId: string;
}

export default function UserActions({ userId }: UserActionsProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        userId
      );
      if (deleteError) {
        alert("계정 삭제에 실패했습니다. 다시 시도해 주세요.");
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
        alert("계정이 성공적으로 삭제되었습니다.");
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      <button className="btn btn-secondary me-2" onClick={handleLogout}>
        Log Out
      </button>
      <button className="btn btn-danger" onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </>
  );
}
