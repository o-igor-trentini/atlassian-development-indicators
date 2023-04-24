import type { FormProps } from '@it-adi/react-components';
import { Button, Form, FormItem, Select as SelectComponent, SelectOptions, useForm } from '@it-adi/react-components';
import { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Form',
    component: Form,
} as Meta<FormProps>;

export const Default: StoryObj<FormProps> = {};

export const Select: StoryObj<FormProps> = {
    decorators: [
        (Story) => {
            interface FormType {
                items: string[];
            }

            const [form] = useForm<FormType>();

            const defaultOptions = (): SelectOptions => {
                const opts: SelectOptions = [];

                for (let i = 1; i <= 5; i++) opts.push({ label: `Item ${i}`, value: `value-${i}` });

                return opts;
            };

            const initialValues: FormType = {
                items: defaultOptions()?.map((item) => item.value) as string[],
            };

            const handleSubmit = (values: FormType) => console.log('Select form values', values);

            const handleSelectAll = (): void => form.setFieldsValue({ items: initialValues.items });

            const handleDeselectAll = (): void => form.setFieldsValue({ items: [] });

            return Story({
                args: {
                    id: 'select',
                    form: form,
                    onSubmit: handleSubmit,
                    initialValues: initialValues,
                    children: (
                        <>
                            <FormItem name="items">
                                <SelectComponent
                                    id="select"
                                    mode="multiple"
                                    options={defaultOptions()}
                                    selectAll={{ onSelect: handleSelectAll, onDeselect: handleDeselectAll }}
                                />
                            </FormItem>

                            <Button id="submit" type="submit" variant="primary">
                                Log
                            </Button>
                        </>
                    ),
                },
            });
        },
    ],
};
