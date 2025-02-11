import { useEffect, useState } from "react";

export const useHealthPageLogic = () => {
  const [dailyMetrics, setDailyMetrics] = useState(null);
  const [date, setDate] = useState("");
  const [physicalActivities, setPhysicalActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    activity_type: "",
    duration_minutes: "",
    calories_burned: "",
  });


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
    console.log("Data inicial definida:", currentDate);
    if (userId) {
      const loadData = async () => {
        await fetchDailyMetrics(userId, currentDate);
        await fetchPhysicalActivities(userId, currentDate);
      };
      loadData();
    }
  }, []);

  const fetchDailyMetrics = async (userId, date) => {
    const url = `http://localhost:8080/dhm/search?user_id=${userId}&date=${date}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("Dados recebidos da API:", data);

      if (data && data.length > 0) {
        setDailyMetrics({
          calories_consumed: data[0].calories_consumed,
          water_consumed_ml: data[0].water_consumed_ml,
          steps_count: data[0].steps_count,
          weight_kg: parseFloat(data[0].weight_kg),
          sleep_quality: data[0].sleep_quality,
          sleep_hours: parseFloat(data[0].sleep_hours),
        });
      } else {
        setDailyMetrics(null);
      }
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
      setDailyMetrics(null);
    }
  };

  const handleSave = async (editedMetrics) => {
    const userId = parseInt(localStorage.getItem("userId"), 10);

    if (!userId) {
      alert("Erro: Usuário não identificado. Por favor, faça login novamente.");
      return;
    }

    if (!date) {
      alert("Erro: Data não definida.");
      return;
    }

    console.log("Data atual:", date);
    console.log("Métricas editadas recebidas:", editedMetrics);

    const metricsToSend = {
      user_id: userId,
      date: date,
      calories_consumed: editedMetrics.calories_consumed,
      water_consumed_ml: editedMetrics.water_consumed_ml,
      steps_count: editedMetrics.steps_count,
      weight_kg: parseFloat(editedMetrics.weight_kg || 0).toFixed(2),
      sleep_quality: editedMetrics.sleep_quality,
      sleep_hours: parseFloat(editedMetrics.sleep_hours || 0).toFixed(2),
    };

    if (
      Object.values(metricsToSend).some(
        (value) =>
          value === "" ||
          value === null ||
          value === undefined ||
          Number.isNaN(value)
      )
    ) {
      console.error("Dados inválidos:", metricsToSend);
      alert("Por favor, preencha todos os campos corretamente");
      return;
    }

    console.log("Dados que serão enviados para a API:", metricsToSend);

    try {
      const response = await fetch(
        "http://localhost:8080/dhm/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metricsToSend),
        }
      );

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (response.ok) {
        setDailyMetrics(editedMetrics);
        console.log("Métricas salvas com sucesso!");
        fetchDailyMetrics(userId, date);
      } else {
        throw new Error(data.message || "Erro ao salvar as métricas");
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
    }
  };

  const fetchPhysicalActivities = async (userId, date) => {
    if (!userId || !date) return;

    try {
      const response = await fetch(
        `http://localhost:8080/pa/search?user_id=${userId}&date=${date}`
      );

      const textData = await response.text();
      const data = JSON.parse(textData);

      if (!data.erro && Array.isArray(data)) {
        setPhysicalActivities(data);
      } else {
        setPhysicalActivities([]); 
      }
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      setPhysicalActivities([]); 
    }
  };

  const handleAddActivity = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !newActivity.activity_type || !newActivity.duration_minutes || !newActivity.calories_burned) return;

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
        setPhysicalActivities((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
    }
  };

  
  const handleDateChange = (e) => {
    const newDate = e.target.value;  
    setDate(newDate);
  
    console.log("Data alterada:", newDate);
  
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchDailyMetrics(userId, newDate);
      fetchPhysicalActivities(userId, newDate); 
    }
  };

  return {
    dailyMetrics,
    physicalActivities,
    newActivity,
    handleDateChange,
    handleSave,
    handleAddActivity,
    setNewActivity,
    date,
  };
};
