"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ username, password });
      login(response.token, response.username);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      {/* Lado esquerdo — imagem e texto */}
      <div style={styles.left}>
        <div style={styles.leftOverlay} />
        <div style={styles.leftContent}>
          <div style={styles.tagline}>
            <span style={styles.taglineLine} />
            <span style={styles.taglineText}>BEM-VINDO À</span>
          </div>
          <h1 style={styles.heroTitle}>
            Plataforma{" "}
            <span style={styles.heroAccent}>EcoFeira</span>
          </h1>
          <blockquote style={styles.quote}>
            "Fortalecendo os processos de comercialização e geração de renda a
            partir de produtos agroecológicos."
          </blockquote>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          {/* Logo */}
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect width="56" height="56" rx="12" fill="#1a4731" />
                {/* tenda */}
                <path d="M10 28 L28 14 L46 28 Z" fill="#2d7a4f" />
                <rect x="14" y="28" width="28" height="14" rx="2" fill="#2d7a4f" />
                {/* folha esquerda */}
                <path d="M22 32 Q20 26 26 24 Q24 30 22 32Z" fill="#5eba85" />
                {/* folha direita */}
                <path d="M34 32 Q36 26 30 24 Q32 30 34 32Z" fill="#5eba85" />
                {/* haste */}
                <line x1="28" y1="24" x2="28" y2="34" stroke="#5eba85" strokeWidth="1.5" />
              </svg>
            </div>
            <h2 style={styles.logoTitle}>EcoFeira</h2>
            <p style={styles.logoSubtitle}>Acesse sua conta para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Campo Usuário */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Usuário</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={styles.input}
                  onFocus={(e) => { e.target.style.borderColor = "#1a4731"; e.target.style.boxShadow = "0 0 0 3px rgba(26,71,49,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Senha</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...styles.input, paddingRight: "48px" }}
                  onFocus={(e) => { e.target.style.borderColor = "#1a4731"; e.target.style.boxShadow = "0 0 0 3px rgba(26,71,49,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Esqueci senha */}
            <div style={styles.forgotRow}>
              <a href="#" style={styles.forgotLink}>Esqueci minha senha</a>
            </div>

            {/* Erro */}
            {error && (
              <div style={styles.errorBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
              onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = "#153d28"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "#1a4731"; }}
            >
              {loading ? "Entrando..." : <>Entrar →</>}
            </button>
          </form>

          <p style={styles.footer}>
            © 2026 EcoFeira · Associação Agroecológica · Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    position: "absolute", 
    top: 0,               
    left: 0,              
    overflow: "hidden",   
    fontFamily: "'Segoe UI', sans-serif",
  },
  left: {
    flex: 1,
    position: "relative",
    background: "linear-gradient(135deg, #0f2d1a 0%, #1a4731 40%, #2d7a4f 100%)",
    display: "flex",
    alignItems: "flex-end",
    padding: "48px",
    overflow: "hidden",
  },
  leftOverlay: {
    position: "absolute",
    inset: 0,
    background: "url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80') center/cover no-repeat",
    opacity: 0.25,
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
    color: "white",
    maxWidth: "480px",
  },
  tagline: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  taglineLine: {
    display: "inline-block",
    width: "32px",
    height: "2px",
    background: "#5eba85",
  },
  taglineText: {
    fontSize: "13px",
    letterSpacing: "0.12em",
    color: "#a7f3c8",
    fontWeight: 500,
  },
  heroTitle: {
    fontSize: "clamp(36px, 4vw, 52px)",
    fontWeight: 700,
    lineHeight: 1.1,
    margin: "0 0 32px",
    color: "#ffffff",
  },
  heroAccent: {
    color: "#5eba85",
  },
  quote: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "20px 24px",
    fontSize: "15px",
    lineHeight: 1.7,
    fontStyle: "italic",
    color: "#d1fae5",
    margin: 0,
  },
  right: {
    width: "520px",
    background: "#f0faf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
  },
  formCard: {
    width: "100%",
    maxWidth: "400px",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "36px",
  },
  logoIcon: {
    display: "inline-flex",
    marginBottom: "12px",
  },
  logoTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a4731",
    margin: "0 0 6px",
  },
  logoSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a4731",
    marginBottom: "8px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "13px 16px 13px 44px",
    fontSize: "15px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  eyeButton: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "4px",
  },
  forgotRow: {
    textAlign: "right",
    marginBottom: "24px",
    marginTop: "-8px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#2d7a4f",
    textDecoration: "none",
    fontWeight: 500,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#b91c1c",
    marginBottom: "16px",
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#ffffff",
    background: "#1a4731",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s",
    letterSpacing: "0.02em",
  },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "32px",
  },
};