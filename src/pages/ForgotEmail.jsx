import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotEmail() {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    sessionStorage.setItem("fp_email", email);
    // In a real app you'd call an API to send a code here.
    nav("/forgot/code");
  };

  return (
    <main className="main">
      <div className="auth">
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-sub">
          Enter the email associated with your account.
        </p>

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="fp-email">
            Email address
          </label>
          <input
            id="fp-email"
            className="input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="button btn-full"
            type="submit"
            style={{ marginTop: 16 }}
          >
            Send code
          </button>
        </form>

        <p className="muted" style={{ textAlign: "center", marginTop: 14 }}>
          Remembered it?{" "}
          <Link className="link" to="/login">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
