import React, { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({ username, password });
    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 200) {
      alert("Registration successful!");
    } else {
      alert("Registration failed!");
    }
  };

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button>Register</button>
    </form>
  );
}
