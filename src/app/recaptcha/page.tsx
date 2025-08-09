// app/recaptcha/page.tsx

"use client";
import { Suspense } from "react";
export const runtime = 'edge';
export const preferredRegion = 'auto';
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

function RecaptchaInner() {
  const [ready, setReady]   = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_ID as string;
  const next    = useSearchParams().get("next") || "/";
  const router  = useRouter();

  // 當腳本載入完成後啟用按鈕
  useEffect(() => {
    if (!window.grecaptcha) return;
    window.grecaptcha.ready(() => setReady(true));
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const token: string = await window.grecaptcha.execute(siteKey, {
        action: "access",
      });

      const res = await fetch("/api/recaptcha-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        router.replace(next);
      } else {
        const { error } = await res.json();
        setError(error || "Verification failed, try again.");
      }
    } catch (err) {
      setError("Execution error, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>reCAPTCHA Verification</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold">Human Verification</h1>
        <button
          onClick={handleVerify}
          disabled={!ready || loading}
          className="px-6 py-3 rounded bg-primary-600 text-white disabled:opacity-50"
        >
          {loading ? "Verifying…" : "I'm not a robot"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </div>

      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="afterInteractive"
        onLoad={() => {
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => setReady(true));
          }
        }}
      />
    </>
  );
}

export default function RecaptchaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <RecaptchaInner />
    </Suspense>
  );
}