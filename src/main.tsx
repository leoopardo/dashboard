import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MenuProvider } from "./contexts/SidebarContext/index.tsx";
import { QueryClientProvider } from "react-query";
import "./i18n.ts";
import { queryClient } from "./services/queryClient.ts";
import { StyledThemeProvider } from "./contexts/ThemeContext/index.tsx";
import { TotalizerProvider } from "./contexts/totalizerContext/index.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <StyledThemeProvider>
      <MenuProvider>
        <TotalizerProvider>
          <App />
        </TotalizerProvider>
      </MenuProvider>
    </StyledThemeProvider>
  </QueryClientProvider>
);
