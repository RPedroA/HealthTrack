import PropTypes from "prop-types";
import {
  FaUtensils,
  FaTint,
  FaWalking,
  FaWeight,
  FaBed,
  FaClock,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import "./HealthMetricsCard.css";

const HealthMetricsCard = ({ currentDate, dailyMetrics, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMetrics, setEditedMetrics] = useState({
    calories_consumed: "",
    water_consumed_ml: "",
    steps_count: "",
    weight_kg: "",
    sleep_quality: "",
    sleep_hours: "",
  });

  useEffect(() => {
    if (dailyMetrics) {
      setEditedMetrics({
        calories_consumed: dailyMetrics.calories_consumed || "",
        water_consumed_ml: dailyMetrics.water_consumed_ml || "",
        steps_count: dailyMetrics.steps_count || "",
        weight_kg: dailyMetrics.weight_kg || "",
        sleep_quality: dailyMetrics.sleep_quality || "",
        sleep_hours: dailyMetrics.sleep_hours || "",
      });
    }
  }, [dailyMetrics]);

  const handleEditToggle = () => {
    if (isEditing) {
      onEdit(editedMetrics);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedMetrics({
      calories_consumed: dailyMetrics?.calories_consumed || "",
      water_consumed_ml: dailyMetrics?.water_consumed_ml || "",
      steps_count: dailyMetrics?.steps_count || "",
      weight_kg: dailyMetrics?.weight_kg || "",
      sleep_quality: dailyMetrics?.sleep_quality || "",
      sleep_hours: dailyMetrics?.sleep_hours || "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const parsedValue = ['calories_consumed', 'water_consumed_ml', 'steps_count', 'weight_kg', 'sleep_hours'].includes(name)
      ? parseFloat(value) || ''
      : value;
    
    setEditedMetrics(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  

  const safeMetrics = dailyMetrics || {};

  return (
    <div className="container d-flex justify-content-center">
      <div
        className="card mt-4 mx-auto p-4 shadow-lg"
        style={{
          maxWidth: "600px",
          minWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          background: "#ffffff",
          padding: "20px",
        }}
      >
        <h4
          className="card-title text-success text-center"
          style={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #28a745, #218838)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "1.5rem",
          }}
        >
          Estatísticas Diárias
        </h4>

        <h5
          className="text-muted text-center mb-4"
          style={{ fontSize: "1.2rem", fontWeight: "500" }}
        >
          {currentDate || "Data não disponível"}
        </h5>

        <ul
          className="list-group list-group-flush fs-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <li
            className="list-group-item d-flex align-items-center py-3 text-start"
            style={{ backgroundColor: "#ffffff" }}
          >
            {!isEditing && <FaUtensils className="text-danger fs-5" />}
            <span className="ms-3 flex-grow-1">Calorias Consumidas: </span>
            {isEditing ? (
              <div className="d-flex flex-column w-100">
                <input
                  type="number"
                  name="calories_consumed"
                  value={editedMetrics.calories_consumed || ""}
                  onChange={handleChange}
                  className="form-control mt-2"
                />
              </div>
            ) : (
              <span className="fw-bold text-end">
                {dailyMetrics && dailyMetrics.calories_consumed !== undefined
                  ? `${dailyMetrics.calories_consumed} kcal`
                  : "Sem dados"}
              </span>
            )}
          </li>
          <li
            className="list-group-item d-flex align-items-center py-3 text-start"
            style={{ backgroundColor: "#ffffff" }}
          >
            {!isEditing && <FaTint className="text-primary fs-5" />}
            <span className="ms-3 flex-grow-1">Água Consumida: </span>
            {isEditing ? (
              <div className="d-flex flex-column w-100">
                <input
                  type="number"
                  name="water_consumed_ml"
                  value={editedMetrics.water_consumed_ml || ""}
                  onChange={handleChange}
                  className="form-control mt-2"
                />
              </div>
            ) : (
              <span className="fw-bold text-end">
                {safeMetrics.water_consumed_ml !== undefined
                  ? `${safeMetrics.water_consumed_ml} ml`
                  : "Sem dados"}
              </span>
            )}
          </li>
          <li
            className="list-group-item d-flex align-items-center py-3 text-start"
            style={{ backgroundColor: "#ffffff" }}
          >
            {!isEditing && <FaWalking className="text-success fs-5" />}
            <span className="ms-3 flex-grow-1">Passos: </span>
            {isEditing ? (
              <div className="d-flex flex-column w-100">
                <input
                  type="number"
                  name="steps_count"
                  value={editedMetrics.steps_count || ""}
                  onChange={handleChange}
                  className="form-control mt-2"
                />
              </div>
            ) : (
              <span className="fw-bold text-end">
                {safeMetrics.steps_count !== undefined
                  ? `${safeMetrics.steps_count}`
                  : "Sem dados"}
              </span>
            )}
          </li>
          <li
            className="list-group-item d-flex align-items-center py-3 text-start"
            style={{ backgroundColor: "#ffffff" }}
          >
            {!isEditing && <FaWeight className="text-info fs-5" />}
            <span className="ms-3 flex-grow-1">Peso: </span>
            {isEditing ? (
              <div className="d-flex flex-column w-100">
                <input
                  type="number"
                  name="weight_kg"
                  value={editedMetrics.weight_kg || ""}
                  onChange={handleChange}
                  className="form-control mt-2"
                />
              </div>
            ) : (
              <span className="fw-bold text-end">
                {safeMetrics.weight_kg !== undefined
                  ? `${safeMetrics.weight_kg} Kg`
                  : "Sem dados"}
              </span>
            )}
          </li>
          <li
            className="list-group-item d-flex align-items-center py-3 text-start"
            style={{ backgroundColor: "#ffffff" }}
          >
            {!isEditing && <FaBed className="text-warning fs-5" />}
            <span className="ms-3 flex-grow-1">Qualidade do Sono:</span>
            {isEditing ? (
              <div className="d-flex flex-column w-100">
                <input
                  type="text"
                  name="sleep_quality"
                  value={editedMetrics.sleep_quality || ""}
                  onChange={handleChange}
                  className="form-control mt-2"
                />
              </div>
            ) : (
              <span className="fw-bold text-end">
                {safeMetrics.sleep_quality !== undefined
                  ? `${safeMetrics.sleep_quality} %`
                  : "Sem dados"}
              </span>
            )}
          </li>
          <li
            className="list-group-item d-flex align-items-center py-3 text-start"
            style={{ backgroundColor: "#ffffff" }}
          >
            {!isEditing && <FaClock className="text-dark fs-5" />}
            <span className="ms-3 flex-grow-1">Horas de Sono:</span>
            {isEditing ? (
              <div className="d-flex flex-column w-100">
                <input
                  type="number"
                  name="sleep_hours"
                  value={editedMetrics.sleep_hours || ""}
                  onChange={handleChange}
                  className="form-control mt-2"
                />
              </div>
            ) : (
              <span className="fw-bold text-end">
                {safeMetrics.sleep_hours !== undefined
                  ? `${safeMetrics.sleep_hours} h`
                  : "Sem dados"}
              </span>
            )}
          </li>
        </ul>

        <div className="d-flex justify-content-center mt-4 gap-2">
          <button className="btn btn-success" onClick={handleEditToggle}>
            {isEditing ? "Salvar" : "Editar"}
          </button>
          {isEditing && (
            <button className="btn btn-warning" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

HealthMetricsCard.propTypes = {
  currentDate: PropTypes.string.isRequired,
  dailyMetrics: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
};

export default HealthMetricsCard;
