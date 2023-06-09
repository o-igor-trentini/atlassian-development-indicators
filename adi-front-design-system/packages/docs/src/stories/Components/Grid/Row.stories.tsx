import type { RowProps } from '@it-adi/react-components';
import { Row } from '@it-adi/react-components';
import { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Grid/Row',
    component: Row,
    argTypes: {
        id: {
            type: 'string',
            description: 'ID da linha',
        },
        gutter: {
            defaultValue: 'O espaçamento entre grades',
        },
        justify: {
            description: 'Alinhamento horizontal',
        },
        align: {
            description: 'Alinhamento vertical',
            options: [
                'top',
                'middle',
                'bottom',
                'stretch',
                '{[key in "xs" | "sm" | "md" | "lg" | "xl" | "xxl"]:top" | "middle" | "bottom" | "stretch"}',
            ],
            control: 'inline-radio',
        },
        hidden: {
            type: 'boolean',
            defaultValue: false,
            description: 'Define se o componente fica vísivel',
            control: 'boolean',
        },
    },
} as Meta<RowProps>;

export const Default: StoryObj<RowProps> = {};
