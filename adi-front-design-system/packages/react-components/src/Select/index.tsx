import type { CSSProperties, FC, JSXElementConstructor, ReactElement } from 'react';
import { Select as AntdSelect } from 'antd';
import type { SelectProps as AntdSelectProps } from 'antd';
import { Checkbox, CheckboxChangeEvent } from '../Checkbox';

export interface SelectAllOptionsProps {
    checked: boolean;
    onClick?: () => void;
    onSelect?: () => void;
    onDeselect?: () => void;
}

export type SelectOptions = AntdSelectProps['options'];

export interface SelectProps {
    id: string;
    selectAll?: SelectAllOptionsProps;
    value?: AntdSelectProps['value'];
    defaultValue?: AntdSelectProps['defaultValue'];
    options?: SelectOptions;
    mode?: AntdSelectProps['mode'];
    placeholder?: string;
    size?: AntdSelectProps['size'];
    maxTagCount?: AntdSelectProps['maxTagCount'];
    disabled?: boolean;
    block?: boolean;
    onChange?: AntdSelectProps['onChange'];
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
    block = false,
    onChange,
    style,
    className,
}): JSX.Element => {
    const SelectAllOptions = (
        menu: ReactElement<unknown, string | JSXElementConstructor<unknown>> | undefined,
    ): JSX.Element => {
        if (!selectAll) return <></>;

        const { checked, onClick, onSelect, onDeselect } = selectAll;

        const handleChange = (e: CheckboxChangeEvent): void => {
            const { checked } = e.target;

            if (checked && onSelect) {
                onSelect();
                return;
            }

            if (onDeselect) onDeselect();
        };

        return (
            <>
                <Checkbox id="select-all" checked={checked} onClick={onClick} onChange={handleChange}>
                    Selecionar tudo
                </Checkbox>

                {menu}
            </>
        );
    };

    return (
        <AntdSelect
            id={'slct-' + id}
            dropdownRender={selectAll ? SelectAllOptions : undefined}
            value={value}
            defaultValue={defaultValue}
            options={options}
            mode={mode}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            maxTagCount={maxTagCount}
            onChange={onChange}
            style={{ ...style, width: block ? '100%' : undefined }}
            className={className}
        />
    );
};
