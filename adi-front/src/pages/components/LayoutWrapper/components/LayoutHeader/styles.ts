import { Button, chooseColorByContrast, Col, Layout, Row, styled } from '@it-adi/react-components';

export const Container = styled(Layout.Header)`
    width: 100vw;
    height: ${({ theme }) => theme.ADIHeaderHeight};

    position: fixed;
    top: 0;
    z-index: 1;

    background-color: ${({ theme }) => theme.ADIcolorSecondary};
`;

export const ContentContainer = styled(Row)`
    height: 100%;
`;

/*eslint-disable*/
export const MenuButton = styled(Button)`
    > svg {
        width: 1.25rem;
        height: 1.25rem;

        color: ${({ theme }) =>
            chooseColorByContrast(theme.ADIcolorSecondary, theme.ADIcolorBlack, theme.ADIcolorWhite)};
    }
`;
/*eslint-enable*/

export const DrawerContentContainer = styled(Row)`
    height: 100%;
`;

export const DrawerContentFooter = styled(Col)`
    margin-top: 100%;
`;

export const SwitchThemeButton = styled(Button)`
    margin-top: 100%;
`;
