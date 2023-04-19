import { styled, Text } from '@it-adi/react-components';

// TODO: Adicionar breakpoints na lib de componentes

export const DisplayText = styled(Text)`
    @media (max-width: 576px) {
        display: none;
    }
`;
