import type { CSSProperties, FC, ReactNode } from 'react';
import type { FormProps as AntdFormProps } from 'antd';
import { Form as AntdForm } from 'antd';

export const FormItem = AntdForm.Item;

export const useForm = AntdForm.useForm;

export interface FormProps {
    children: ReactNode | ReactNode[];
    id: string;
    form: AntdFormProps['form'];
    scrollToFirstError?: boolean;
    layout?: AntdFormProps['layout'];
    initialValues?: AntdFormProps['initialValues'];
    defaultValue?: AntdFormProps['defaultValue'];
    defaultChecked?: AntdFormProps['defaultChecked'];
    onChange?: AntdFormProps['onChange'];
    onValuesChange?: AntdFormProps['onValuesChange'];
    onSubmit?: AntdFormProps['onFinish'];
    style?: CSSProperties;
    className?: string;
}

export const Form: FC<FormProps> = ({
    children,
    id,
    form,
    scrollToFirstError,
    layout = 'vertical',
    initialValues,
    defaultValue,
    defaultChecked,
    onSubmit,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdForm
            id={'form-' + id}
            form={form}
            scrollToFirstError={scrollToFirstError}
            layout={layout}
            initialValues={initialValues}
            defaultValue={defaultValue}
            defaultChecked={defaultChecked}
            onFinish={onSubmit}
            style={style}
            className={className}
        >
            {children}
        </AntdForm>
    );
};
