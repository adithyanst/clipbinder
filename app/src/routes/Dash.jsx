import { useNavigate } from "react-router-dom";

function Dash() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("jwt");

    navigate("/");
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 rounded-[12px] border-[#515151] border-[1.5px] border-solid bg-[#1B1B1B] px-12 py-6 text-white">
        dashboard
        <button onClick={handleLogout} type="button">
          log out
        </button>
      </div>
    </main>
  );
}

export default Dash;
