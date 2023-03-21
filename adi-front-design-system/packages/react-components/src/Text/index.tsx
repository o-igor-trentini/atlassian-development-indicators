import { CSSProperties, FC, ReactNode } from 'react';
import { Typography } from 'antd';

export type TextSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';

export interface TextProps {
    children: ReactNode | ReactNode[];
    size?: TextSize;
    italic?: boolean;
    strong?: boolean;
    color?: string;
    style?: CSSProperties;
    className?: string;
}

export const Text: FC<TextProps> = ({
    children,
    size = 'md',
    italic = false,
    strong = false,
    color,
    style,
    className,
}): JSX.Element => {
    const sizes: Record<TextSize, string> = {
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
        <Typography.Text
            strong={strong}
            italic={italic}
            style={{ ...style, color: color, fontSize: sizes[size] }}
            className={className}
        >
            {children}
        </Typography.Text>
    );
};
