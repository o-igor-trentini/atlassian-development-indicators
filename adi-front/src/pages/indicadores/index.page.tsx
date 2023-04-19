import { useEffect, useRef, useState } from 'react';
import { Card, Col, Row } from '@it-adi/react-components';
import { DemandsChart } from './components/DemandsChart';
import { FormSearch, SearchForm, SearchFormRef } from './components/SearchForm';
import { APIGetCreatedVersusResolvedProps, Demands } from '@/@types/demands';
import { getCreatedVersusResolved } from '@/api/demands';
import { TotalingCards } from './components/TotalingCards';
import { NextPage } from 'next';
import { DemandsEmpty } from '@/pages/indicadores/components/DemandsEmpty';
import { TotalCreatedVersusResolvedTable } from '@/pages/indicadores/components/TotalCreatedVersusResolvedTable';
import { TotalIssuesByProjectTable } from '@/pages/indicadores/components/TotalIssuesByProjectTable';
import { TotalIssuesByTypeTable } from '@/pages/indicadores/components/TotalIssuesByTypeTable';
import { Container } from '@/pages/indicadores/styles';
import { TotalIssuesByDeveloperTable } from '@/pages/indicadores/components/TotalIssuesByDeveloperTable';

const Indicators: NextPage = (): JSX.Element => {
    const [demands, setDemands] = useState<Demands | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const searchFormRef = useRef<SearchFormRef>(null);

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

    useEffect(() => searchFormRef.current?.search(), [searchFormRef.current]);

    const content: JSX.Element =
        !demands || !demands.projects || !demands.analytics.overallProgress ? (
            <DemandsEmpty loading={loading} />
        ) : (
            <>
                <TotalingCards demands={demands} loading={loading} />

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
                        <TotalCreatedVersusResolvedTable demands={demands} loading={loading} />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Total de tarefas resolvidas por tipo">
                        <TotalIssuesByTypeTable demands={demands} loading={loading} />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Total de tarefas resolvidas por projeto">
                        <TotalIssuesByProjectTable demands={demands} loading={loading} />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Total de tarefas resolvidas por desenvolvedor">
                        <TotalIssuesByDeveloperTable demands={demands} loading={loading} />
                    </Card>
                </Col>
            </>
        );

    return (
        <Container gutter={[0, 32]} justify="center" align="top">
            <Col span={24}>
                <Card>
                    <SearchForm ref={searchFormRef} loading={loading} onSubmit={handleSearch} />
                </Card>
            </Col>

            {content}
        </Container>
    );
};

export default Indicators;
