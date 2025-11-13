import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const jwtData = await response.json();
    localStorage.setItem("jwt", jwtData.jwt);
    navigate("/dash");
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-column items-center justify-center rounded-[12px] border-[#515151] border-[1.5px] border-solid bg-[#1B1B1B] px-12 py-6 text-white">
        <form onSubmit={submitHandler}>
          <input
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            required
          />
          <input
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            required
          />
          <button type="submit">login</button>
        </form>
      </div>
    </main>
  );
}

export default Login;
