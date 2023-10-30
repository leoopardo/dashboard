import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export const useSetTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    setCurrentTheme(`${secureLocalStorage.getItem("theme")}`);
  }, []);

  useEffect(() => {
    secureLocalStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return { currentTheme, setCurrentTheme };
};
