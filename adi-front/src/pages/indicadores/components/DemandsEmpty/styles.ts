import styled from 'styled-components';
import { Frown } from 'lucide-react';

export const Icon = styled(Frown)`
    width: 6rem;
    height: 6rem;

    color: ${({ theme }) => (theme.variant === 'light' ? theme.ADIcolorBlack : theme.ADIcolorWhite)};
`;
