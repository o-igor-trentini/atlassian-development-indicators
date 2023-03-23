import { CSSProperties, FC, ReactNode } from 'react';
import { Button as AntdButton } from 'antd';
import type { ButtonProps as AntdButtonProps } from 'antd';

export interface ButtonProps {
    children?: ReactNode;
    id: string;
    variant?: AntdButtonProps['type'];
    type?: AntdButtonProps['htmlType'];
    size?: AntdButtonProps['size'];
    icon?: AntdButtonProps['icon'];
    disabled?: boolean;
    block?: boolean;
    onClick?: AntdButtonProps['onClick'];
    style?: CSSProperties;
    className?: string;
}

export const Button: FC<ButtonProps> = ({
    id,
    children,
    variant = 'default',
    type = 'button',
    size = 'middle',
    icon,
    disabled = false,
    block = false,
    onClick,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdButton
            id={'btn-' + id}
            type={variant}
            htmlType={type}
            size={size}
            icon={icon}
            disabled={disabled}
            block={block}
            onClick={onClick}
            style={style}
            className={className}
        >
            {children}
        </AntdButton>
    );
};
