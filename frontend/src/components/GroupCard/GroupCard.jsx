
import React from "react";
import PropTypes from "prop-types";
import { FaHouseUser, FaRegCalendarTimes } from "react-icons/fa";
import { Link } from "react-router-dom"; 
import './GroupCard.css';

const GroupCard = ({ group }) => {
  const formattedDate = new Date(group.created_at).toLocaleDateString();

  return (
    <div className="card" style={{ 
      maxWidth: '300px', 
      height: '400px', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="card-body">
        <Link to={`/groups/${group.id}/posts`} className="card-title text-success">{group.name}</Link>
        <hr />
        <p className="card-text">{group.description}</p>
        <hr />
        <p className="card-text">
          <small className="text-muted d-flex align-items-center">
            <FaRegCalendarTimes className='icon' style={{ color: '#00008B' }} />
            Criado em: {formattedDate}
          </small>
        </p>
        <hr />
        <p className="card-text">
          <small className="text-muted d-flex align-items-center">
            <FaHouseUser className='icon' style={{ color: '#000000' }} />
            Criado por: Usuário {group.created_by}
          </small>
        </p>
      </div>
    </div>
  );
};

GroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    created_by: PropTypes.number.isRequired,
  }).isRequired,
};

export default GroupCard;
