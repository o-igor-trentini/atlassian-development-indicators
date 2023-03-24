import { useState } from 'react';
import { Card, Col, Row } from '@adi/react-components';
import { DemandsChart } from './components/DemandsChart';
import { FormSearch, SearchForm } from './components/SearchForm';
import { APIGetCreatedVersusResolvedProps, Demands } from '@/@types/demands';
import { getCreatedVersusResolved } from '@/api/demands';
import { CheckCircle2, History, Percent, PlusCircle } from 'lucide-react';
import { baseTheme } from '@/styles/themes';
import { TotalingCards, TotalingCardsItem } from './components/TotalingCards';
import { NextPage } from 'next';

const Indicators: NextPage = (): JSX.Element => {
    const [demands, setDemands] = useState<Demands | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getDemands = async (parameters: APIGetCreatedVersusResolvedProps): Promise<void> => {
        try {
            setLoading(true);

            const response = await getCreatedVersusResolved(parameters);

            console.log('### response', response);

            setDemands(response);
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

    const totalingCardsItems: TotalingCardsItem[] = [
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
            content: demands?.analytics?.overallProgress?.toFixed(2) ?? 0,
            title: 'Progresso',
            color: '#2C3539',
            icon: <Percent />,
        },
    ];

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
        </Row>
    );
};

export default Indicators;
