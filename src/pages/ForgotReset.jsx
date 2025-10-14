import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotReset() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const email = sessionStorage.getItem("fp_email") || "";
  const code = sessionStorage.getItem("fp_code") || "";

  // guard: if user skipped steps, send back
  useEffect(() => {
    if (!email) nav("/forgot");
    else if (!code) nav("/forgot/code");
  }, [email, code, nav]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    // In a real app you'd send { email, code, password } to the backend.
    sessionStorage.removeItem("fp_email");
    sessionStorage.removeItem("fp_code");
    alert("Password reset successful (mock). You can log in now.");
    nav("/login");
  };

  return (
    <main className="main">
      <div className="auth">
        <h1 className="auth-title">Create a new password</h1>
        <p className="auth-sub">
          For <strong>{email}</strong>
        </p>

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="fp-pass">
            New password
          </label>
          <input
            id="fp-pass"
            className="input"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="label" htmlFor="fp-confirm">
            Confirm password
          </label>
          <input
            id="fp-confirm"
            className="input"
            type="password"
            placeholder="Re-enter new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            className="button btn-full"
            type="submit"
            style={{ marginTop: 16 }}
          >
            Save new password
          </button>
        </form>

        <p className="muted" style={{ textAlign: "center", marginTop: 14 }}>
          <Link className="link" to="/login">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
