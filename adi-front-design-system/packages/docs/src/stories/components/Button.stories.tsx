import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from '@adi/react-components';

export default {
    title: 'Components/Button',
    component: Button,
    args: {
        children: 'Content',
        id: 'test',
        variant: 'primary',
        type: 'button',
        size: 'middle',
        disabled: false,
        onClick: () => console.log('you clicked me :D'),
    },
    argTypes: {
        id: {
            type: 'string',
            description: 'ID que será adicionado ao botão (tem por prefixo "btn-")',
        },
        variant: {
            options: ['default', 'primary', 'ghost', 'dashed', 'link', 'text'],
            control: 'inline-radio',
        },
        type: {
            options: ['submit', 'button', 'reset'],
            control: 'inline-radio',
            description: 'Tipo do botão no HTML',
            defaultValue: 'button',
        },
        size: {
            options: ['small', 'middle', 'large'],
            control: 'inline-radio',
            description: 'Defina o tamanho do botão',
        },
        disabled: {
            control: 'boolean',
            defaultValue: false,
            description: 'Estado desativado do botão',
        },
        onClick: {
            action: 'click',
            description: 'Defina o handler para lidar com o evento de clique',
            type: 'function',
        },
    },
} as Meta<ButtonProps>;

export const Primary: StoryObj<ButtonProps> = {};
