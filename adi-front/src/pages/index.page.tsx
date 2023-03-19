import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from '@adi/react-components';
import type { ChartOption } from '@adi/react-charts';
import { Chart } from '@adi/react-charts';
import { Demands } from '@/@types/demands';
import { getCreatedVersusResolved } from '@/pages/api/demands.api';

const Home: FC = (): JSX.Element => {
    const [demands, setDemands] = useState<Demands | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async (): Promise<void> => {
        try {
            setLoading(true);

            setDemands(await getCreatedVersusResolved());
        } catch (err: unknown) {
            console.log('### err', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => getData();

    const defaultOption: ChartOption = {
        legend: {
            data: demands?.yearMonthRange,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    // TODO: Alterar para cor primária TOKEN do Antd
                    backgroundColor: 'red',
                },
            },
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: demands?.yearMonthRange,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Criadas',
                data: demands?.created.data.values,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: 'rgba(255, 105, 97, 0.6)',
                },
                lineStyle: {
                    color: 'rgba(255, 105, 97, 0.8)',
                },
                itemStyle: {
                    color: 'rgb(255, 105, 97)',
                },
            },
            {
                name: 'Resolvidas',
                data: demands?.resolved.data.values,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: 'rgba(189, 236, 182, 0.6)',
                },
                lineStyle: {
                    color: 'rgba(189, 236, 182, 0.8)',
                },
                itemStyle: {
                    color: 'rgb(189, 236, 182)',
                },
            },
            {
                name: 'Pendentes',
                data: demands?.pending.data.values,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: 'rgba(121, 210, 230, 0.6)',
                },
                lineStyle: {
                    color: 'rgba(121, 210, 230, 0.8)',
                },
                itemStyle: {
                    color: 'rgb(121, 210, 230)',
                },
            },
        ],
    };

    useEffect(() => {
        getData().then();
    }, []);

    return (
        <Row gutter={[0, 12]} justify="center" align="top" style={{ height: '100vh' }}>
            <Col span={24}>
                <Button id="search" variant="primary" onClick={handleClick}>
                    Buscar
                </Button>
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

            <Col span={24} style={{ height: '80%' }}>
                <Chart loading={loading} option={defaultOption} />
            </Col>
        </Row>
    );
};

export default Home;
