import type { FC } from 'react';
import { useState } from 'react';
import { Card, Col, Row, Text, Tooltip } from '@adi/react-components';
import { DemandsChart } from '@/pages/components/DemandsChart';
import { FormSearch, SearchForm } from '@/pages/components/SearchForm';
import { Demands } from '@/@types/demands';
import { getCreatedVersusResolvedProps } from '@/api/demands/types';
import { getCreatedVersusResolved } from '@/api/demands';
import { CardWithIcon } from '@/components/ui/CardWithIcon';
import { CheckCircle2, History, PlusCircle } from 'lucide-react';
import { defaultTheme } from '@/styles/themes';

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

    return (
        <Row gutter={[0, 32]} justify="center" align="top">
            <Col span={24}>
                <Card>
                    <SearchForm onSubmit={handleSearch} />
                </Card>
            </Col>

            <Col span={24}>
                <Row gutter={[12, 24]} justify="center" align="middle">
                    <Col xs={24} md={8}>
                        <CardWithIcon
                            title="Criadas"
                            icon={{
                                color: defaultTheme.ADIcolorCreated,
                                element: <PlusCircle />,
                            }}
                        >
                            <Row justify="center" align="middle">
                                <Col>
                                    <Tooltip title={'demands?.created.jql as string'}>
                                        <Text size="4xl" strong>
                                            {demands?.created.data.total}
                                        </Text>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </CardWithIcon>
                    </Col>

                    <Col xs={24} md={8}>
                        <CardWithIcon
                            title="Resolvidas"
                            icon={{
                                color: defaultTheme.ADIcolorResolved,
                                element: <CheckCircle2 />,
                            }}
                        >
                            <Row justify="center" align="middle">
                                <Col>
                                    <Tooltip title={demands?.resolved.jql as string}>
                                        <Text size="4xl" strong>
                                            {demands?.resolved.data.total}
                                        </Text>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </CardWithIcon>
                    </Col>

                    <Col xs={24} md={8}>
                        <CardWithIcon
                            title="Pendentes"
                            icon={{
                                color: defaultTheme.ADIcolorPending,
                                element: <History />,
                            }}
                        >
                            <Row justify="center" align="middle">
                                <Col>
                                    <Tooltip title={demands?.pending.jql as string}>
                                        <Text size="4xl" strong>
                                            {demands?.pending.data.total}
                                        </Text>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </CardWithIcon>
                    </Col>
                </Row>
            </Col>

            <Col span={24} style={{ height: '450px' }}>
                <Card title="Criadas x Resolvidas" style={{ height: '100%' }}>
                    <DemandsChart data={demands} loading={loading} />
                </Card>
            </Col>
        </Row>
    );
};

export default Home;
