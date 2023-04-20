import { Card as AntdCard } from 'antd';
import { styled } from '../styles/global';
import { defaultBoxShadow } from '../styles/utils';

const iconSize = 4;

export const MyCard = styled(AntdCard)<{
    $hasiconprop?: boolean;
}>`
    position: relative;

    > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title {
        margin-left: ${({ theme, $hasiconprop }) => ($hasiconprop ? `calc(${iconSize}rem + ${theme.padding}px)` : '')};
    }
`;

export interface IconContainerProps {
    color: string;
    copyable?: boolean;
}

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
