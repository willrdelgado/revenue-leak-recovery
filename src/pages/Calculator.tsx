import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Calculator = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page since calculator is now integrated there
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Calculator;
