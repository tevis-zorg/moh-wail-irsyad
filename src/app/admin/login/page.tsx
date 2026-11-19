"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, type FormEvent } from "react";

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "32px 20px",
  background:
    "radial-gradient(ellipse at 50% 0%, rgba(117, 88, 55, 0.16), transparent 48%), #11100f",
  color: "#f2eee8",
  fontFamily: "Georgia, 'Times New Roman', serif",
} as const;

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  border: "1px solid #45413c",
  borderRadius: 2,
  background: "#171615",
  color: "#f2eee8",
  padding: "13px 14px",
  font: "15px Arial, sans-serif",
  outlineColor: "#c5a77d",
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const normalizedEmail = email.trim();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!normalizedEmail || !password) {
      setErrorMessage("Enter your email and password to continue.");
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      setErrorMessage("Enter a valid email address and password.");
      return;
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      setErrorMessage("Sign-in is temporarily unavailable. Please try again later.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error || !data.user) {
        setErrorMessage("Unable to sign in with these credentials.");
        setPassword("");
        return;
      }

      const { data: claimData, error: claimError } = await supabase.auth.getClaims();
      const appMetadata = claimData?.claims?.app_metadata as
        | { role?: unknown }
        | undefined;

      if (claimError || appMetadata?.role !== "admin") {
        await supabase.auth.signOut({ scope: "local" });
        setErrorMessage("Unable to sign in with these credentials.");
        setPassword("");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setErrorMessage("Sign-in is temporarily unavailable. Please try again later.");
      setPassword("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={pageStyle}>
      <section
        aria-labelledby="admin-login-title"
        style={{
          width: "min(100%, 420px)",
          borderTop: "1px solid #887354",
          padding: "34px 4px 8px",
        }}
      >
        <p
          style={{
            margin: "0 0 15px",
            color: "#c5a77d",
            font: "11px Arial, sans-serif",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Moh. Wail Irsyad
        </p>
        <h1
          id="admin-login-title"
          style={{
            margin: 0,
            fontSize: "clamp(32px, 7vw, 46px)",
            fontWeight: 400,
            letterSpacing: "-0.035em",
          }}
        >
          Admin access
        </h1>
        <p
          style={{
            margin: "12px 0 30px",
            color: "#a9a39b",
            font: "14px/1.7 Arial, sans-serif",
          }}
        >
          Sign in to manage portfolio materials.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: 8,
              color: "#ddd6cb",
              font: "12px Arial, sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            style={inputStyle}
          />

          <label
            htmlFor="password"
            style={{
              display: "block",
              margin: "20px 0 8px",
              color: "#ddd6cb",
              font: "12px Arial, sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            style={inputStyle}
          />

          <div
            aria-live="polite"
            style={{ minHeight: 42, paddingTop: 10, color: "#e3a79c", fontSize: 13 }}
          >
            {errorMessage ? <p style={{ margin: 0 }}>{errorMessage}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              minHeight: 48,
              border: "1px solid #c5a77d",
              borderRadius: 2,
              background: isSubmitting ? "#77664d" : "#c5a77d",
              color: "#171411",
              cursor: isSubmitting ? "wait" : "pointer",
              font: "600 12px Arial, sans-serif",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
