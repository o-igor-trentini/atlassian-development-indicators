import { useMemo, useState } from 'react';
import { Card, Col, Row, Table, TableColumnType, TableDataSourceType } from '@adi/react-components';
import { DemandsChart } from './components/DemandsChart';
import { FormSearch, SearchForm } from './components/SearchForm';
import { APIGetCreatedVersusResolvedProps, Demands } from '@/@types/demands';
import { getCreatedVersusResolved } from '@/api/demands';
import { CheckCircle2, History, Percent, PlusCircle } from 'lucide-react';
import { baseTheme } from '@/styles/themes';
import { TotalingCards, TotalingCardsItem } from './components/TotalingCards';
import { NextPage } from 'next';
import { formatFloatPrecision } from '@/utils/string';

const Indicators: NextPage = (): JSX.Element => {
    const [demands, setDemands] = useState<Demands | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableDataSource, setTableDataSource] = useState<TableDataSourceType<any>>([]);
    const [tableColumns, setTableColumns] = useState<TableColumnType<any>>([]);

    const getDemands = async (parameters: APIGetCreatedVersusResolvedProps): Promise<void> => {
        try {
            setLoading(true);

            const response = await getCreatedVersusResolved(parameters);

            setDemands(response);

            interface Test {
                key: string;
                dataIndex: string;
            }

            const periodRows: Record<string, string> = {};
            if (demands) for (const period of response.periods) periodRows[period] = period;

            const periodCol: Test[] = Object.keys(periodRows).map((period, index) => ({
                key: String(index),
                dataIndex: period,
            }));

            const createdRows: Record<string, number> = {},
                resolvedRows: Record<string, number> = {},
                pendingRows: Record<string, number> = {},
                progressRows: Record<string, number> = {};

            for (let i = 0; i < response.periods.length; i++) {
                const key = periodCol[i].dataIndex;

                createdRows[key] = response.created.values[i];
                resolvedRows[key] = response.resolved.values[i];

                // TODO: Verificar como deve ser exibido
                // Calcular no backend como "created-resolved" ou deixar de forma temporal

                pendingRows[key] = createdRows[key] - resolvedRows[key];
                // pendingRows[key] = response.pending.values[i];

                progressRows[key] = formatFloatPrecision(response.analytics.progressPerPeriod[i], 2);
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

            setTableDataSource(dataSource);

            const columns: TableColumnType<unknown> = [
                {
                    dataIndex: 'key',
                    rowScope: 'row',
                },
                ...periodCol,
            ];

            setTableColumns(columns);
        } catch (err: unknown) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (values: FormSearch): void => {
        getDemands({
            projects: values.projects,
            period: {
                range: {
                    from: values.from,
                    until: values.until,
                },
            },
        }).then();
    };

    const totalingCardsItems: TotalingCardsItem[] = useMemo(
        () => [
            {
                content: demands?.created?.total ?? 0,
                title: 'Criadas',
                color: baseTheme.ADIcolorCreated,
                icon: <PlusCircle />,
            },
            {
                content: demands?.resolved?.total ?? 0,
                title: 'Resolvidas',
                color: baseTheme.ADIcolorResolved,
                icon: <CheckCircle2 />,
            },
            {
                content: demands?.pending?.total ?? 0,
                title: 'Pendentes',
                color: baseTheme.ADIcolorPending,
                icon: <History />,
            },
            {
                content: formatFloatPrecision(demands?.analytics?.overallProgress ?? 0, 2),
                title: 'Progresso',
                color: '#2C3539',
                icon: <Percent />,
            },
        ],
        [demands],
    );

    return (
        <Row gutter={[0, 32]} justify="center" align="top">
            <Col span={24}>
                <Card>
                    <SearchForm loading={loading} onSubmit={handleSearch} />
                </Card>
            </Col>

            <TotalingCards items={totalingCardsItems} loading={loading} />

            <Col span={24} style={{ height: '450px' }}>
                <Card title="Criadas x Resolvidas" style={{ height: '100%' }}>
                    <DemandsChart data={demands} loading={loading} />
                </Card>
            </Col>

            <Col span={24}>
                <Card title="Criadas x Resolvidas">
                    {demands?.periods?.length && (
                        <Table dataSource={tableDataSource} columns={tableColumns} pagination={false} />
                    )}
                </Card>
            </Col>
        </Row>
    );
};

export default Indicators;
