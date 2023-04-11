import { CSSProperties, FC } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import type { DatePickerProps as AntdDatePickerProps } from 'antd';

export interface DatePickerProps {
    id: string;
    value?: AntdDatePickerProps['value'];
    defaultValue?: AntdDatePickerProps['defaultValue'];
    defaultPickerValue?: AntdDatePickerProps['defaultPickerValue'];
    placeholder?: AntdDatePickerProps['placeholder'];
    allowClear?: boolean;
    disabled?: boolean;
    block?: boolean;
    disabledDate?: AntdDatePickerProps['disabledDate'];
    format?: AntdDatePickerProps['format'];
    mode?: AntdDatePickerProps['mode'];
    locale?: AntdDatePickerProps['locale'];
    presets?: AntdDatePickerProps['presets'];
    open?: AntdDatePickerProps['open'];
    picker?: AntdDatePickerProps['picker'];
    placement?: AntdDatePickerProps['placement'];
    size?: AntdDatePickerProps['size'];
    onChange?: AntdDatePickerProps['onChange'];
    onOpenChange?: AntdDatePickerProps['onOpenChange'];
    onPanelChange?: AntdDatePickerProps['onPanelChange'];
    dateRender?: AntdDatePickerProps['dateRender'];
    panelRender?: AntdDatePickerProps['panelRender'];
    style?: CSSProperties;
    className?: string;
}

export const DatePicker: FC<DatePickerProps> = ({
    id,
    value,
    defaultValue,
    defaultPickerValue,
    placeholder,
    allowClear,
    disabled,
    disabledDate,
    block = false,
    format,
    mode,
    locale,
    presets,
    open,
    picker,
    placement,
    size = 'middle',
    onChange,
    onOpenChange,
    onPanelChange,
    dateRender,
    panelRender,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdDatePicker
            id={'dtp-' + id}
            value={value}
            defaultValue={defaultValue}
            defaultPickerValue={defaultPickerValue}
            placeholder={placeholder}
            allowClear={allowClear}
            disabled={disabled}
            disabledDate={disabledDate}
            format={format}
            mode={mode}
            locale={locale}
            presets={presets}
            open={open}
            picker={picker}
            placement={placement}
            size={size}
            onChange={onChange}
            onOpenChange={onOpenChange}
            onPanelChange={onPanelChange}
            dateRender={dateRender}
            panelRender={panelRender}
            style={{ ...style, width: block ? '100%' : undefined }}
            className={className}
        />
    );
};
