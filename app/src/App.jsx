import { useEffect } from "react";
import clipbinderLogo from "./assets/clipbinder.svg";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "./services/api.js";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      navigate("/dash");
      return;
    }
  }, [navigate]);

  return (
    <div className="flex w-max gap-2 px-8 py-4" data-tauri-drag-region>
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
