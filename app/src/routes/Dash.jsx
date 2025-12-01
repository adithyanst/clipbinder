import { useNavigate } from "react-router-dom";

function Dash() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("jwt");

    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center text-white">
      dashboard
      <button onClick={handleLogout} type="button">
        log out
      </button>
    </div>
  );
}

export default Dash;
