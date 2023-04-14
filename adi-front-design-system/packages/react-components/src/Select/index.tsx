import type { CSSProperties, FC } from 'react';
import type { SelectProps as AntdSelectProps } from 'antd';
import { Select as AntdSelect } from 'antd';
import { SelectAllComponent, SelectAllProps } from './components/SelectAllComponent';

export type SelectOptions = AntdSelectProps['options'];

export interface SelectProps {
    id: string;
    selectAll?: SelectAllProps;
    value?: AntdSelectProps['value'];
    defaultValue?: AntdSelectProps['defaultValue'];
    options?: SelectOptions;
    mode?: AntdSelectProps['mode'];
    placeholder?: string;
    size?: AntdSelectProps['size'];
    maxTagCount?: AntdSelectProps['maxTagCount'];
    disabled?: boolean;
    allowClear?: boolean;
    block?: boolean;
    onChange?: AntdSelectProps['onChange'];
    dropdownStyle?: CSSProperties;
    style?: CSSProperties;
    className?: string;
}

export const Select: FC<SelectProps> = ({
    id,
    selectAll,
    value,
    defaultValue,
    options,
    mode,
    placeholder,
    size = 'middle',
    maxTagCount = 'responsive',
    disabled = false,
    allowClear = false,
    block = false,
    onChange,
    dropdownStyle,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdSelect
            id={'slct-' + id}
            dropdownRender={selectAll ? SelectAllComponent(selectAll) : undefined}
            value={value}
            defaultValue={defaultValue}
            options={options}
            mode={mode}
            placeholder={placeholder}
            disabled={disabled}
            allowClear={allowClear}
            size={size}
            maxTagCount={maxTagCount}
            onChange={onChange}
            dropdownStyle={dropdownStyle}
            style={{ ...style, width: block ? '100%' : undefined }}
            className={className}
        />
    );
};
