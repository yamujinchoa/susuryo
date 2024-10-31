//src/app/login/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  console.log("Supabase Client:", supabase);

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Login Error:", error.message);
    return redirect("/error"); // error가 있을 경우에만 /error로 리디렉션
  }

  console.log("Login successful");
  revalidatePath("/", "layout"); // error가 없을 경우에만 revalidate 및 /로 리디렉션
  redirect("/");
}
