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

  return loadingContext.loading ? (
    <div className="flex w-200 flex-col items-center justify-center text-white">loading</div>
  ) : (
    <div className="flex w-200 items-center justify-center text-white">
      <div className="w-[30%]">
        {clips.map((x) => (
          <div key={x.id}>
            <p>{`${x.data.slice(0, 20)}...`}</p>
          </div>
        ))}
      </div>
      <div className="w-[70%]">right side</div>
    </div>
  );
}

export default Dash;
