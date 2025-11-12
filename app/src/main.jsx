import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import SignUp from "./routes/SignUp";
import Login from "./routes/Login";
import Dash from "./routes/Dash";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dash" element={<Dash />} />
    </Routes>
  </BrowserRouter>,
);
