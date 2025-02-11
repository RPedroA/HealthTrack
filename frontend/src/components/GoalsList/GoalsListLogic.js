import { useState, useEffect } from "react";

const GoalsListLogic = (onSaveGoal, onDeleteGoal) => {
  const [filter, setFilter] = useState("Todos");
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editedGoal, setEditedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState(null);
  const [goals, setGoals] = useState([]); 
  const [error, setError] = useState(null); 

  const fetchGoals = async () => {
    try {
      const response = await fetch("http://localhost:8080/goals/");
      const data = await response.json();

      if (Array.isArray(data)) {
        setGoals(data); 
      } else {
        setError(data.erro || "Erro desconhecido"); 
        setGoals([]); 
      }
    } catch (error) {
      console.error("Erro ao buscar os objetivos:", error);
      setError("Erro ao buscar os objetivos.");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setEditedGoal(goal);
  };

  const handleSaveGoal = async () => {
    if (editedGoal) {
      console.log("Enviando os dados para atualização:", editedGoal); 
      const url = `http://localhost:8080/goals/${editedGoal.id}`;
      console.log("URL da requisição PUT:", url); 

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedGoal),
        });

        if (response.ok) {
          const updatedGoal = await response.json();
          console.log("Objetivo atualizado com sucesso:", updatedGoal); 
          onSaveGoal(updatedGoal); 
          setEditingGoalId(null);
          setEditedGoal(null);
          fetchGoals(); 
        } else {
          console.error("Erro ao atualizar objetivo:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao enviar a atualização do objetivo:", error);
      }
    }
  };


  const handleCancelEdit = () => {
    setEditingGoalId(null);
    setEditedGoal(null);
  };

  const handleInputChange = (field, value) => {
    setEditedGoal((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewGoalChange = (field, value) => {
    setNewGoal((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateGoal = async () => {
    if (newGoal && newGoal.title.trim()) {
      const goalToCreate = {
        title: newGoal.title,
        description: newGoal.description || "",
        target_value: newGoal.target_value || 0,
        status: newGoal.status || "Em Progresso",
        created_at: new Date().toISOString().split("T")[0],
        user_id: parseInt(localStorage.getItem("userId"), 10), 
      };

      console.log("Dados do novo objetivo a ser criado:", goalToCreate); 

      try {
        const response = await fetch("http://localhost:8080/goals/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(goalToCreate),
        });

        if (response.ok) {
          const createdGoal = await response.json();
          onSaveGoal(createdGoal); 
          setNewGoal(null); 
          fetchGoals(); 
        } else {
          console.error("Erro ao criar objetivo:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao enviar o objetivo para o backend:", error);
      }
    }
  };

  const handleDeleteGoal = async (goal) => {
    const url = `http://localhost:8080/goals/${goal.id}`;
    console.log("URL da requisição DELETE:", url); 
    
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("Objetivo excluído com sucesso:", goal.id); 
        onDeleteGoal(goal); 
        fetchGoals(); 
      } else {
        console.error("Erro ao excluir objetivo:", response.statusText);
        fetchGoals();
      }
    } catch (error) {
      console.error("Erro ao excluir o objetivo:", error);
    }
  };
  

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === "Todos") return true;
    return goal.status === filter;
  });

  return {
    filteredGoals,
    newGoal,
    editingGoalId,
    editedGoal,
    handleEditGoal,
    handleSaveGoal,
    handleCancelEdit,
    handleDeleteGoal,
    handleInputChange,
    handleNewGoalChange,
    handleCreateGoal,
    changeFilter,
    setNewGoal,
    error, 
  };
};

export default GoalsListLogic;
