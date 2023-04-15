import { Frown } from 'lucide-react';
import { styled } from '@it-adi/react-components';

export const Icon = styled(Frown)`
    width: 6rem;
    height: 6rem;

    color: ${({ theme }) => (theme.variant === 'light' ? theme.ADIcolorBlack : theme.ADIcolorWhite)};
`;
