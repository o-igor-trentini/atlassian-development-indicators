import type { SelectProps } from '@adi/react-components';
import { Select } from '@adi/react-components';
import { Meta, StoryObj } from '@storybook/react';
import { SelectOptions } from '@it-adi/react-components/src';

const defaultOptions = () => {
    const opts: SelectOptions = [];

    for (let i = 1; i <= 10; i++) opts.push({ label: `Item ${i}`, value: `value-${i}` });

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
    args: {
        mode: 'multiple',
        selectAll: {
            defaultValue: true,
        },
        defaultValue: defaultOptions(),
    },
};
