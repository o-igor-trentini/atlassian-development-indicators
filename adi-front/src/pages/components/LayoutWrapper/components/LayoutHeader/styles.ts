import { Button, chooseColorByContrast, Layout, styled } from '@adi/react-components';

export const Container = styled(Layout.Header)`
    width: 100vw;
    height: ${({ theme }) => theme.ADIHeaderHeight};

    position: fixed;
    top: 0;
    z-index: 1;

    background-color: ${({ theme }) => theme.ADIcolorSecondary};
`;

/*eslint-disable*/
export const MenuButton = styled(Button)`
    > svg {
        color: ${({ theme }) =>
            chooseColorByContrast(theme.ADIcolorSecondary, theme.ADIcolorBlack, theme.ADIcolorWhite)};
    }
`;
