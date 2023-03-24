import { FC } from 'react';
import { Skeleton } from 'antd';

export const CardSkeleton: FC = (): JSX.Element => {
    return <Skeleton.Button active />;
};
