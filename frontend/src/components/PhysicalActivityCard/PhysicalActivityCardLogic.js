import { useState } from "react";

export const usePhysicalActivityCardLogic = ({ activity, onDelete, onAdd, date }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editedActivity, setEditedActivity] = useState({ ...activity });

  const [newActivity, setNewActivity] = useState({
    activity_type: "",
    duration_minutes: "",
    calories_burned: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewActivity((prev) => ({ ...prev, [name]: value }));
    } else {
      setEditedActivity((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedActivity({ ...activity });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(activity.id);
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleConfirmAdd = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (!date) {
      console.error("Erro: Data não definida.");
      return;
    }

    const activityToSend = {
      user_id: userId,
      activity_type: newActivity.activity_type,
      duration_minutes: parseInt(newActivity.duration_minutes, 10),
      calories_burned: parseInt(newActivity.calories_burned, 10),
      date, 
    };

    try {
      const response = await fetch("http://localhost:8080/pa/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityToSend),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Atividade adicionada:", data);
        onAdd(data);
        setIsAdding(false);
      } else {
        console.error("Erro ao adicionar atividade:", data);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  return {
    isEditing,
    setIsEditing,
    editedActivity,
    handleInputChange,
    handleSave,
    handleCancel,
    handleDelete,
    isAdding,
    handleAdd,
    handleConfirmAdd,
    handleCancelAdd,
    newActivity,
  };
};
