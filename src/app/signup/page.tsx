// src/app/signup/page.tsx
"use client";
import { useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captcha = useRef<HCaptcha | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken, // hCaptcha 토큰을 포함
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* hCaptcha 컴포넌트 추가 */}
      <HCaptcha
        ref={captcha}
        sitekey="2104412e-4560-49ba-add4-f7226a444562"
        onVerify={(token) => {
          setCaptchaToken(token);
        }}
      />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
}
