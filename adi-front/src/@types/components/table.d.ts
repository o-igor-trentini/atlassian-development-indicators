import { ReactNode } from 'react';

export interface PartialTableColumnProps {
    key: string;
    dataIndex: string;
    title?: string;
    render?: (value: any, record: any, index: number) => ReactNode;
}
