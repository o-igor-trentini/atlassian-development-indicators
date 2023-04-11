import scStyled, {
    createGlobalStyle,
    ThemeProvider as scThemeProvider,
    ServerStyleSheet as scServerStyleSheet,
} from 'styled-components';
import { chooseColorByContrast } from '../utils';
import { ThemeType } from '../theme';

export const GlobalStyle = createGlobalStyle<ThemeType>`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
    
  ::selection {
    color: ${({ colorPrimary, ADIcolorBlack, ADIcolorWhite }) =>
        chooseColorByContrast(colorPrimary, ADIcolorBlack, ADIcolorWhite)};
    background-color: ${({ colorPrimary }) => colorPrimary};
  }
  
  // Margem para o botão detro de um formulário
  // devio a ele não ficar centralizado com os inputs
  .ant-form-item-control-input-content {
    > button {
      margin-top: 30px; 
    }
  }
`;

export const ThemeProvider = scThemeProvider;
export const ServerStyleSheet = scServerStyleSheet;
export const styled = scStyled;
