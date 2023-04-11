import { CSSProperties, FC, ReactNode } from 'react';
import type { ButtonProps as AntdButtonProps } from 'antd';
import { MyButton } from './styles';

export interface ButtonProps {
    children?: ReactNode;
    id: string;
    variant?: AntdButtonProps['type'];
    type?: AntdButtonProps['htmlType'];
    size?: AntdButtonProps['size'];
    icon?: AntdButtonProps['icon'];
    disabled?: boolean;
    loading?: boolean;
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
    loading = false,
    onClick,
    style,
    className,
}): JSX.Element => {
    return (
        <MyButton
            id={'btn-' + id}
            type={variant}
            htmlType={type}
            size={size}
            icon={icon}
            disabled={disabled}
            block={block}
            loading={loading}
            onClick={onClick}
            style={style}
            className={className}
        >
            {children}
        </MyButton>
    );
};
