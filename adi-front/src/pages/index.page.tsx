import type { FC } from 'react';
import { useState } from 'react';
import { Col, Row, Card } from '@adi/react-components';
import { DemandsChart } from '@/pages/components/DemandsChart';
import { FormSearch, SearchForm } from '@/pages/components/SearchForm';
import { Demands } from '@/@types/demands';
import { getCreatedVersusResolvedProps } from '@/api/demands/types';
import { getCreatedVersusResolved } from '@/api/demands';

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
        <Row gutter={[0, 12]} justify="center" align="top">
            <Col span={24}>
                <Card>
                    <SearchForm onSubmit={handleSearch} />
                </Card>
            </Col>

            <Col span={24}>
                <Row gutter={[12, 24]} justify="center" align="middle">
                    <Col xs={24} md={8}>
                        <Card title="Criadas">
                            <p>Total: {demands?.created.data.total}</p>
                            <p>JQL: {demands?.created.jql}</p>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card title="Resolvidas">
                            <p>Total: {demands?.resolved.data.total}</p>
                            <p>JQL: {demands?.resolved.jql}</p>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card title="Pendentes">
                            <p>Total: {demands?.pending.data.total}</p>
                            <p>JQL: {demands?.pending.jql}</p>
                        </Card>
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
