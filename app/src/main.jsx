import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./Layout";
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>,
);
