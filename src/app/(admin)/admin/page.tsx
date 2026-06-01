"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect already-authenticated users straight to the dashboard
  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setAuthChecked(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace("/admin/dashboard");
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/dashboard`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  // ── Loading / auth check ──────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="h-6 w-6 animate-spin text-ink/30" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-terracotta/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-coral/[0.05] blur-3xl" />

      {/* Back to site */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-1.5 text-xs text-ink/40 transition-colors hover:text-ink/70"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to site
      </Link>

      {/* Card */}
      <div className="relative w-full max-w-[380px] rounded-2xl bg-white p-8 shadow-card">
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <p className="font-serif text-[1.6rem] font-semibold leading-none text-terracotta">
            arranged co
          </p>
          <p className="mt-2 text-sm text-ink/40">Admin access</p>
        </div>

        {/* ── Success state ── */}
        {status === "sent" ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/[0.10]">
              <Mail className="h-5 w-5 text-terracotta" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">
                Check your email
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                We sent a magic link to{" "}
                <span className="font-medium text-ink/80">{email}</span>.
                Click the link to sign in.
              </p>
            </div>
            <button
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
              className="text-xs text-ink/35 underline underline-offset-2 transition-colors hover:text-ink/60"
            >
              Try a different email
            </button>
          </div>
        ) : (
          /* ── Magic link form ── */
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm leading-relaxed text-ink/55">
              Enter your email and we&apos;ll send you a magic link to sign in
              — no password needed.
            </p>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold uppercase tracking-wider text-ink/45"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                disabled={status === "loading"}
                className="h-10 w-full rounded-xl border border-ink/[0.12] bg-[#FAF8F5] px-3.5 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 disabled:opacity-50"
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-cta-gradient text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send magic link"
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-ink/25">
        Only authorised team members can sign in.
      </p>
    </div>
  );
}
