import { FC, ReactNode, useMemo } from 'react';
import { Col, Row, Title } from '@it-adi/react-components';
import { DemandsChart } from '@/pages/indicadores/components/Sessions/components/DemandsChart';
import { TotalCreatedVersusResolvedTable } from '@/pages/indicadores/components/Sessions/components/TotalCreatedVersusResolvedTable';
import { TotalIssuesByTypeTable } from '@/pages/indicadores/components/Sessions/components/TotalIssuesByTypeTable';
import { TotalIssuesByProjectTable } from '@/pages/indicadores/components/Sessions/components/TotalIssuesByProjectTable';
import { TotalIssuesByDeveloperTable } from '@/pages/indicadores/components/Sessions/components/TotalIssuesByDeveloperTable';
import { Demands } from '@/@types/demands';
import { ItemCard, ItemContainer, ItemContainerSize } from '@/pages/indicadores/components/Sessions/styles';
import { indicatorsSessions } from '@/pages/components/LayoutWrapper/components/LayoutHeader';

interface SessionItem {
    id: string;
    title: string;
    children: ReactNode;
    size?: ItemContainerSize;
}

interface Session {
    id: string;
    items: SessionItem[];
}

interface SessionsProps {
    demands: Demands;
    loading: boolean;
}

export const Sessions: FC<SessionsProps> = ({ demands, loading }) => {
    const sessions: Session[] = useMemo(() => {
        return [
            {
                id: indicatorsSessions.general.label,
                items: [
                    {
                        id: indicatorsSessions.general.items.createdResolvedTemporal.value,
                        title: indicatorsSessions.general.items.createdResolvedTemporal.label,
                        size: 'full',
                        children: <DemandsChart data={demands} loading={loading} />,
                    },
                    {
                        id: indicatorsSessions.general.items.createdResolvedTimeless.value,
                        title: indicatorsSessions.general.items.createdResolvedTimeless.label,
                        children: <TotalCreatedVersusResolvedTable demands={demands} loading={loading} />,
                    },
                    {
                        id: indicatorsSessions.general.items.totalTasksResolvedByType.value,
                        title: indicatorsSessions.general.items.totalTasksResolvedByType.label,
                        children: <TotalIssuesByTypeTable demands={demands} loading={loading} />,
                    },
                ],
            },
            {
                id: indicatorsSessions.project.label,
                items: [
                    {
                        id: indicatorsSessions.project.items.totalTasksResolved.value,
                        title: indicatorsSessions.project.items.totalTasksResolved.label,
                        children: <TotalIssuesByProjectTable demands={demands} loading={loading} />,
                    },
                ],
            },
            {
                id: indicatorsSessions.developer.label,
                items: [
                    {
                        id: indicatorsSessions.developer.items.totalTasksResolved.value,
                        title: indicatorsSessions.developer.items.totalTasksResolved.label,
                        children: <TotalIssuesByDeveloperTable demands={demands} loading={loading} />,
                        size: 'full',
                    },
                ],
            },
        ];
    }, [demands, loading]);

    return (
        <>
            {sessions.map(({ id, items }) => {
                const itemsContent: JSX.Element[] = items.map((item) => {
                    return (
                        <ItemContainer key={item.id} span={24} size={item.size}>
                            <ItemCard id={item.id} title={item.title}>
                                {item.children}
                            </ItemCard>
                        </ItemContainer>
                    );
                });

                return (
                    <Col key={id} span={24}>
                        <Row gutter={[0, 12]} justify="center" align="top">
                            <Col span={24}>
                                <Title size="2xl">{id}</Title>
                            </Col>

                            {itemsContent}
                        </Row>
                    </Col>
                );
            })}
        </>
    );
};
