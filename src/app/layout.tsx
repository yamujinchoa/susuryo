// src/app/layout.tsx
import "./globals.css";
import Script from "next/script";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>크몽 전문가 수수료 계산기 | 쉽고 빠른 수수료 계산</title>
        <meta
          name="description"
          content="크몽 전문가 수수료 계산기를 사용하여 쉽게 판매 금액의 수수료와 최종 수익을 계산하세요."
        />
        <meta
          name="keywords"
          content="크몽, 전문가, 수수료 계산기, 수수료 계산, 판매 수수료, kmong, 크몽 수수료 계산기, 수수료, 계산기, 수수료닷컴"
        />
        <meta property="og:title" content="크몽 전문가 수수료 계산기" />
        <meta
          property="og:description"
          content="크몽 전문가 수수료 계산기를 사용하여 쉽게 수수료와 최종 수익을 계산하세요."
        />
        <meta property="og:image" content="URL_TO_YOUR_IMAGE" />
        <meta property="og:url" content="https://www.susuryo.com" />
        <meta
          name="google-site-verification"
          content="B6fMSQ2WrcWxmg2xkoaLV50upLj7JtaxpUd9Zo-c-40"
        />
        <meta name="google-adsense-account" content="ca-pub-1338653742640391" />

        {/* Bootstrap JavaScript and Popper.js */}
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
                </ul>
              </div>
            </div>
          </nav>
          {/* Page Title */}
        </header>
        <main>{children}</main>
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