import type { TitleProps } from '@adi/react-components';
import { Title } from '@adi/react-components';
import { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Title',
    component: Title,
} as Meta<TitleProps>;

export const Default: StoryObj<TitleProps> = {};
