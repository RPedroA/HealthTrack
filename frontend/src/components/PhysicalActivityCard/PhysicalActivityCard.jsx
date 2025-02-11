import PropTypes from "prop-types";
import { FaRunning, FaBicycle, FaDumbbell, FaFire } from "react-icons/fa";
import { usePhysicalActivityCardLogic } from "./PhysicalActivityCardLogic";
import "./PhysicalActivityCard.css";

const PhysicalActivityCard = ({ activity, activityDate, onDelete, onAdd }) => {
  const {
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
  } = usePhysicalActivityCardLogic({ activity, onDelete, onAdd });

  return (
    <div>
      <div className="text-center mb-3">
        <button className="btn btn-success" onClick={handleAdd}>
          Nova Atividade
        </button>
      </div>

      {isAdding && (
        <div className="container d-flex justify-content-center">
          <div className="card mt-4 mx-auto p-3 shadow-lg">
            <h5 className="card-title text-center">Nova Atividade</h5>
            <div className="form-group">
              <label>Tipo de Atividade</label>
              <input
                type="text"
                name="activity_type"
                value={newActivity.activity_type}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Duração (minutos)</label>
              <input
                type="number"
                name="duration_minutes"
                value={newActivity.duration_minutes}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Calorias Queimadas</label>
              <input
                type="number"
                name="calories_burned"
                value={newActivity.calories_burned}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-success" onClick={handleConfirmAdd}>
                Adicionar
              </button>
              <button className="btn btn-warning ms-2" onClick={handleCancelAdd}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container d-flex justify-content-center">
        <div className="card mt-4 mx-auto p-3 shadow-lg">
          <h5 className="card-title">
            {isEditing ? (
              <input
                type="text"
                name="activity_type"
                value={editedActivity.activity_type || "Não definido"}
                onChange={handleInputChange}
                className="form-control text-center"
                style={{ maxWidth: "200px", margin: "0 auto" }}
              />
            ) : (
              editedActivity.activity_type || "Não definido"
            )}
          </h5>
          <h6 className="text-muted mb-3">{activityDate || "Data não disponível"}</h6>
          <ul className="list-group list-group-flush fs-6">
            <li className="list-group-item d-flex align-items-center py-3 text-start">
            <FaRunning style={{ color: "#007bff" }} className="fs-5" />;
              <span className="ms-3 flex-grow-1">Duração:</span>
              {isEditing ? (
                <input
                  type="number"
                  name="duration_minutes"
                  value={editedActivity.duration_minutes || ""}
                  onChange={handleInputChange}
                  className="form-control text-end"
                  style={{ maxWidth: "80px" }}
                />
              ) : (
                <span className="fw-bold text-end">
                  {editedActivity.duration_minutes ? `${editedActivity.duration_minutes} minutos` : "Não definido"}
                </span>
              )}
            </li>
            <li className="list-group-item d-flex align-items-center py-3 text-start">
              <FaFire className="text-danger fs-5" />
              <span className="ms-3 flex-grow-1">Calorias Queimadas:</span>
              {isEditing ? (
                <input
                  type="number"
                  name="calories_burned"
                  value={editedActivity.calories_burned || ""}
                  onChange={handleInputChange}
                  className="form-control text-end"
                  style={{ maxWidth: "80px" }}
                />
              ) : (
                <span className="fw-bold text-end">
                  {editedActivity.calories_burned ? `${editedActivity.calories_burned} kcal` : "Não definido"}
                </span>
              )}
            </li>
          </ul>

          <div className="text-center mt-3">
            {isEditing ? (
              <div>
                <button className="btn btn-success" onClick={handleSave}>
                  Salvar
                </button>
                <button className="btn btn-warning ms-2" onClick={handleCancel}>
                  Cancelar
                </button>
                <button className="btn btn-danger ms-2" onClick={handleDelete}>
                  Excluir
                </button>
              </div>
            ) : (
              <button className="btn btn-success" onClick={() => setIsEditing(true)}>
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PhysicalActivityCard.propTypes = {
  activity: PropTypes.shape({
    activity_type: PropTypes.string,
    duration_minutes: PropTypes.number,
    calories_burned: PropTypes.number,
  }),
  activityDate: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

PhysicalActivityCard.defaultProps = {
  activity: {
    activity_type: "Não definido",
    duration_minutes: 0,
    calories_burned: 0,
  },
  activityDate: "Data não disponível",
};

export default PhysicalActivityCard;
