import { CSSProperties, FC, ReactNode } from 'react';
import { Typography } from 'antd';

export type TitleSize =
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl';

export interface TitleProps {
    children: ReactNode | ReactNode[];
    level?: 1 | 2 | 3 | 4 | 5;
    size?: TitleSize;
    italic?: boolean;
    copyable?: boolean;
    color?: string;
    style?: CSSProperties;
    className?: string;
}

// TODO: Exporar sizes em tokens

export const Title: FC<TitleProps> = ({
    children,
    level,
    size = 'md',
    italic = false,
    copyable = false,
    color,
    style,
    className,
}): JSX.Element => {
    const sizes: Record<TitleSize, string> = {
        xxs: '0.625rem',
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.25rem',
        '6xl': '3rem',
        '7xl': '4rem',
        '8xl': '4.5rem',
        '9xl': '6rem',
    };

    return (
        <Typography.Title
            level={level}
            italic={italic}
            copyable={copyable}
            style={{ ...style, color: color, fontSize: sizes[size] }}
            className={className}
        >
            {children}
        </Typography.Title>
    );
};
