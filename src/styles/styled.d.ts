import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      dark: string;
      primary: string;
      secondary: string;
    };
  }
}
