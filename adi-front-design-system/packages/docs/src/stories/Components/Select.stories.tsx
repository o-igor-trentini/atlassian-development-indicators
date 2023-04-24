import type { SelectOptions, SelectProps } from '@it-adi/react-components';
import { Button, Col, Row, Select } from '@it-adi/react-components';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const defaultOptions = (): SelectOptions => {
    const opts: SelectOptions = [];

    for (let i = 1; i <= 5; i++) opts.push({ label: `Item ${i}`, value: `value-${i}` });

    return opts;
};

export default {
    title: 'Components/Select',
    component: Select,
    args: {
        id: 'example',
        options: defaultOptions(),
        block: true,
    },
} as Meta<SelectProps>;

export const Default: StoryObj<SelectProps> = {};

export const Mode: StoryObj<SelectProps> = {
    args: {
        mode: 'multiple',
    },
};

export const SelectAll: StoryObj<SelectProps> = {
    decorators: [
        (Story) => {
            const [values, setValues] = useState<string[]>([]);

            const handleLog = () => console.log('SelectAll values', values);

            const handleSelectAll = (): void => setValues(defaultOptions()?.map((item) => item.value) as string[]);

            const handleDeselectAll = (): void => setValues([]);

            const handleChange = (e: string[]) => void setValues(e);

            return (
                <Row gutter={[0, 12]} justify="start" align="middle">
                    <Col span={24}>
                        {Story({
                            args: {
                                mode: 'multiple',
                                value: values,
                                options: defaultOptions(),
                                selectAll: {
                                    onSelect: handleSelectAll,
                                    onDeselect: handleDeselectAll,
                                },
                                block: true,
                                onChange: handleChange,
                            },
                        })}
                    </Col>

                    <Col>
                        <Button id="log" variant="primary" onClick={handleLog}>
                            Log
                        </Button>
                    </Col>
                </Row>
            );
        },
    ],
};
