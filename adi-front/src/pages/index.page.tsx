import type { FC } from 'react';
import { useState } from 'react';
import { Card, Col, Row } from '@adi/react-components';
import { DemandsChart } from '@/pages/components/DemandsChart';
import { FormSearch, SearchForm } from '@/pages/components/SearchForm';
import { Demands } from '@/@types/demands';
import { getCreatedVersusResolvedProps } from '@/api/demands/types';
import { getCreatedVersusResolved } from '@/api/demands';
import { CheckCircle2, History, PlusCircle } from 'lucide-react';
import { defaultTheme } from '@/styles/themes';
import { TotalingCards, TotalingCardsItem } from '@/pages/components/TotalingCards';

const Home: FC = (): JSX.Element => {
    const [demands, setDemands] = useState<Demands | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getDemands = async (parameters: getCreatedVersusResolvedProps): Promise<void> => {
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

    const totalingCardsItems: TotalingCardsItem[] = [
        {
            total: demands?.created.data?.total ?? 0,
            jql: demands?.created.jql ?? '',
            title: 'Criadas',
            color: defaultTheme.ADIcolorCreated,
            icon: <PlusCircle />,
        },
        {
            total: demands?.resolved.data?.total ?? 0,
            jql: demands?.resolved.jql ?? '',
            title: 'Resolvidas',
            color: defaultTheme.ADIcolorResolved,
            icon: <CheckCircle2 />,
        },
        {
            total: demands?.pending.data?.total ?? 0,
            jql: demands?.pending.jql ?? '',
            title: 'Pendentes',
            color: defaultTheme.ADIcolorPending,
            icon: <History />,
        },
    ];

    return (
        <Row gutter={[0, 32]} justify="center" align="top">
            <Col span={24}>
                <Card>
                    <SearchForm onSubmit={handleSearch} />
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

export default Home;
