import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", form.email.trim());
    setError("");
    window.location.assign("/");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>FactoryGuard Login</h1>
        <p>Sign in to access your safety monitoring dashboard.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </label>

          {error && <p className="login-error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
