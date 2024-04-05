import { DefaultTheme } from "styled-components";

export const defaultTheme: DefaultTheme = {
  colors: {
    dark: "#4A4A4A",
    grey: "#00000073",
    primary: import.meta.env.VITE_APP_COLOR_PRIMARY,
    secondary: import.meta.env.VITE_APP_COLOR_SECONDARY,

    active: "#3f8600",
    success: "#3f8600",
    paid: "#3f8600",
    refund: "#3f8600",
    refunded_withdraw: "#3f8600",
    refunded: "#3f8600",
    refund_to_merchant: "#3f8600",
    completed: "#3f8600",
    paid_to_merchant: "#3f8600",
    paid_to_end_user: "#3f8600",
    refund_to_end_user: "#3f8600",
    error: "#cf1322",
    canceled: "#cf1322",
    expired: "#cf1322",
    invalid: "#cf1322",
    expiring_in_30_days:"#cfa913",
    warnning: "#cfa913",
    in_analysis: "#cfa913",
    processing: "#cfa913",
    pending: "#cfa913",
    waiting: "#cfa913",
    waiting_refund: "#cfa913",
    waiting_refund_to_end_user: "#cfa913",
    info: "#4682B4",
 

    chartGreen: "#60873e",
    chartBlue: "#5f8aad",
    chartYellow: "#d1b95a",
    chartRed: "#cf4a55",
  },
};
