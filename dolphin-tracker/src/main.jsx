import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import "./App.scss";
import "./index.css";

const root = createRoot(document.getElementById("root")); // Use createRoot

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
