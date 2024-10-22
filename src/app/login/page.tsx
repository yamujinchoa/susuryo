// src/app/login/page.tsx
"use client";
import { useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captcha = useRef<HCaptcha | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        if (captcha.current) {
          captcha.current.resetCaptcha(); // 실패 시 CAPTCHA 초기화
          setCaptchaToken(null); // 토큰 초기화
        }
      } else {
        console.log("Login successful");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      if (captcha.current) {
        captcha.current.resetCaptcha(); // 예기치 않은 오류 발생 시 CAPTCHA 초기화
        setCaptchaToken(null); // 토큰 초기화
      }
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleLogin} className="w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* hCaptcha 컴포넌트 추가 */}
        <HCaptcha
          ref={captcha}
          sitekey="2104412e-4560-49ba-add4-f7226a444562"
          onVerify={(token) => {
            setCaptchaToken(token);
          }}
        />
        <button type="submit" className="btn btn-primary mt-3">
          로그인
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
}
