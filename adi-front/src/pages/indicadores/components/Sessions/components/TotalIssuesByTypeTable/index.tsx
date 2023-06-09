import { FC, useMemo, useRef } from 'react';
import { Table, TableColumnType, TableDataSourceType } from '@it-adi/react-components';
import { Demands } from '@/@types/demands';
import { PartialTableColumnProps } from '@/@types/components/table';

interface TotalIssuesByTypeTableProps {
    demands: Demands;
    loading: boolean;
}

export const TotalIssuesByTypeTable: FC<TotalIssuesByTypeTableProps> = ({ demands, loading }): JSX.Element => {
    const periodCol = useRef<PartialTableColumnProps[]>([]);

    const dataSource: TableDataSourceType<unknown> = useMemo(() => {
        if (!demands.issuesTypes) return [];

        periodCol.current = demands.periods.map((period, index) => ({
            key: String(index),
            dataIndex: period,
            title: period,
        }));

        const issueTypeRows: Record<string, number>[] = [];

        for (let issueTypeIndex = 0; issueTypeIndex < demands.issuesTypes.length; issueTypeIndex++) {
            const row: Record<string, number> = {};

            for (let projectIndex = 0; projectIndex < demands.projects.names.length; projectIndex++) {
                for (let periodIndex = 0; periodIndex < demands.periods.length; periodIndex++) {
                    const key = periodCol.current[periodIndex].dataIndex;

                    if (!row[key]) row[key] = 0;

                    row[key] +=
                        demands.projects.issuesByProject[projectIndex].totalByTypeAndPeriod[issueTypeIndex][key];
                }
            }

            issueTypeRows.push(row);
        }

        const dataSource: TableDataSourceType<unknown> = [
            ...demands.issuesTypes.map((item, index) => ({ key: item, ...issueTypeRows[index] })),
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
