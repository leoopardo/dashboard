import { DefaultTheme } from "styled-components";

export const defaultTheme: DefaultTheme = {
  colors: {
    dark: "#4A4A4A",
    primary: import.meta.env.VITE_APP_COLOR_PRIMARY,
    secondary: import.meta.env.VITE_APP_COLOR_SECONDARY,

    success: "#3f8600",
    paid: "#3f8600",
    refund: "#3f8600",
    refunded_withdraw: "#3f8600",
    refunded: "#3f8600",
    refund_to_merchant: "#3f8600",
    completed: "#3f8600",
    error: "#cf1322",
    canceled: "#cf1322",
    expired: "#cf1322",
    warnning: "#cfa913",
    in_analysis: "#cfa913",
    processing: "#cfa913",
    pending: "#cfa913",
    waiting: "#cfa913",
    waiting_refund: "#cfa913",
    info: "#4682B4",

    chartGreen: "#60873e",
    chartBlue: "#5f8aad",
    chartYellow: "#d1b95a",
    chartRed: "#cf4a55",
  },
};
