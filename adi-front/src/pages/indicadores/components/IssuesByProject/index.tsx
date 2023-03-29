import { FC, useMemo, useRef } from 'react';
import { Table, TableColumnType, TableDataSourceType } from '@adi/react-components';
import { Demands } from '@/@types/demands';
import { PartialTableColumnProps } from '@/@types/components/table';

interface GeneralIssuesByProjectProps {
    demands: Demands;
    loading: boolean;
}

export const IssuesByProject: FC<GeneralIssuesByProjectProps> = ({ demands, loading }): JSX.Element => {
    const periodCol = useRef<PartialTableColumnProps[]>([]);

    const dataSource: TableDataSourceType<unknown> = useMemo(() => {
        const periodRows: Record<string, string> = {};

        for (const period of demands.periods) periodRows[period] = period;

        periodCol.current = Object.keys(periodRows).map((period, index) => ({
            key: String(index),
            dataIndex: period,
        }));

        const projectRows: Record<string, number>[] = Array(demands.project.projects.length).fill({});

        // TODO: Corrigir
        // está pegando sempre o última para vários projetos

        for (let projectIndex = 0; projectIndex < demands.project.projects.length; projectIndex++) {
            for (let periodIndex = 0; periodIndex < demands.periods.length; periodIndex++) {
                const key = periodCol.current[periodIndex].dataIndex;

                projectRows[projectIndex][key] =
                    demands.project.issuesDetailsByProject[projectIndex].totalByPeriod[periodIndex];
            }
        }

        const dataSource: TableDataSourceType<unknown> = [
            {
                key: 'Período',
                ...periodRows,
            },
            ...demands.project.projects.map((item, index) => ({ key: item, ...projectRows[index] })),
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
