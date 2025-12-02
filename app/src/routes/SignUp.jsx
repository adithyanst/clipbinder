import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });

    const jwtData = await response.json();
    console.log(jwtData.jwt);
    localStorage.setItem("jwt", jwtData.jwt);
    navigate("/dash");
  }

  return (
    <div className="px-8 py-5">
      <form onSubmit={submitHandler}>
        <input
          placeholder="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          required
        />
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
        <button type="submit">signup</button>
      </form>
    </div>
  );
}

export default SignUp;
