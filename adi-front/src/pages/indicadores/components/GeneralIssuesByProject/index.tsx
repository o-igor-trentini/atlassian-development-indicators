import { FC, useMemo, useRef } from 'react';
import { Table, TableColumnType, TableDataSourceType } from '@adi/react-components';
import { Demands } from '@/@types/demands';
import { PartialTableColumnProps } from '@/@types/components/table';

interface GeneralIssuesByProjectProps {
    demands: Demands;
    loading: boolean;
}

export const GeneralIssuesByProject: FC<GeneralIssuesByProjectProps> = ({ demands, loading }): JSX.Element => {
    const periodCol = useRef<PartialTableColumnProps[]>([]);

    const dataSource: TableDataSourceType<unknown> = useMemo(() => {
        const periodRows: Record<string, string> = {};

        for (const period of demands.periods) periodRows[period] = period;

        periodCol.current = Object.keys(periodRows).map((period, index) => ({
            key: String(index),
            dataIndex: period,
        }));

        const createdRows: Record<string, number> = {};

        for (let i = 0; i < demands.periods.length; i++) {
            const key = periodCol.current[i].dataIndex;

            createdRows[key] = demands.created.values[i];
            // resolvedRows[key] = demands.resolved.values[i];
            //
            // pendingRows[key] = createdRows[key] - resolvedRows[key];
            //
            // progressRows[key] = `${formatFloatPrecision(demands.analytics.progressPerPeriod[i], 2)}%`;
        }

        const dataSource: TableDataSourceType<unknown> = [
            {
                key: 'Período',
                ...periodRows,
            },
            // {
            //     key: 'Criadas',
            //     ...createdRows,
            // },
            // {
            //     key: 'Resolvidas',
            //     ...resolvedRows,
            // },
            // {
            //     key: 'Pendentes',
            //     ...pendingRows,
            // },
            // {
            //     key: 'Progresso',
            //     ...progressRows,
            // },
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
