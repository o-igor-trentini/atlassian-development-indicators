import { CSSProperties, FC } from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import type { CheckboxProps as AntdCheckboxProps } from 'antd';
import { CheckboxChangeEvent as AntdCheckboxChangeEvent } from 'antd/es/checkbox';

export type CheckboxChangeEvent = AntdCheckboxChangeEvent;

export interface CheckboxProps {
    children?: AntdCheckboxProps['children'];
    id: string;
    value?: AntdCheckboxProps['value'];
    disabled?: boolean;
    checked?: AntdCheckboxProps['checked'];
    defaultChecked?: AntdCheckboxProps['defaultChecked'];
    indeterminate?: AntdCheckboxProps['indeterminate'];
    onChange?: AntdCheckboxProps['onChange'];
    onClick?: AntdCheckboxProps['onClick'];
    style?: CSSProperties;
    className?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
    children,
    id,
    value,
    checked,
    defaultChecked,
    indeterminate,
    disabled,
    onChange,
    onClick,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdCheckbox
            id={'chk-' + id}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            indeterminate={indeterminate}
            disabled={disabled}
            onChange={onChange}
            onClick={onClick}
            style={style}
            className={className}
        >
            {children}
        </AntdCheckbox>
    );
};
