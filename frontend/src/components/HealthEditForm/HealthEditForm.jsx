import PropTypes from "prop-types";
import "./HealthEditForm.css";

const HealthEditForm = ({ editedMetrics, handleInputChange, handleSave, handleCancel }) => {
  return (
    <div className="card-container mt-4 mx-auto shadow-lg">
      <h4 className="card-title text-success">Editar Estatísticas Diárias</h4>

      <form>
        <div className="mb-3">
          <label className="form-label">Calorias Consumidas</label>
          <input
            type="text"
            className="form-control no-arrows"
            name="calories_consumed"
            value={editedMetrics.calories_consumed}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Água Consumida (ml)</label>
          <input
            type="text"
            className="form-control no-arrows"
            name="water_consumed_ml"
            value={editedMetrics.water_consumed_ml}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Passos</label>
          <input
            type="text"
            className="form-control no-arrows"
            name="steps_count"
            value={editedMetrics.steps_count}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Peso (kg)</label>
          <input
            type="text"
            className="form-control no-arrows"
            name="weight_kg"
            value={editedMetrics.weight_kg}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Qualidade do Sono</label>
          <input
            type="text"
            className="form-control no-arrows"
            name="sleep_quality"
            value={editedMetrics.sleep_quality}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Horas de Sono</label>
          <input
            type="text"
            className="form-control no-arrows"
            name="sleep_hours"
            value={editedMetrics.sleep_hours}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-success" onClick={handleSave}>
            Salvar Alterações
          </button>
          <button type="button" className="btn btn-danger" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

HealthEditForm.propTypes = {
  editedMetrics: PropTypes.shape({
    calories_consumed: PropTypes.string.isRequired,
    water_consumed_ml: PropTypes.string.isRequired,
    steps_count: PropTypes.string.isRequired,
    weight_kg: PropTypes.string.isRequired,
    sleep_quality: PropTypes.string.isRequired,
    sleep_hours: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default HealthEditForm;
