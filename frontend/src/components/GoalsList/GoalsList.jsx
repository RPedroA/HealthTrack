// GoalsList.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaEdit, FaCheck, FaClock } from "react-icons/fa";
import "./GoalsList.css";
import GoalsListLogic from "./GoalsListLogic.js"; 

const GoalsList = ({ goals = [], onSaveGoal}) => {
  
  const {
    newGoal,
    filteredGoals,
    editingGoalId,
    editedGoal,
    filter,
    changeFilter, 
    handleEditGoal,
    handleSaveGoal,
    handleCancelEdit,
    handleInputChange,
    handleNewGoalChange,
    handleCreateGoal,
    handleDeleteGoal,
    setNewGoal,
  } = GoalsListLogic(onSaveGoal, goals);

  return (
    <div className="container">
      <div className="d-flex justify-content-center mb-4">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => changeFilter(e.target.value)} 
        >
          <option value="Todos">Todos</option>
          <option value="Em Progresso">Em Progresso</option>
          <option value="Concluído">Concluído</option>
          <option value="Abandonado">Abandonado</option>
        </select>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-success"
          onClick={() =>
            setNewGoal({
              title: "",
              description: "",
              target_value: 0,
              status: "",
            })
          }
        >
          Novo Objetivo
        </button>
      </div>

      {newGoal && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <div
            className="card goal-card m-3 shadow-lg "
            style={{
              maxWidth: "550px",
              width: "100%",
              borderRadius: "15px",
              background: "#ffffff",
              padding: "20px",
            }}
          >
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Título"
              value={newGoal.title}
              onChange={(e) => handleNewGoalChange("title", e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Descrição"
              value={newGoal.description}
              onChange={(e) => handleNewGoalChange("description", e.target.value)}
            ></textarea>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Valor Alvo"
              value={newGoal.target_value}
              onChange={(e) => handleNewGoalChange("target_value", e.target.value)}
            />
            <select
              className="form-select mb-2"
              value={newGoal.status}
              onChange={(e) => handleNewGoalChange("status", e.target.value)}
            >
              <option value="Em Progresso">Em Progresso</option>
              <option value="Concluído">Concluído</option>
              <option value="Abandonado">Abandonado</option>
            </select>
            <div className="d-flex justify-content-center">
              <button className="btn btn-success me-2" onClick={handleCreateGoal}>
                Salvar
              </button>
              <button className="btn btn-warning" onClick={() => setNewGoal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-center">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="card goal-card m-3 shadow-lg"
            style={{
              maxWidth: "550px",
              width: "100%",
              borderRadius: "15px",
              background: "#ffffff",
              padding: "20px",
            }}
          >
            {editingGoalId === goal.id ? (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editedGoal.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  value={editedGoal.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                ></textarea>
                <input
                  type="number"
                  className="form-control mb-2"
                  value={editedGoal.target_value}
                  onChange={(e) =>
                    handleInputChange("target_value", e.target.value)
                  }
                />
                <select
                  className="form-select mb-2"
                  value={editedGoal.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="Em Progresso">Em Progresso</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Abandonado">Abandonado</option>
                </select>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-success me-2" onClick={handleSaveGoal}>
                    Salvar
                  </button>
                  <button className="btn btn-warning me-2" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteGoal(goal)}>
                    Excluir
                  </button>
                </div>
              </>
            ) : (
              <>
                <h5 className="text-success fw-bold pb-3">{goal.title}</h5>
                <ul className="list-group list-group-flush fs-6">
                  <li
                    className="list-group-item d-flex align-items-center py-3 text-start"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <FaEdit className="text-primary me-2" />
                    <span className="ms-3 flex-grow-1">Descrição: </span>
                    <span className="fw-bold text-end">{goal.description}</span>
                  </li>
                  <li
                    className="list-group-item d-flex align-items-center py-3 text-start"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <FaCheck className="text-danger me-2" />
                    <span className="ms-3 flex-grow-1">Valor Alvo: </span>
                    <span className="fw-bold text-end">
                      {goal.target_value}
                    </span>
                  </li>
                  <li
                    className="list-group-item d-flex align-items-center py-3 text-start"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <FaClock className="text-dark me-2" />
                    <span className="ms-3 flex-grow-1">Status: </span>
                    <span className="fw-bold text-end">{goal.status}</span>
                  </li>
                </ul>
                <div className="d-flex justify-content-center pt-3">
                  <button className="btn btn-success me-2" onClick={() => handleEditGoal(goal)}>
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

GoalsList.propTypes = {
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      target_value: PropTypes.number,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ),
  onSaveGoal: PropTypes.func.isRequired,
  handleDeleteGoal: PropTypes.func.isRequired, 
};


export default GoalsList;
