import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dash");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-8 py-5">
      <form onSubmit={submitHandler}>
        <input
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          required
          disabled={loading}
        />
        <input
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "logging in..." : "login"}
        </button>
        {error && <p className="opacity-50 mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
