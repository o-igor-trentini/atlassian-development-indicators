import { Frown, Loader2 } from 'lucide-react';
import { Col, keyframes, styled } from '@it-adi/react-components';

export const Container = styled(Col)`
    text-align: center;
`;

export const EmptyIcon = styled(Frown)`
    width: 6rem;
    height: 6rem;

    color: ${({ theme }) => (theme.variant === 'light' ? theme.ADIcolorBlack : theme.ADIcolorWhite)};
`;

const spinAnimation = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

export const LoadingIcon = styled(Loader2)`
    width: 6rem;
    height: 6rem;

    color: ${({ theme }) => (theme.variant === 'light' ? theme.ADIcolorBlack : theme.ADIcolorWhite)};

    animation-name: ${spinAnimation};
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`;
