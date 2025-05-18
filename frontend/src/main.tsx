import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "@/styles.css";
import App from "./app";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
