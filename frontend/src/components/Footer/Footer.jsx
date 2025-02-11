import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p>&copy; 2023 HealthTrack. Todos os direitos reservados.</p>
          </div>
          <div className="col-md-6 text-md-right">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link className="text-white">
                  Lorem
                </Link>
              </li>
              <li className="list-inline-item">
                <Link className="text-white">
                  Lorem
                </Link>
              </li>
              <li className="list-inline-item">
                <Link className="text-white">
                  Lorem
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
