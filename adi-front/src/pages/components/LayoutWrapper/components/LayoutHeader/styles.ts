import styled from 'styled-components';
import { Button, Layout } from '@adi/react-components';
import { chooseColorByContrast } from '@/utils/style';

export const Container = styled(Layout.Header)`
    background-color: ${({ theme }) => theme.ADIcolorSecondary};
`;

/*eslint-disable*/
export const MenuButton = styled(Button)`
    > svg {
        color: ${({ theme }) =>
            chooseColorByContrast(theme.ADIcolorSecondary, theme.ADIcolorBlack, theme.ADIcolorWhite)};
    }
`;
