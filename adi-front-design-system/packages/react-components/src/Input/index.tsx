import type { CSSProperties, FC } from 'react';
import { Input as AntdInput } from 'antd';
import type { InputProps as AntdInputProps } from 'antd';

export interface InputProps {
    id: string;
    value?: AntdInputProps['value'];
    placeholder?: string;
    size?: AntdInputProps['size'];
    disabled?: boolean;
    block?: boolean;
    onChange?: AntdInputProps['onChange'];
    style?: CSSProperties;
    className?: string;
}

export const Input: FC<InputProps> = ({
    id,
    value,
    placeholder,
    size = 'middle',
    disabled = false,
    block = false,
    onChange,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdInput
            id={'ipt-' + id}
            autoComplete="off"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            onChange={onChange}
            style={{ ...style, width: block ? '100%' : undefined }}
            className={className}
        />
    );
};
