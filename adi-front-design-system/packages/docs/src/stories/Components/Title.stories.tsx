import type { TitleProps } from '@it-adi/react-components';
import { Title } from '@it-adi/react-components';
import { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Title',
    component: Title,
} as Meta<TitleProps>;

export const Default: StoryObj<TitleProps> = {};
