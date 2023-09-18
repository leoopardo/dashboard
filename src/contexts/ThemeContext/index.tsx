/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContext {
  setTheme(theme: "dark" | "light"): void;
  theme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContext>({} as ThemeContext);

export const StyledThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
