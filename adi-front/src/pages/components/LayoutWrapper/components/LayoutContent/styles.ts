import styled from 'styled-components';
import { Layout } from '@adi/react-components';

export const Container = styled(Layout.Content)`
    margin-top: ${({ theme }) => theme.ADIHeaderHeight};
    padding: 1rem;
    overflow-x: hidden;
`;
