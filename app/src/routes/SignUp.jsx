import { useState, useEffect } from "react";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function submitHandler(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });

    console.log(response);
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-column items-center justify-center rounded-[12px] border-[#515151] border-[1.5px] border-solid bg-[#1B1B1B] px-12 py-6 text-white">
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
    </main>
  );
}

export default SignUp;
