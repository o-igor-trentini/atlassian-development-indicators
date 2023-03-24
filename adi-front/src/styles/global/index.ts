import { createGlobalStyle } from 'styled-components';
import { chooseColorByContrast } from '@/utils/style';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  ::selection {
    color: ${({ theme }) => chooseColorByContrast(theme.colorPrimary, theme.ADIcolorBlack, theme.ADIcolorWhite)};
    background-color: ${({ theme }) => theme.colorPrimary};
  }
  
  // Marge para o botão detro de um formulário
  // devio a ele não ficar centralizado com os inputs
  .ant-form-item-control-input-content {
    > button {
      margin-top: 30px; 
    }
  }
`;
