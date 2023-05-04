import { FC, useMemo, useRef } from 'react';
import { Table, TableColumnType, TableDataSourceType } from '@it-adi/react-components';
import { Demands } from '@/@types/demands';
import { PartialTableColumnProps } from '@/@types/components/table';
import { RenderIdentificationTableColumn } from '@/pages/indicadores/components/Sessions/components/RenderIdentificationTableColumn';

interface TotalIssuesByProjectProps {
    demands: Demands;
    loading: boolean;
}

export const TotalIssuesByProjectTable: FC<TotalIssuesByProjectProps> = ({ demands, loading }): JSX.Element => {
    const periodCol = useRef<PartialTableColumnProps[]>([]);

    const dataSource: TableDataSourceType<unknown> = useMemo(() => {
        periodCol.current = demands.periods.map((period, index) => ({
            key: String(index),
            dataIndex: period,
            title: period,
        }));

        const projectRows: Record<string, number>[] = [];

        for (let projectIndex = 0; projectIndex < demands.projects.names.length; projectIndex++) {
            const row: Record<string, number> = {};

            for (let periodIndex = 0; periodIndex < demands.periods.length; periodIndex++) {
                const key = periodCol.current[periodIndex].dataIndex;

                row[key] = demands.projects.issuesByProject[projectIndex].totalByPeriod[periodIndex];
            }

            projectRows.push(row);
        }

        const dataSource: TableDataSourceType<unknown> = [
            ...demands.projects.names.map((item, index) => ({ key: item, ...projectRows[index] })),
        ];

        return dataSource;
    }, [demands]);

    const columns: TableColumnType<unknown> = useMemo(() => {
        const columns: TableColumnType<unknown> = [
            {
                dataIndex: 'key',
                rowScope: 'row',
                width: 160,
                fixed: 'left',
                render: (value: string) => {
                    const source = demands.projects.details.find((item) => item.name === value)?.avatarUrls['32x32'];

                    return <RenderIdentificationTableColumn avatarSrc={source} value={value} />;
                },
            },
            ...periodCol.current,
        ];

        return columns;
    }, [dataSource, demands.projects.details]);

    return (
        <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} scroll={{ x: true }} />
    );
};
