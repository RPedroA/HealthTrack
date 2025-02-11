
import React from "react";
import PropTypes from "prop-types";

const GroupCreateForm = ({ createdGroup, handleInputChange, handleSave, handleCancel }) => {
  return (
    <div className="card-container mt-4 mx-auto shadow-lg">
      <h4 className="card-title text-success">Criar Novo Grupo</h4>

      <form>
        <div className="mb-3">
          <label className="form-label">Nome do Grupo</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={createdGroup.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={createdGroup.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-success" onClick={handleSave}>
            Criar Grupo
          </button>
          <button type="button" className="btn btn-danger" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

GroupCreateForm.propTypes = {
  createdGroup: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default GroupCreateForm;
