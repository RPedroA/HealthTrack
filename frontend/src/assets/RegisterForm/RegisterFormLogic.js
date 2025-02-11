export const registerUser = async (username, email, password, confirmPassword, setError, navigate) => {
  if (password !== confirmPassword) {
    setError("As senhas não correspondem.");
    return;
  }

  if (username.length < 3) {
    setError("O nome de usuário deve ter pelo menos 3 caracteres.");
    return;
  }

  if (password.length < 6) {
    setError("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  if (!validateEmail(email)) {
    setError("E-mail inválido.");
    return;
  }

  try {
    console.log("Enviando requisição de registro...");
    const requestBody = { username, email, password_hash: password };  // Enviando como 'password_hash'
    console.log("Dados enviados:", requestBody);
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    console.log("Resposta recebida:", response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta:", errorData);
      setError(errorData.erro || "Erro ao registrar. Tente novamente.");
      return;
    }

    const data = await response.json();
    console.log("Dados do registro:", data);

    navigate("/login");
  } catch (err) {
    console.error("Erro no registro:", err);
    setError(err.message);
  }
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
