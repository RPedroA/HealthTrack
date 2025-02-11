export const loginUser = async (email, password_hash, setError, navigate) => {
  try {
    const response = await fetch(
      "http://localhost:8080/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password_hash }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Credenciais inválidas. Tente novamente."
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data); 

    if (!data.token) {
      throw new Error("Token não recebido na resposta da API.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("userEmail", data.user.email);

    if (data.user.full_name !== null && data.user.full_name !== undefined) {
      localStorage.setItem("userFullName", data.user.full_name);
    } else {
      localStorage.setItem("userFullName", "");
    }

    console.log("Token:", localStorage.getItem("token"));
    console.log("UserId:", localStorage.getItem("userId"));
    console.log("UserEmail:", localStorage.getItem("userEmail"));
    console.log("UserFullName:", localStorage.getItem("userFullName"));

    navigate("/health");
  } catch (err) {
    console.error("Erro no login:", err);
    setError(err.message);
  }
};
