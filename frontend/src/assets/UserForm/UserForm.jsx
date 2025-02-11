import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";

function UserForm() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('As palavras-passe não coincidem');
            return;
        }

        if (password.length < 6) {
            alert('A palavra-passe deve ter pelo menos 6 caracteres');
            return;
        }

        if (username.length < 3) {
            alert('O nome de utilizador deve ter pelo menos 3 caracteres');
            return;
        }

        const userId = localStorage.getItem('userId'); 
        if (!userId) {
            alert('Erro: Não foi possível identificar o utilizador');
            return;
        }

        const passwordHash = password; 

        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password_hash: passwordHash, 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Perfil atualizado com sucesso');
                navigate('/health'); 
            } else {
                alert(data.message || 'Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            alert('Erro ao atualizar perfil');
        }
    };

    const handleCancel = () => {
        navigate('/health'); 
    };

    return (
        <div className='user'>
            <form onSubmit={handleSubmit}>
                <h1>Modificar Perfil</h1>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder='Nome de Utilizador' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <FaUser className='icon' />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder='Nova Palavra-Passe' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <FaLock className='icon' />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder='Confirme a Nova Palavra-Passe' 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                    <FaLock className='icon' />
                </div>
                <button type="submit" className='btn btn-success w-100'>Guardar</button>
                <button 
                    type="button" 
                    className="btn btn-danger w-100" 
                    onClick={handleCancel} 
                    style={{ cursor: "pointer" }}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default UserForm;
