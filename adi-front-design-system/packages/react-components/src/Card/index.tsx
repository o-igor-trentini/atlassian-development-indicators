import type { CSSProperties, FC, ReactNode } from 'react';
import { Card as AntdCard } from 'antd';
import type { CardProps as AntdCardProps } from 'antd';
import { AppTheme } from '../ConfigProvider';

const { useToken } = AppTheme;

export interface CardProps {
    children?: ReactNode | ReactNode[];
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
        <AntdCard
            title={title}
            hoverable={hoverable}
            bordered={bordered}
            hidden={hidden}
            headStyle={{ ...headStyle, padding: token.padding }}
            bodyStyle={{ ...bodyStyle, height: '100%', padding: token.padding }}
            style={style}
            className={className}
        >
            {children}
        </AntdCard>
    );
};
