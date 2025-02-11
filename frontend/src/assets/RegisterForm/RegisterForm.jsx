import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegisterForm.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { registerUser } from "./RegisterFormLogic"; 

function RegisterForm() {
    document.body.style.backgroundColor = "#e6f2e6";
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser(username, email, password, confirmPassword, setError, navigate); 
    };

    return (
        <div className='register'>
            <form onSubmit={handleSubmit}>
                <h1>Registar</h1>
                {error && <p className="text-danger">{error}</p>}
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Utilizador"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FaUser className='icon' />
                </div>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder='E-mail'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FaEnvelope className='icon' />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Palavra-Passe'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className='icon' />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Confirme a Palavra-Passe'
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <FaLock className='icon' />
                </div>
                <button type="submit" className='btn btn-success w-100'>Registrar</button>
            </form>

            <div className="login-link" onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                <p>
                    Já tenho conta? <span style={{ color: "blue", textDecoration: "underline" }}>Login</span>
                </p>
            </div>
        </div>
    );
}

export default RegisterForm;
