import { CSSProperties, FC } from 'react';
import { Table as AntdTable } from 'antd';
import type { TableProps as AntdTableProps } from 'antd';

export type TableDataSourceType<T> = AntdTableProps<T>['dataSource'];
export type TableColumnType<T> = AntdTableProps<T>['columns'];
export type TablePaginationType<T> = AntdTableProps<T>['pagination'];

export interface TableProps<T> {
    dataSource?: TableDataSourceType<T>;
    columns?: TableColumnType<T>;
    pagination?: TablePaginationType<T>;
    size?: AntdTableProps<T>['size'];
    loading?: boolean;
    bordered?: boolean;
    scroll?: AntdTableProps<T>['scroll'];
    onChange?: AntdTableProps<T>['onChange'];
    style?: CSSProperties;
    className?: string;
}

/*eslint-disable*/
export const Table: FC<TableProps<any>> = ({
    dataSource,
    columns,
    pagination,
    size = 'middle',
    loading,
    bordered,
    scroll,
    onChange,
    style,
    className,
}) => {
    return (
        <AntdTable
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            loading={loading}
            bordered={bordered}
            size={size}
            scroll={scroll}
            onChange={onChange}
            style={style}
            className={className}
        />
    );
};
