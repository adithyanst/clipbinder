import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./Layout";
import { BrowserRouter } from "react-router-dom";
import { LoadingContextProvider } from "./contexts/loadingContext";
import { ClipsContextProvider } from "./contexts/clipsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClipsContextProvider>
    <LoadingContextProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LoadingContextProvider>
  </ClipsContextProvider>,
);
