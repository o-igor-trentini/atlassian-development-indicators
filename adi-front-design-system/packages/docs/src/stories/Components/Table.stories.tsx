import type { TableProps } from '@it-adi/react-components';
import { Table } from '@it-adi/react-components';
import { Meta, StoryObj } from '@storybook/react';
import { TableColumnType } from '@it-adi/react-components/src';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

const columns: TableColumnType<DataType> = [
    {
        dataIndex: 'key',
        rowScope: 'row',
        width: 160,
        fixed: 'left',
        render: (value: string) => 'row ' + value,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const getData = (): DataType[] => {
    const data: DataType[] = [];

    for (let i = 1; i <= 20; i++)
        data.push({
            key: String(i),
            name: 'John ' + i,
            age: i * 10,
            address: `New York No. ${i} Lake Park`,
        });

    return data;
};

export default {
    title: 'Components/Table',
    component: Table,
    args: {
        dataSource: getData(),
        columns: columns,
    },
    // eslint-disable-next-line
} as Meta<TableProps<any>>;

// eslint-disable-next-line
export const Default: StoryObj<TableProps<any>> = {};
