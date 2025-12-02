import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoadingContext from "../contexts/loadingContext";

function Dash() {
  const navigate = useNavigate();
  const [clips, setClips] = useState([]);
  const [page, setPage] = useState(0);

  const loadingContext = useContext(LoadingContext);

  function handleLogout() {
    localStorage.removeItem("jwt");

    navigate("/");
  }

  useEffect(() => {
    loadingContext.setLoading(true);

    const token = localStorage.getItem("jwt");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/get?limit=5&page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        setClips(jsonRes);
        loadingContext.setLoading(false);
      });
  }, [page]);

  return (
    <div className="flex flex-col items-center justify-center text-white">
      dashboard
      <button onClick={handleLogout} type="button">
        log out
      </button>
      {clips.map((x) => (
        <div key={x.id}>{x.id}</div>
      ))}
    </div>
  );
}

export default Dash;
