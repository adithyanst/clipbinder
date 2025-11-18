import { useEffect } from "react";
import clipbinderLogo from "./assets/clipbinder.svg";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      navigate("/dash");
      return;
    }
  }, [navigate]);

  return (
    <div className="flex gap-2">
      <span className="opacity-50">welcome to</span>
      <img src={clipbinderLogo} alt="logotype for clipbinder" />
      <span className="opacity-50">would you like to</span>
      <a href="/login" className="text-blue-400 hover:underline">
        login
      </a>
      <span className="opacity-50">or</span>
      <a href="/signup" className="text-blue-400 hover:underline">
        signup
      </a>
    </div>
  );
}

export default App;
