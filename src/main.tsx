import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext/index.tsx";
import { MenuProvider } from "./contexts/SidebarContext/index.tsx";
import "./i18n.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthProvider>
    <MenuProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </MenuProvider>
  </AuthProvider>
);
