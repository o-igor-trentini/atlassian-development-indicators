import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  // Marge para o botão detro de um formulário
  // devio a ele não ficar centralizado com os inputs
  .ant-form-item-control-input-content {
    > button {
      margin-top: 30px; 
    }
  }
`;
