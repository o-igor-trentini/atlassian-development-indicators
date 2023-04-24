import type { CSSProperties, FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
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
    //eslint-disable-next-line
    onChange?: (e: any) => void;
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
    const [isAllItemsSelected, setIsAllItemsSelected] = useState<boolean>(
        defaultValue?.length === options?.length ?? false,
    );

    const dropdownRender = selectAll ? SelectAllComponent(selectAll, isAllItemsSelected) : undefined;

    const handleChange = useCallback(
        //eslint-disable-next-line
        (item: any): void => {
            if (onChange) onChange(item);
        },
        [onChange],
    );

    useEffect(() => {
        if (!options || !selectAll || (!value?.length && !defaultValue?.length)) return;

        const item: number = value.length || defaultValue.length;

        setIsAllItemsSelected(item === options.length);
    }, [value, defaultValue, options, selectAll]);

    return (
        <AntdSelect
            id={'slct-' + id}
            /*eslint-disable*/
            dropdownRender={dropdownRender}
            /*eslint-enable*/
            value={value}
            defaultValue={defaultValue}
            options={options}
            mode={mode}
            placeholder={placeholder}
            disabled={disabled}
            allowClear={allowClear}
            size={size}
            maxTagCount={maxTagCount}
            onChange={handleChange}
            dropdownStyle={dropdownStyle}
            style={{ ...style, width: block ? '100%' : undefined }}
            className={className}
        />
    );
};
