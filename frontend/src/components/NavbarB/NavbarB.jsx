import { Link, useLocation } from "react-router-dom";

const NavbarB = () => {
  const location = useLocation(); 
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/icon_ht.png"
              alt="Logo"
              style={{ width: '30px', height: '30px', marginRight: '10px' }}
            />
            <span>HealthTrack</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/health"
                className={`nav-link ${location.pathname === '/health' ? 'active' : ''}`}
              >
                Health
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/groups"
                className={`nav-link ${location.pathname === '/groups' ? 'active' : ''}`}
              >
                Groups
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user"
                className={`nav-link ${location.pathname === '/user' ? 'active' : ''}`}
              >
                Perfil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarB;
