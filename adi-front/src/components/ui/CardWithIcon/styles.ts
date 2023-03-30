import styled from 'styled-components';
import { Card } from '@adi/react-components';
import { chooseColorByContrast, defaultBoxShadow } from '@/utils/style';

const iconSize = 4;

export const Container = styled(Card)`
    position: relative;

    > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title {
        margin-left: calc(${iconSize}rem + ${({ theme }) => theme.padding}px);
    }
`;

export interface IconContainerProps {
    color: string;
    copyable?: boolean;
}

/*eslint-disable*/
export const IconContainer = styled.div<IconContainerProps>`
    height: ${iconSize}rem;
    width: ${iconSize}rem;

    margin-top: ${({ theme }) => -1 * theme.padding}px;
    margin-left: ${({ theme }) => theme.padding}px;

    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: ${({ color }) => color};

    border-radius: ${({ theme }) => theme.borderRadius}px;
    box-shadow: ${defaultBoxShadow()};

    cursor: ${({ copyable }) => (copyable ? 'pointer' : 'default')};

    > svg {
        height: ${iconSize / 2}rem;
        width: ${iconSize / 2}rem;

        color: ${({ theme }) => theme.ADIcolorWhite};
    }
`;
