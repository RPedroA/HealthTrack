import Navbar from "../../components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  document.body.style.backgroundColor = '#e6f2e6';

  return (
    <div className="page-wrapper">  
      <Navbar />
      
      <div className="content-wrapper">  
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="bg-light p-5 rounded shadow mx-5 my-5">
            <div className="text-center">
              <h1 className="text-success display-4 mb-4 bold-text">
                Seja Bem Vindo ao HealthTrack
              </h1>
              <p className="lead mb-4 text-decoration-underline">
                Transforme sua saúde com o nosso site
              </p>
              <Link to="/login" className="btn btn-success btn-lg">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
