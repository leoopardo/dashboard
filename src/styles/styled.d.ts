import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      dark: string;
      primary: string;
      secondary: string;
      success: string;
      paid: string;
      refund: string;
      error: string;
      canceled: string;
      warnning: string;
      waiting: string;
      waiting_refund: string;
    };
  }
}
