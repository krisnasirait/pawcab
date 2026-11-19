"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsEye, BsEyeSlash, BsShieldLock } from "react-icons/bs";
import { PiPawPrint } from "react-icons/pi";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter the admin password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-midnight flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pawcab-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-sand-beige/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-warm-ivory/95 backdrop-blur-md rounded-3xl shadow-2xl border border-sand-beige/40 p-8 sm:p-10 relative z-10">
        {/* Header with Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="inline-block mb-4 group">
            <div className="relative w-16 h-16 rounded-2xl bg-deep-midnight flex items-center justify-center p-2.5 shadow-md group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-pawcab.png"
                alt="The PawCab Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pawcab-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-warm-taupe">
              Internal CMS
            </span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-deep-midnight">
            The PawCab Admin
          </h1>
          <p className="text-xs sm:text-sm text-warm-taupe mt-1.5">
            Manage website content, pricing, stories & GitHub sync.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
              !
            </div>
            <div>{error}</div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-warm-taupe mb-2">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-deep-midnight/40">
                <BsShieldLock className="text-base" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                autoFocus
                className="w-full pl-10 pr-11 py-3 bg-white/90 border border-warm-taupe rounded-xl text-deep-midnight text-sm placeholder:text-warm-taupe focus:outline-none focus:ring-2 focus:ring-pawcab-gold/70 focus:border-pawcab-gold transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-taupe hover:text-deep-midnight transition"
              >
                {showPassword ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-deep-midnight hover:bg-deep-midnight/90 text-white rounded-xl font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <BsArrowRight className="group-hover:translate-x-1 transition-transform text-pawcab-gold" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-sand-beige/40 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1.5 text-xs text-warm-taupe">
            <PiPawPrint className="text-pawcab-gold" />
            <span>GitHub Contents API & Classic PAT Synced</span>
          </div>
          <Link
            href="/"
            className="text-xs text-warm-taupe hover:text-deep-midnight transition font-medium"
          >
            ← Return to PawCab Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-deep-midnight flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

