// src/app/login/page.tsx
"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState, useEffect } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    // token이 설정되면 login 호출
    if (token && formData) {
      formData.append("token", token);
      login(formData);
    }
  }, [token, formData]);

  const handleAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 기본 폼 제출 방지

    const newFormData = new FormData(event.currentTarget);
    setFormData(newFormData); // formData 저장

    // 토큰이 없으면 캡챠 실행
    if (!token) {
      captchaRef.current?.execute();
      return;
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6">
          <form className="mt-4" onSubmit={handleAction}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                required
              />
            </div>
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              onVerify={setToken}
              size="invisible"
            />
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
