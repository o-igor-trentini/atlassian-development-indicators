import { FC, useMemo, useRef } from 'react';
import { Table, TableColumnType, TableDataSourceType } from '@adi/react-components';
import { Demands } from '@/@types/demands';
import { PartialTableColumnProps } from '@/@types/components/table';

interface TotalIssuesByTypeTableProps {
    demands: Demands;
    loading: boolean;
}

export const TotalIssuesByTypeTable: FC<TotalIssuesByTypeTableProps> = ({ demands, loading }): JSX.Element => {
    const periodCol = useRef<PartialTableColumnProps[]>([]);

    const dataSource: TableDataSourceType<unknown> = useMemo(() => {
        const periodRows: Record<string, string> = {};

        for (const period of demands.periods) periodRows[period] = period;

        periodCol.current = Object.keys(periodRows).map((period, index) => ({
            key: String(index),
            dataIndex: period,
        }));

        const issueTypeRows: Record<string, number>[] = [];

        for (let projectIndex = 0; projectIndex < demands.project.projects.length; projectIndex++) {
            const rows: Record<string, number> = {};

            for (let periodIndex = 0; periodIndex < demands.periods.length; periodIndex++) {
                // const key = periodCol.current[periodIndex].dataIndex;
                // rows[key] = demands.project.issuesDetailsByProject[projectIndex].bt[periodIndex];
            }

            issueTypeRows.push(rows);
        }

        const dataSource: TableDataSourceType<unknown> = [
            {
                key: 'Período',
                ...periodRows,
            },
            ...demands.project.projects.map((item, index) => ({ key: item, ...issueTypeRows[index] })),
        ];

        return dataSource;
    }, [demands]);

    const columns: TableColumnType<unknown> = useMemo(() => {
        const columns: TableColumnType<unknown> = [
            {
                dataIndex: 'key',
                rowScope: 'row',
                width: 120,
                fixed: 'left',
            },
            ...periodCol.current,
        ];

        return columns;
    }, [dataSource]);

    return (
        <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} scroll={{ x: true }} />
    );
};
