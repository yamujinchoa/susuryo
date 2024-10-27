// src/lib/supabaseClient.ts
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// 클라이언트 측에서 사용할 Supabase 인스턴스
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 측에서 Supabase 클라이언트를 생성하는 함수
export const createServerSupabaseClient = (
  context: GetServerSidePropsContext
) => {
  return createPagesServerClient(context);
};
