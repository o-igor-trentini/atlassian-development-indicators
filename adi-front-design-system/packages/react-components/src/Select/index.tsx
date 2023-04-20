import type { CSSProperties, FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { SelectProps as AntdSelectProps } from 'antd';
import { Select as AntdSelect } from 'antd';
import { SelectAllComponent, SelectAllProps } from './components/SelectAllComponent';

export type SelectOptions = AntdSelectProps['options'];
//eslint-disable-next-line
export type SelectOnChange = { value: any; option: any | any[] };

export interface SelectProps {
    id: string;
    selectAll?: SelectAllProps | true;
    //eslint-disable-next-line
    value?: any[];
    //eslint-disable-next-line
    defaultValue?: any[];
    options?: SelectOptions;
    mode?: AntdSelectProps['mode'];
    placeholder?: string;
    size?: AntdSelectProps['size'];
    maxTagCount?: AntdSelectProps['maxTagCount'];
    disabled?: boolean;
    allowClear?: boolean;
    block?: boolean;
    onChange?: (e: SelectOnChange) => void;
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
    //eslint-disable-next-line
    const [values, setValues] = useState<any[] | undefined>(defaultValue);
    const [isAllItemsSelected, setIsAllItemsSelected] = useState<boolean>(defaultValue?.length === options?.length);

    const handleSelectAll = useCallback(() => setValues(options?.map((item) => item.value)), [options]);

    const handleDeselectAll = useCallback(() => setValues([]), []);

    const handleChange = useCallback(
        //eslint-disable-next-line
        (item: any, option: any | any[]): void => {
            setValues(item);

            if (onChange) onChange({ value: item, option });
        },
        [onChange],
    );

    useEffect(() => {
        const items = values || defaultValue;

        setIsAllItemsSelected(items?.length === options?.length);
    }, [values, defaultValue, options?.length]);

    useEffect(() => setValues(value ?? defaultValue), [value, defaultValue]);

    return (
        <AntdSelect
            id={'slct-' + id}
            /*eslint-disable*/
            dropdownRender={
                selectAll
                    ? SelectAllComponent(
                          typeof selectAll === 'boolean' ? {} : selectAll,
                          handleSelectAll,
                          handleDeselectAll,
                          isAllItemsSelected,
                      )
                    : undefined
            }
            value={values as any}
            /*eslint-enable*/
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
