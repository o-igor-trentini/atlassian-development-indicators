import type { SkeletonProps } from '@adi/react-components';
import { Skeleton } from '@adi/react-components';
import { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Skeleton',
    component: Skeleton,
} as Meta<SkeletonProps>;

export const Default: StoryObj<SkeletonProps> = {};
