// src/app/login/page.tsx
"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const handleAction = async (formData: FormData) => {
    if (!token) {
      captchaRef.current?.execute();
      return;
    }
    formData.append("token", token);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6">
          <form className="mt-4">
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
              <button
                className="btn btn-primary"
                formAction={async (formData) => {
                  await handleAction(formData);
                  await login(formData);
                }}
              >
                로그인
              </button>
              <button
                className="btn btn-secondary"
                formAction={async (formData) => {
                  await handleAction(formData);
                  await signup(formData);
                }}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
