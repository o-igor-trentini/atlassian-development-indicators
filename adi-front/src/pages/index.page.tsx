import type { FC } from 'react';
import { useState } from 'react';
import { Col, Row } from '@adi/react-components';
import { DemandsChart } from '@/pages/components/DemandsChart';
import { FormSearch, SearchForm } from '@/pages/components/SearchForm';
import { Demands } from '@/@types/demands';
import { getCreatedVersusResolved } from '@/pages/api/demands.api';
import { getCreatedVersusResolvedProps } from '@/pages/api/types';

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
            projects: ['PEC'],
            period: {
                range: {
                    from: values.from,
                    until: values.until,
                },
            },
        }).then();
    };

    return (
        <Row gutter={[0, 12]} justify="center" align="top" style={{ height: '100vh' }}>
            <Col span={24}>
                <SearchForm onSubmit={handleSearch} />
            </Col>

            <Row gutter={[0, 12]} justify="start" align="top">
                <Col xs={24} md={12}>
                    <strong>Criadas</strong>

                    <p>Total: {demands?.created.data.total}</p>
                    <p>JQL: {demands?.created.jql}</p>
                </Col>

                <Col xs={24} md={12}>
                    <strong>Resolvidas</strong>

                    <p>Total: {demands?.resolved.data.total}</p>
                    <p>JQL: {demands?.resolved.jql}</p>
                </Col>

                <Col xs={24} md={12}>
                    <strong>Pendentes</strong>

                    <p>Total: {demands?.pending.data.total}</p>
                    <p>JQL: {demands?.pending.jql}</p>
                </Col>
            </Row>

            <Col span={24} style={{ height: '600px' }}>
                <DemandsChart data={demands} loading={loading} />
            </Col>
        </Row>
    );
};

export default Home;
