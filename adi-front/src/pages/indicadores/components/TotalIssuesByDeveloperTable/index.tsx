import { FC, useMemo, useRef } from 'react';
import { Table, TableColumnType, TableDataSourceType } from '@it-adi/react-components';
import { Demands } from '@/@types/demands';
import { PartialTableColumnProps } from '@/@types/components/table';
import { RenderIdentificationTableColumn } from '@/pages/indicadores/components/RenderIdentificationTableColumn';

interface TotalIssuesByDeveloperTableProps {
    demands: Demands;
    loading: boolean;
}

export const TotalIssuesByDeveloperTable: FC<TotalIssuesByDeveloperTableProps> = ({
    demands,
    loading,
}): JSX.Element => {
    const issueTypesCol = useRef<PartialTableColumnProps[]>([]);

    const dataSource: TableDataSourceType<unknown> = useMemo(() => {
        if (!demands.issuesTypes) return [];

        issueTypesCol.current = demands.issuesTypes.map((issueType, index) => ({
            key: String(index),
            dataIndex: issueType,
            title: issueType,
        }));

        const developerRows: Record<string, number>[] = [];

        for (let developerIndex = 0; developerIndex < demands.developers.names.length; developerIndex++) {
            const row: Record<string, number> = {};

            for (let issueTypeIndex = 0; issueTypeIndex < demands.issuesTypes.length; issueTypeIndex++) {
                const key = issueTypesCol.current[issueTypeIndex].dataIndex;

                if (!row[key]) row[key] = 0;

                row[key] += demands.developers.issuesByDeveloper[developerIndex].totalByType[issueTypeIndex];
            }

            developerRows.push(row);
        }

        const dataSource: TableDataSourceType<unknown> = [
            ...demands.developers.names.map((item, index) => ({
                key: item,
                ...developerRows[index],
            })),
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
                    const source = demands.developers.details.find((item) => item.displayName === value)?.avatarUrls[
                        '32x32'
                    ];

                    return <RenderIdentificationTableColumn avatarSrc={source} value={value} />;
                },
            },
            ...issueTypesCol.current,
        ];

        return columns;
    }, [dataSource]);

    return <Table dataSource={dataSource} columns={columns} loading={loading} scroll={{ x: true }} />;
};
