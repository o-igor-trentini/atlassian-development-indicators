import type { CSSProperties, FC } from 'react';
import { Select as AntdSelect } from 'antd';
import type { SelectProps as AntdSelectProps } from 'antd';

export type SelectOptions = AntdSelectProps['options'];

export interface SelectProps {
    id: string;
    value?: AntdSelectProps['value'];
    defaultValue?: AntdSelectProps['defaultValue'];
    options?: SelectOptions;
    mode?: AntdSelectProps['mode'];
    placeholder?: string;
    size?: AntdSelectProps['size'];
    disabled?: boolean;
    block?: boolean;
    onChange?: AntdSelectProps['onChange'];
    style?: CSSProperties;
    className?: string;
}

export const Select: FC<SelectProps> = ({
    id,
    value,
    defaultValue,
    options,
    mode,
    placeholder,
    size = 'middle',
    disabled = false,
    block = false,
    onChange,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdSelect
            id={'slct-' + id}
            value={value}
            defaultValue={defaultValue}
            options={options}
            mode={mode}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            onChange={onChange}
            style={{ ...style, width: block ? '100%' : undefined }}
            className={className}
        />
    );
};
