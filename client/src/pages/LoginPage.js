import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const login = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({ username, password });
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.ok) {
      setRedirect(true);
    } else {
      alert("Wrong credentials");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
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
      <button>Login</button>
    </form>
  );
}
