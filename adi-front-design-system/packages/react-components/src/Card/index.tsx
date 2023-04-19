import type { CSSProperties, FC, ReactNode } from 'react';
import type { CardProps as AntdCardProps } from 'antd';
import { AppTheme } from '../ConfigProvider';
import { IconContainer, MyCard } from './styles';

const { useToken } = AppTheme;

export interface CardIconProps {
    color: string;
    element: ReactNode;
    onClick?: () => void;
}

export interface CardProps {
    children?: ReactNode | ReactNode[];
    icon?: CardIconProps;
    title?: ReactNode;
    hoverable?: boolean;
    bordered?: boolean;
    hidden?: boolean;
    headStyle?: AntdCardProps['headStyle'];
    bodyStyle?: AntdCardProps['bodyStyle'];
    style?: CSSProperties;
    className?: string;
}

export const Card: FC<CardProps> = ({
    children,
    icon,
    title,
    hoverable = false,
    bordered = false,
    hidden,
    headStyle,
    bodyStyle,
    style,
    className,
}): JSX.Element => {
    const { token } = useToken();

    return (
        <MyCard
            title={title}
            hoverable={hoverable}
            bordered={bordered}
            hidden={hidden}
            headStyle={{ ...headStyle, padding: token.padding }}
            bodyStyle={{ ...bodyStyle, height: '100%', padding: token.padding }}
            style={style}
            className={className}
        >
            {icon && (
                <IconContainer color={icon.color} copyable={!!icon.onClick}>
                    {icon.element}
                </IconContainer>
            )}

            {children}
        </MyCard>
    );
};
