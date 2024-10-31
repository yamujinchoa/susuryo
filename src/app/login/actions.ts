// src/app/login/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  console.log("Supabase Client:", supabase);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const captchaToken = formData.get("token") as string;

  // 각 값 콘솔 출력
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Captcha Token:", captchaToken);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  });

  if (error) {
    console.log("Login Error:", error.message);
    return redirect("/error");
  }

  console.log("Login successful");
  revalidatePath("/", "layout");
  redirect("/");
}
