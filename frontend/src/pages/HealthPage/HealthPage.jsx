import { useEffect, useState } from "react";
import NavbarB from "../../components/NavbarB/NavbarB";
import { useHealthPageLogic } from "./HealthPageLogic";
import HealthMetricsCard from "../../components/HealthMetricsCard/HealthMetricsCard";
import PhysicalActivityCard from "../../components/PhysicalActivityCard/PhysicalActivityCard";
import GoalsList from "../../components/GoalsList/GoalsList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HealthPage.css";

const HealthPage = () => {
  document.body.style.backgroundColor = "#e6f2e6";

  const {
    dailyMetrics,
    date,
    handleDateChange,
    handleSave, 
    physicalActivities = [],
  } = useHealthPageLogic();

  return (
    <div className="page-wrapper">
      <NavbarB />
      <div className="content-wrapper d-flex flex-column align-items-center pt-5">
        <div className="container d-flex flex-column align-items-center">
          <div style={{ maxWidth: "600px", width: "100%", minWidth: "400px" }}>
            <div className="mb-4 text-start">
              <label
                htmlFor="datePicker"
                className="form-label text-success"
                style={{ fontSize: "1rem", marginBottom: "5px" }}
              >
                Escolha a data
              </label>
              <input
                type="date"
                id="datePicker"
                className="form-control shadow-sm custom-date-input"
                value={date}
                onChange={handleDateChange}
              />
            </div>
            <HealthMetricsCard
              currentDate={date}
              dailyMetrics={dailyMetrics} 
              onEdit={handleSave} 
            />
          </div>
        </div>

        <div className="activities-container mt-5">
          <h4 className="text-center text-success mb-3 big-bold pb-3">
            Atividades Físicas do Dia
          </h4>
          <div className="d-flex flex-wrap justify-content-center">
            {physicalActivities.map((activity, index) => (
              <PhysicalActivityCard
                key={index}
                activity={activity}
                activityDate={date}
              />
            ))}
          </div>
        </div>

        <div className="goals-container mt-5">
          <h4 className="text-center text-success mb-3 big-bold pb-3">
            Objetivos
          </h4>
          <GoalsList
            goals={[]}
            onEditGoal={() => {}}
            onSaveGoal={() => {}}
            handleDeleteGoal={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
