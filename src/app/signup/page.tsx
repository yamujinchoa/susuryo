// src/app/signup/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captcha = useRef<HCaptcha | null>(null);

  // 비밀번호와 비밀번호 확인 일치 여부 검증
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError(null);
    }
  }, [password, confirmPassword]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("CAPTCHA 인증을 완료해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          avatar_url: avatarUrl,
        },
        captchaToken,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      setMessage(
        "가입이 성공적으로 완료되었습니다. 이메일 인증을 완료해주세요."
      );
      setError(null);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSignup} className="w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            사용자 이름
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="사용자 이름을 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="avatarUrl" className="form-label">
            아바타 URL
          </label>
          <input
            type="text"
            className="form-control"
            id="avatarUrl"
            placeholder="아바타 URL을 입력하세요"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            비밀번호 (소문자, 대문자, 숫자, 기호)
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            비밀번호 확인
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && <p className="text-danger mt-1">{passwordError}</p>}
        </div>
        {/* hCaptcha 컴포넌트 추가 */}
        <div className="mb-3">
          <HCaptcha
            ref={captcha}
            sitekey="2104412e-4560-49ba-add4-f7226a444562"
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          가입하기
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
        {message && <p className="text-success mt-3">{message}</p>}
      </form>
    </div>
  );
}
