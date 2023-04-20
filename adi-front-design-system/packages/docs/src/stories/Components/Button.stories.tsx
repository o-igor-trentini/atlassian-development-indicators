import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@it-adi/react-components';
import type { ButtonProps } from '@it-adi/react-components';

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
        block: false,
        onClick: () => console.log('you clicked on me :D'),
    },
    argTypes: {
        id: {
            type: 'string',
            description: 'ID que será adicionado ao botão (tem por prefixo "btn-")',
        },
        variant: {
            options: ['default', 'primary', 'ghost', 'dashed', 'link', 'text'],
            control: 'inline-radio',
            description: 'Define a variante do botão',
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
        block: {
            control: 'boolean',
            defaultValue: false,
            description: 'Opção para ajustar a largura do botão à largura do elemento pai',
            type: 'boolean',
        },
        onClick: {
            action: 'click',
            description: 'Defina o handler para lidar com o evento de clique',
            type: 'function',
        },
    },
} as Meta<ButtonProps>;

export const Primary: StoryObj<ButtonProps> = {};
