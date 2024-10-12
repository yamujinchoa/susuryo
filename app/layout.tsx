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
        {/* Google Analytics 스크립트를 next/script 컴포넌트로 설정 */}
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
      </head>
      <body className="bg-light">
        <header>
          <h1 className="text-center mb-4">크몽 전문가 수수료 계산기</h1>
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
