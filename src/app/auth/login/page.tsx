// ─── OLD LOGIN PAGE (commented out) ──────────────────────────────────────────
"use client";
// import AuthCard from "@/features/auth/components/AuthCard";
import LoginForm from "@/features/auth/components/LoginForm";
//
// const LoginPage = () => {
//   return (
//     <div className="flex items-center justify-center my-20">
//       <AuthCard>
//        <LoginForm/>
//       </AuthCard>
//     </div>
//   );
// };
//
// export default LoginPage;
// ─────────────────────────────────────────────────────────────────────────────

// "use client";

import React, { useState } from "react";
import { useLogin, useRegister } from "@/lib/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = "signin" | "signup";

interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

// Local mock auth hook implementations are preserved here for reference,
// but the auth page now uses the shared auth hooks from `@/lib/hooks/useAuth`.
/*
function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with your real fetch
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error(await res.text());
      console.log("[useLogin] payload →", payload);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with your real fetch
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error(await res.text());
      console.log("[useRegister] payload →", payload);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading, error };
}
*/

// ─── Icons (inline SVG — no extra deps) ──────────────────────────────────────

const IconBag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconSpinner = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

function Field({ label, icon, type = "text", placeholder, value, onChange, autoComplete }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.16em", color: "rgba(255,255,255,0.35)",
      }}>{label}</span>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10,
          borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)",
          background: "", padding: "0 14px",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(249,115,22,0.55)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            fontSize: 13, fontWeight: 500, color: "#fff", padding: "12px 0",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            const parent = e.currentTarget.closest("div") as HTMLDivElement;
            if (parent) {
              parent.style.borderColor = "rgba(249,115,22,0.55)";
            }
          }}
          onBlur={(e) => {
            const parent = e.currentTarget.closest("div") as HTMLDivElement;
            if (parent) {
              parent.style.borderColor = "rgba(255,255,255,0.08)";
            }
          }}
        />
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

function PasswordField({ label, placeholder, value, onChange, autoComplete }: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.16em", color: "rgba(255,255,255,0.35)",
      }}>{label}</span>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10,
          borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)",
          background: "", padding: "0 14px",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(249,115,22,0.55)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}><IconLock /></span>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            fontSize: 13, fontWeight: 500, color: "#fff", padding: "12px 0",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            const parent = e.currentTarget.closest("div") as HTMLDivElement;
            if (parent) {
              parent.style.borderColor = "rgba(249,115,22,0.55)";
            }
          }}
          onBlur={(e) => {
            const parent = e.currentTarget.closest("div") as HTMLDivElement;
            if (parent) {
              parent.style.borderColor = "rgba(255,255,255,0.08)";
            }
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", padding: 0, display: "flex", flexShrink: 0,
            transition: "color 0.15s",
          }}
          aria-label={show ? "Hide password" : "Show password"}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f97316")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)")}
        >
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
  );
}

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

function Benefit({ icon, title, text }: BenefitProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#f97316",
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>{text}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ShopFresherzAuth() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const isSignup = mode === "signup";

  // Sign-in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Sign-up state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { mutate: login, isPending: loginPending, error: loginError } = useLogin();
  const { mutate: register, isPending: registerPending, error: registerError } = useRegister();

  const loading = isSignup ? registerPending : loginPending;
  const error = isSignup ? registerError?.message : loginError?.message;

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirmPassword("");
    setFirstName(""); setLastName(""); setRemember(false); setAgreedToTerms(false);
  };

  const switchMode = (m: AuthMode) => { setMode(m); resetForm(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (password !== confirmPassword) { alert("Passwords do not match."); return; }
      if (!agreedToTerms) { alert("Please agree to the terms."); return; }
      await register({ firstName, lastName, email, password, confirmPassword });
    } else {
      await login({ email, password });
    }
  };

  const s = {
    root: {
      minHeight: "100vh",
      background: "#090909",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative" as const,
      overflow: "hidden",
    } as React.CSSProperties,
    glow1: {
      position: "absolute" as const, top: -160, left: "50%", transform: "translateX(-50%)",
      width: 800, height: 400, borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)",
      pointerEvents: "none" as const,
    },
    glow2: {
      position: "absolute" as const, bottom: -120, right: -100,
      width: 500, height: 400, borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)",
      pointerEvents: "none" as const,
    },
    card: {
      position: "relative" as const,
      width: "100%", maxWidth: 1020,
      borderRadius: 24,
      border: "1px solid rgba(255,255,255,0.07)",
      background: "#111",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "1fr",
    } as React.CSSProperties,
    leftPanel: {
      background: "linear-gradient(160deg, #131313 0%, #0e0e0e 100%)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      padding: "48px 44px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      gap: 40,
    },
    rightPanel: {
      padding: "44px 48px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.22) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s !important;
          box-shadow: 0 0 0px 1000px rgba(255,255,255,0.04) inset !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.04) inset !important;
        }
        @media (min-width: 900px) {
          .sf-card { grid-template-columns: 1.15fr 0.85fr !important; }
          .sf-left { display: flex !important; }
          .sf-mobile-brand { display: none !important; }
        }
        @media (max-width: 899px) {
          .sf-left { display: none !important; }
          .sf-right { padding: 32px 24px !important; }
          .sf-mobile-brand { display: flex !important; }
          .sf-name-row { flex-direction: column !important; }
        }
        .sf-tab:hover { color: rgba(255,255,255,0.7) !important; }
        .sf-social:hover { border-color: rgba(249,115,22,0.4) !important; background: rgba(249,115,22,0.04) !important; }
        .sf-submit:hover:not(:disabled) { opacity: 0.88 !important; transform: translateY(-1px) !important; }
        .sf-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .sf-link:hover { color: #fb923c !important; }
      `}</style>

      <div style={s.root}>
        <div style={s.glow1} />
        <div style={s.glow2} />

        <div style={{ ...s.card, position: "relative" }} className="sf-card">

          {/* ── Left Panel ── */}
          <div style={s.leftPanel} className="sf-left">
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, background: "#f97316",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
              }}>
                <IconBag />
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>ShopFresherz</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#f97316", margin: 0, letterSpacing: "0.22em", textTransform: "uppercase" }}>Gadget Store</p>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.8px", margin: 0 }}>
                Your{" "}
                <span style={{ color: "#f97316" }}>premium gadgets,</span>
                <br />one account away.
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, marginTop: 14, maxWidth: 320 }}>
                Track orders, save wishlists, unlock member-only deals — all from one sleek dashboard.
              </p>
            </div>

            {/* Benefits */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Benefit icon={<IconShield />} title="End-to-end secure" text="Every transaction encrypted and protected." />
              <Benefit icon={<IconTruck />} title="Real-time tracking" text="Live delivery updates on every order." />
              <Benefit icon={<IconBolt />} title="Flash deals" text="Exclusive discounts for members every week." />
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { v: "50K+", l: "Customers" },
                { v: "15+", l: "Categories" },
                { v: "4.9★", l: "Rating" },
              ].map((stat) => (
                <div key={stat.l} style={{
                  borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.03)", padding: "12px 10px", textAlign: "center",
                }}>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0 }}>{stat.v}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0, marginTop: 2 }}>{stat.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div style={s.rightPanel} className="sf-right">

            {/* Mobile brand */}
            <div className="sf-mobile-brand" style={{ alignItems: "center", gap: 12, marginBottom: 28, display: "none" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: "#f97316",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              }}>
                <IconBag />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>ShopFresherz</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#f97316", margin: 0, letterSpacing: "0.2em", textTransform: "uppercase" }}>Gadget Store</p>
              </div>
            </div>

            {/* Tab switcher */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4,
              background: "rgba(255,255,255,0.04)", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.07)", padding: 4, marginBottom: 28,
            }}>
              {(["signin", "signup"] as AuthMode[]).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className="sf-tab"
                    style={{
                      padding: "11px 0", borderRadius: 12, border: active ? "1px solid rgba(255,255,255,0.16)" : "1px solid transparent", cursor: "pointer",
                      fontSize: 13, fontWeight: 700,
                      background: active ? "rgba(255,255,255,0.08)" : "transparent",
                      color: active ? "#fff" : "rgba(255,255,255,0.35)",
                      boxShadow: active ? "0 10px 30px rgba(0,0,0,0.18)" : "none",
                      transition: "all 0.18s",
                      fontFamily: "inherit",
                    }}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                );
              })}
            </div>

            {/* Form header */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#f97316", margin: 0 }}>
                {isSignup ? "New here?" : "Welcome back"}
              </p>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "6px 0 8px", letterSpacing: "-0.5px" }}>
                {isSignup ? "Join ShopFresherz" : "Access your account"}
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, margin: 0 }}>
                {isSignup
                  ? "Create a free account and start shopping smarter."
                  : "Sign in to continue shopping, track orders, and manage your gadgets."}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                marginBottom: 16, padding: "10px 14px", borderRadius: 12,
                border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)",
                fontSize: 13, color: "#f87171",
              }}>{error}</div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {isSignup && (
                <div className="sf-name-row" style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <Field label="First name" icon={<IconUser />} placeholder="John" value={firstName} onChange={setFirstName} autoComplete="given-name" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Field label="Last name" icon={<IconUser />} placeholder="Doe" value={lastName} onChange={setLastName} autoComplete="family-name" />
                  </div>
                </div>
              )}

              <Field label="Email address" icon={<IconMail />} type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />

              <PasswordField
                label="Password"
                placeholder={isSignup ? "Min 8 chars, 1 uppercase, 1 number" : "Enter your password"}
                value={password}
                onChange={setPassword}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />

              {isSignup && (
                <PasswordField label="Confirm password" placeholder="Re-enter your password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
              )}

              {/* Inline controls */}
              {!isSignup ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 2 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#f97316", width: 14, height: 14 }} />
                    Remember me
                  </label>
                  <button type="button" className="sf-link" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#f97316", transition: "color 0.15s", fontFamily: "inherit" }}>
                    Forgot password?
                  </button>
                </div>
              ) : (
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", lineHeight: 1.65 }}>
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={{ accentColor: "#f97316", width: 14, height: 14, marginTop: 3, flexShrink: 0 }} />
                  <span>
                    I agree to ShopFresherz{" "}
                    <a href="#" className="sf-link" style={{ color: "#f97316", textDecoration: "none", fontWeight: 700, transition: "color 0.15s" }}>Terms</a>
                    {" "}and{" "}
                    <a href="#" className="sf-link" style={{ color: "#f97316", textDecoration: "none", fontWeight: 700, transition: "color 0.15s" }}>Privacy Policy</a>
                  </span>
                </label>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="sf-submit"
                style={{
                  marginTop: 4, width: "100%", padding: "14px 0", borderRadius: 14,
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase",
                  background: isSignup ? "#f97316" : "#fff",
                  color: isSignup ? "#fff" : "#111",
                  boxShadow: isSignup ? "0 8px 28px rgba(249,115,22,0.35)" : "0 8px 28px rgba(255,255,255,0.12)",
                  opacity: loading ? 0.65 : 1,
                  transition: "all 0.18s",
                  fontFamily: "inherit",
                }}
              >
                {loading ? (
                  <><IconSpinner />{isSignup ? "Creating account..." : "Signing in..."}</>
                ) : (
                  <>{isSignup ? "Create account" : "Sign in"}<IconArrow /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                {
                  label: "Google",
                  icon: (
                    <svg viewBox="0 0 24 24" style={{ width: 17, height: 17 }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  label: "Apple",
                  icon: (
                    <svg viewBox="0 0 814 1000" style={{ width: 15, height: 15 }} fill="currentColor">
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-167.2-37.5c-62.2 0-115.5-60-167.2-140.1-51.6-80.1-94.2-204-94.2-324.1 0-107.8 21.8-213.8 91.7-286 54.4-57.3 134.2-93.9 213.8-93.9 76 0 137.9 35.5 185.7 35.5 45.8 0 118.9-38.1 202.9-38.1 33.9 0 122.5 3.8 187.3 72.9zm-154.9-249.5c30.8-36.4 52.8-86.6 52.8-136.8 0-7-1.3-14.1-2.6-21.1-50.9 1.9-110.8 33.9-147.5 75.8-28.2 32-52.8 81.5-52.8 132.4 0 7.7 1.3 15.4 1.9 17.9 3.2.6 8.3 1.3 13.5 1.3 45.8 0 102.5-30.8 134.7-69.5z"/>
                    </svg>
                  ),
                },
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  className="sf-social"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "11px 0", borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    fontSize: 13, fontWeight: 700, color: "#fff",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}
                >
                  {social.icon}{social.label}
                </button>
              ))}
            </div>

            <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 20, marginBottom: 0 }}>
              Need help?{" "}
              <a href="#" className="sf-link" style={{ color: "#f97316", textDecoration: "none", fontWeight: 700, transition: "color 0.15s" }}>
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Named export as requested + Next.js default export
export { ShopFresherzAuth as LoginPage };
export default ShopFresherzAuth;
