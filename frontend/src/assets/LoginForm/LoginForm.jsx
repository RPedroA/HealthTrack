
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { loginUser } from "./LoginFormLogic"; 

function LoginForm() {
  document.body.style.backgroundColor = "#e6f2e6";
  const [email, setEmail] = useState("");
  const [password_hash, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password_hash, setError, navigate); 
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && <p className="text-danger">{error}</p>}

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Palavra-Passe"
            required
            value={password_hash}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          style={{ cursor: "pointer" }}
        >
          Login
        </button>
      </form>
      <div
        className="register-link"
        onClick={() => navigate("/register")}
        style={{ cursor: "pointer" }}
      >
        <p>
          Não tenho conta?{" "}
          <span style={{ color: "blue", textDecoration: "underline" }}>
            Registar
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
