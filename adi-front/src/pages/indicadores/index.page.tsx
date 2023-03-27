import { useMemo, useState } from 'react';
import { Card, Col, Row } from '@adi/react-components';
import { DemandsChart } from './components/DemandsChart';
import { FormSearch, SearchForm } from './components/SearchForm';
import { APIGetCreatedVersusResolvedProps, Demands } from '@/@types/demands';
import { getCreatedVersusResolved } from '@/api/demands';
import { CheckCircle2, History, Percent, PlusCircle } from 'lucide-react';
import { baseTheme } from '@/styles/themes';
import { TotalingCards, TotalingCardsItem } from './components/TotalingCards';
import { NextPage } from 'next';
import { formatFloatPrecision } from '@/utils/string';
import { GeneralCreatedVersusResolvedTable } from '@/pages/indicadores/components/GeneralCreatedVersusResolvedTable';

const Indicators: NextPage = (): JSX.Element => {
    const [demands, setDemands] = useState<Demands | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getDemands = async (parameters: APIGetCreatedVersusResolvedProps): Promise<void> => {
        try {
            setLoading(true);

            setDemands(await getCreatedVersusResolved(parameters));
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
                content: demands?.analytics.createdTotal ?? 0,
                title: 'Criadas',
                color: baseTheme.ADIcolorCreated,
                icon: <PlusCircle />,
            },
            {
                content: demands?.analytics?.resolvedTotal ?? 0,
                title: 'Resolvidas',
                color: baseTheme.ADIcolorResolved,
                icon: <CheckCircle2 />,
            },
            {
                content: demands?.analytics.pendingTotal ?? 0,
                title: 'Pendentes',
                color: baseTheme.ADIcolorPending,
                icon: <History />,
            },
            {
                content: formatFloatPrecision(demands?.analytics.overallProgress ?? 0, 2),
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

            <Col span={24}>
                <Card title="Criadas x Resolvidas (temporal)">
                    <Row justify="center" align="top">
                        <Col span={24} style={{ height: '450px' }}>
                            <DemandsChart data={demands} loading={loading} />
                        </Col>
                    </Row>
                </Card>
            </Col>

            <Col span={24}>
                <Card title="Criadas x Resolvidas">
                    <GeneralCreatedVersusResolvedTable demands={demands} />
                </Card>
            </Col>
        </Row>
    );
};

export default Indicators;
