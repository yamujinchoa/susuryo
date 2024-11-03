// src/app/mypage/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UserActions from "@/app/mypage/UserActions";

export default async function MyPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Welcome, {data.user.email}</h1>
      <UserActions userId={data.user.id} />
    </div>
  );
}
