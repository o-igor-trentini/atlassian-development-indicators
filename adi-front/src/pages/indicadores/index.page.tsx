import { useEffect, useRef, useState } from 'react';
import { Card, Col } from '@it-adi/react-components';
import { FormSearch, SearchForm, SearchFormRef } from './components/SearchForm';
import { APIGetCreatedVersusResolvedProps, Demands } from '@/@types/demands';
import { getCreatedVersusResolved } from '@/api/demands';
import { TotalingCards } from './components/TotalingCards';
import { NextPage } from 'next';
import { DemandsEmpty } from '@/pages/indicadores/components/DemandsEmpty';
import { Container } from '@/pages/indicadores/styles';
import { Sessions } from '@/pages/indicadores/components/Sessions';

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

    useEffect(() => searchFormRef.current?.search(), []);

    const content: JSX.Element =
        !demands || !demands.projects || !demands.analytics.overallProgress ? (
            <DemandsEmpty loading={loading} />
        ) : (
            <>
                <TotalingCards demands={demands} loading={loading} />

                <Sessions demands={demands} loading={loading} />
            </>
        );

    return (
        <Container gutter={[0, 24]} justify="center" align="top">
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
