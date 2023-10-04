import { useEffect, useState } from "react";

export const useSetTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    setCurrentTheme(`${localStorage.getItem("theme")}`);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return { currentTheme, setCurrentTheme };
};
