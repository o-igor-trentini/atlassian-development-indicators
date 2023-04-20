import type { SkeletonProps } from '@it-adi/react-components';
import { Skeleton } from '@it-adi/react-components';
import { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Skeleton',
    component: Skeleton,
} as Meta<SkeletonProps>;

export const Default: StoryObj<SkeletonProps> = {};
