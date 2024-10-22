// src/app/layout.tsx
"use client"; // 이 줄을 추가하여 컴포넌트를 클라이언트 컴포넌트로 선언

import "./globals.css";
import Script from "next/script";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();
  }, []);

  return (
    <html lang="ko">
      <head>
        {/* Favicon 설정 */}
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        {/* SEO 및 Open Graph 설정 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          크몽 전문가 수수료 계산기 | 수수료닷컴 (프리랜서, 인디해커)
        </title>
        <meta
          name="title"
          content="크몽 전문가 수수료 계산기 | 수수료닷컴 (프리랜서, 인디해커)"
        />

        <meta
          name="description"
          content="크몽 전문가 수수료 계산기를 사용하여 쉽게 판매 금액의 수수료와 최종 수익을 계산하세요."
        />
        <meta
          name="keywords"
          content="크몽, 전문가, 수익금, 수익금 계산기, 수수료 계산기, 수수료 계산, 판매 수수료, kmong, 크몽 수수료, 수수료, 계산기, 수수료닷컴, 숨고, 탈잉, 프리랜서, 홍보, 위시켓, 프리모아, 인디해커"
        />

        {/* Open Graph */}
        <meta property="og:title" content="크몽 전문가 수수료 계산기" />
        <meta
          property="og:description"
          content="크몽 전문가 수수료 계산기를 사용하여 쉽게 수수료와 최종 수익을 계산하세요."
        />
        <meta
          property="og:image"
          content="https://www.susuryo.com/og-image.png"
        />
        <meta property="og:url" content="https://www.susuryo.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="크몽 전문가 수수료 계산기" />
        <meta
          name="twitter:description"
          content="크몽 전문가 수수료 계산기를 사용하여 쉽게 수수료와 최종 수익을 계산하세요."
        />
        <meta
          name="twitter:image"
          content="https://www.susuryo.com/og-image.png"
        />
        <meta name="twitter:site" content="@susuryo_com" />
        <meta name="twitter:creator" content="@susuryo_com" />

        {/* Google verification */}
        <meta
          name="google-site-verification"
          content="B6fMSQ2WrcWxmg2xkoaLV50upLj7JtaxpUd9Zo-c-40"
        />
        <meta name="google-adsense-account" content="ca-pub-1338653742640391" />

        {/* Naver verification */}
        <meta
          name="naver-site-verification"
          content="e570ba8990227cdc11cb8cd1130662fb4912855a"
        />

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
      </head>
      <body className="bg-light">
        <header>
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
              <a className="navbar-brand" href="/">
                <img
                  src="/favicon.ico" // favicon 경로를 지정합니다
                  alt="수수료닷컴 로고" // 대체 텍스트
                  width="30" // 원하는 너비로 설정
                  height="30" // 원하는 높이로 설정
                  className="d-inline-block align-top me-2" // 오른쪽 마진을 추가
                />
                수수료닷컴
              </a>
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
                    <a className="nav-link" href="/promo-room">
                      크몽인 홍보방
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/members-room">
                      크몽인들의 밤
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/talk">
                      크몽인 TALK
                    </a>
                  </li>
                  {user ? (
                    // 로그인 상태일 때 마이페이지 버튼
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
                              setUser(null);
                            }}
                          >
                            로그아웃
                          </button>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    // 로그아웃 상태일 때 로그인/회원가입 버튼
                    <>
                      <li className="nav-item">
                        <Link href="/login" className="nav-link">
                          로그인
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="/signup" className="nav-link">
                          회원가입
                        </Link>
                      </li>
                    </>
                  )}
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
              className="img-fluid" // 반응형 이미지
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
