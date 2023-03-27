import { FC, useMemo, useRef } from 'react';
import { Table, TableColumnType, TableDataSourceType } from '@adi/react-components';
import { formatFloatPrecision } from '@/utils/string';
import { Demands } from '@/@types/demands';

interface GeneralCreatedVersusResolvedTableProps {
    demands: Demands | null;
}

export const GeneralCreatedVersusResolvedTable: FC<GeneralCreatedVersusResolvedTableProps> = ({
    demands,
}): JSX.Element => {
    const periodCol = useRef<
        {
            key: string;
            dataIndex: string;
        }[]
    >([]);

    const dataSource: TableDataSourceType<unknown> = useMemo(() => {
        if (!demands) return;

        const periodRows: Record<string, string> = {};

        for (const period of demands.periods) periodRows[period] = period;

        periodCol.current = Object.keys(periodRows).map((period, index) => ({
            key: String(index),
            dataIndex: period,
        }));

        const createdRows: Record<string, number> = {},
            resolvedRows: Record<string, number> = {},
            pendingRows: Record<string, number> = {},
            progressRows: Record<string, string> = {};

        for (let i = 0; i < demands.periods.length; i++) {
            const key = periodCol.current[i].dataIndex;

            createdRows[key] = demands.created.values[i];
            resolvedRows[key] = demands.resolved.values[i];

            pendingRows[key] = createdRows[key] - resolvedRows[key];

            progressRows[key] = `${formatFloatPrecision(demands.analytics.progressPerPeriod[i], 2)}%`;
        }

        const dataSource: TableDataSourceType<unknown> = [
            {
                key: 'Período',
                ...periodRows,
            },
            {
                key: 'Criadas',
                ...createdRows,
            },
            {
                key: 'Resolvidas',
                ...resolvedRows,
            },
            {
                key: 'Pendentes',
                ...pendingRows,
            },
            {
                key: 'Progresso',
                ...progressRows,
            },
        ];

        return dataSource;
    }, [demands]);

    const columns: TableColumnType<unknown> = useMemo(() => {
        if (!demands) return;

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

    if (!demands) return <>Sem demandas</>;

    return <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ x: true }} />;
};
