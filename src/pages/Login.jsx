import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // Mock auth: stash a name for the dashboard greeting
    sessionStorage.setItem("doctorName", "Dr. Jane");
    nav("/dashboard");
  };

  return (
    <main className="main">
      <div className="auth">
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-sub">
          Enter your credentials to access your account
        </p>

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            className="input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="row-between" style={{ marginTop: 12 }}>
            <label className="label" htmlFor="password" style={{ margin: 0 }}>
              Password
            </label>
            <Link className="link" to="/forgot">
              forgot password
            </Link>
          </div>

          <input
            id="password"
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="button btn-full"
            type="submit"
            style={{ marginTop: 16 }}
          >
            Login
          </button>
        </form>

        <p className="muted" style={{ textAlign: "center", marginTop: 16 }}>
          Don’t have an account?{" "}
          <Link className="link" to="/register">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
