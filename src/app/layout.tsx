// src/app/layout.tsx
"use client";
import "./globals.css";
import Script from "next/script";
import { ReactNode } from "react";
import Link from "next/link";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const supabase = useSupabaseClient(); // Supabase 클라이언트 설정
  const session = useSession(); // 현재 세션 가져오기

  return (
    <html lang="ko">
      <head>
        {/* 기존의 SEO 및 favicon 설정 유지 */}
        {/* ... */}

        {/* Google Analytics 스크립트 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-28D1ZXMCMR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-28D1ZXMCMR');
          `}
        </Script>

        {/* Bootstrap JavaScript 및 Popper.js */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"
          strategy="afterInteractive"
        />

        {/* Hcaptcha.com */}
        <Script
          src="https://hcaptcha.com/1/api.js"
          strategy="afterInteractive"
          async
          defer
        ></Script>
      </head>
      <body className="bg-light">
        <header>
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
              <Link href="/" className="navbar-brand">
                <img
                  src="/favicon.ico"
                  alt="수수료닷컴 로고"
                  width="30"
                  height="30"
                  className="d-inline-block align-top me-2"
                />
                수수료닷컴
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link href="/promo-room" className="nav-link">
                      크몽인 홍보방
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/members-room" className="nav-link">
                      크몽인들의 밤
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/talk" className="nav-link">
                      크몽인 TALK
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {session ? (
                        <>
                          {/* 로그인 상태일 때 */}
                          <li>
                            <Link href="/mypage" className="dropdown-item">
                              마이페이지
                            </Link>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={async () => {
                                await supabase.auth.signOut();
                              }}
                            >
                              로그아웃
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          {/* 로그아웃 상태일 때 */}
                          <li>
                            <Link href="/login" className="dropdown-item">
                              로그인
                            </Link>
                          </li>
                          <li>
                            <Link href="/signup" className="dropdown-item">
                              회원가입
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main>
          <h1 className="visually-hidden">
            수수료닷컴 - 크몽 수익금 계산기와 프리랜서, 인디해커 커뮤니티
          </h1>
          <div className="text-center">
            <img
              src="/banner-image.png"
              alt="수수료닷컴 - 크몽 수익금 계산기와 프리랜서, 인디해커 커뮤니티"
              className="img-fluid"
            />
          </div>
          {children}
        </main>
        <footer className="bg-dark text-light text-center p-3 mt-5">
          <div className="container">
            <p>&quot;세상의 모든 수수료를 계산해드립니다!&quot;</p>
            <p>
              필요한 계산기가 있으면 언제든 연락 주세요: yamujinchoa@gmail.com
            </p>
            <p>Privacy Policy | Terms of Service</p>
            <p>© 2024 수수료닷컴. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
