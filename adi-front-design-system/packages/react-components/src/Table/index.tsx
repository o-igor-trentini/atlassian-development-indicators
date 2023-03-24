import { CSSProperties, FC } from 'react';
import { Table as AntdTable } from 'antd';
import type { TableProps as AntdTableProps } from 'antd';

export interface TableProps<T> {
    dataSource?: AntdTableProps<T>['dataSource'];
    columns?: AntdTableProps<T>['columns'];
    pagination?: AntdTableProps<T>['pagination'];
    size?: AntdTableProps<T>['size'];
    loading?: boolean;
    bordered?: boolean;
    onChange?: AntdTableProps<T>['onChange'];
    style?: CSSProperties;
    className?: string;
}

/*eslint-disable*/
export const Table: FC = <T,>({
    dataSource,
    columns,
    pagination,
    size = 'middle',
    loading,
    bordered,
    onChange,
    style,
    className,
}: TableProps<T>) => {
    return (
        <AntdTable
            dataSource={dataSource as any}
            columns={columns as any}
            pagination={pagination}
            loading={loading}
            bordered={bordered}
            size={size}
            onChange={onChange as any}
            style={style}
            className={className}
        />
    );
};
