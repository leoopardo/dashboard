import { DefaultTheme } from "styled-components";

export const defaultTheme: DefaultTheme = {
  colors: {
    dark: "#4A4A4A",
    primary: import.meta.env.VITE_APP_COLOR_PRIMARY,
    secondary: import.meta.env.VITE_APP_COLOR_SECONDARY,

    success: "#3f8600",
    paid: "#3f8600",
    refund: "#3f8600",
    error: "#cf1322",
    canceled: "#cf1322",
    warnning: "#cfa913",
    waiting: "#cfa913",
    waiting_refund: "#cfa913",
  },
};
