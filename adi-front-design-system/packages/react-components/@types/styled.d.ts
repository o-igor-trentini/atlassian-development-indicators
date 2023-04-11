import "styled-components";
import { ThemeType } from "@adi/react-components/src";

declare module "styled-components" {
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
