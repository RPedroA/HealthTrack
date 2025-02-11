import React, { useEffect, useState } from "react";
import GroupCreateForm from "../../components/GroupCreateForm/GroupCreateForm"; 
import GroupCard from "../../components/GroupCard/GroupCard"; 
import NavbarB from "../../components/NavbarB/NavbarB";
import { FaPlusCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const GroupPage = () => {
  document.body.style.backgroundColor = '#e6f2e6';
  const [groups, setGroups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [createdGroup, setCreatedGroup] = useState({ name: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:8080/groups?query=${searchTerm}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar grupos");
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
      }
    };

    fetchGroups();
  }, [searchTerm]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreatedGroup((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Usuário não autenticado. Token não encontrado.");
      return;
    }

    let userId;
    try {
      const payloadBase64 = token.split(".")[1]; 
      const payloadDecoded = JSON.parse(atob(payloadBase64)); 

      console.log("Payload do token:", payloadDecoded); 

      userId = payloadDecoded.userId || payloadDecoded.id || payloadDecoded.sub; 

      if (!userId) {
        throw new Error("ID do usuário não encontrado no token.");
      }
    } catch (error) {
      console.error("Erro ao obter userId do token:", error);
      return;
    }

    const newGroup = {
      name: createdGroup.name,
      description: createdGroup.description || "",
      created_by: userId, 
      image_path: "",
    };

    console.log("Enviando grupo:", newGroup); 

    try {
      const response = await fetch("http://localhost:8080/groups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGroup),
      });

      const responseData = await response.json();
      console.log("Resposta da API:", responseData); 

      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao criar grupo");
      }

      setGroups((prev) => [...prev, responseData]);
      setCreatedGroup({ name: "", description: "" });
      setIsCreating(false);
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); 
  };

  return (
    <div>
      <NavbarB /> 
      <h1 className="page-title">Página de Grupos</h1> 

      <input
        type="text"
        placeholder="Pesquisar grupos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="form-control mb-3"
      />
      {isCreating ? (
        <GroupCreateForm
          createdGroup={createdGroup}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      ) : (
        <div>
          <div className="d-flex flex-wrap justify-content-start">
            {groups.map((group) => (
              <div key={group.id} className="me-3 mb-3"> 
                <GroupCard group={group} />
              </div>
            ))}
          </div>
          <button className="btn btn-success mt-3" onClick={() => {
            setCreatedGroup({ name: "", description: "" }); 
            setIsCreating(true);
          }}>
            <FaPlusCircle className="me-2" />
            Criar Novo Grupo
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
