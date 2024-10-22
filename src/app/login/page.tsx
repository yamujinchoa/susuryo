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

    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // 로그인 성공 시 메인 페이지로 리다이렉션
      window.location.href = "/"; // 메인 페이지 경로로 수정
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleLogin} className="row justify-content-center">
        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="가입한 이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6 mb-3">
          {/* hCaptcha 컴포넌트 추가 */}
          <HCaptcha
            ref={captcha}
            sitekey="2104412e-4560-49ba-add4-f7226a444562"
            onVerify={(token) => setCaptchaToken(token)}
            size="compact" // HCaptcha will be responsive and smaller on mobile
          />
        </div>
        <div className="col-12 col-md-6">
          <button type="submit" className="btn btn-primary w-100">
            로그인
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </form>
    </div>
  );
}
