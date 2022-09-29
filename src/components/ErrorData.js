import { useNavigate } from "react-router-dom";

const ErrorData = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="error-content">
      <div className="failed-icon"></div>
      <div className="error-data">{error}</div>
      <div className="btn-error-holder">
        <div className="main-btn" onClick={() => navigate("/")}>
          Go to Homepage
        </div>
      </div>
    </div>
  );
};

export default ErrorData;
