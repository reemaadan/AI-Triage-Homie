import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotCode() {
  const [code, setCode] = useState("");
  const nav = useNavigate();

  // guard: if no email from previous step, send back
  useEffect(() => {
    if (!sessionStorage.getItem("fp_email")) nav("/forgot");
  }, [nav]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!code) return;
    sessionStorage.setItem("fp_code", code);
    // In a real app you'd verify the code here.
    nav("/forgot/reset");
  };

  const email = sessionStorage.getItem("fp_email") || "";

  return (
    <main className="main">
      <div className="auth">
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-sub">
          We sent a 6-digit code to <strong>{email}</strong>.
        </p>

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="fp-code">
            Enter code
          </label>
          <input
            id="fp-code"
            className="input"
            inputMode="numeric"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <button
            className="button btn-full"
            type="submit"
            style={{ marginTop: 16 }}
          >
            Continue
          </button>
        </form>

        <p className="muted" style={{ textAlign: "center", marginTop: 14 }}>
          Didn’t get it?{" "}
          <button
            className="link"
            style={{ background: "none", border: 0, cursor: "pointer" }}
            onClick={() => alert("Mock: resend code")}
          >
            Resend
          </button>
        </p>

        <p className="muted" style={{ textAlign: "center", marginTop: 6 }}>
          Wrong email?{" "}
          <Link className="link" to="/forgot">
            Use a different address
          </Link>
        </p>
      </div>
    </main>
  );
}
