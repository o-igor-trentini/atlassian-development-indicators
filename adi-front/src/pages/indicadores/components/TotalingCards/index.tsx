import { FC, useMemo } from 'react';
import { Col, Row, Text, Tooltip } from '@adi/react-components';
import { CardWithIcon } from '@/components/ui/CardWithIcon';
import { CardSkeleton } from './components/CardSkeleton';
import { Demands } from '@/@types/demands';
import { baseTheme } from '@/styles/themes';
import { CheckCircle2, History, Percent, PlusCircle } from 'lucide-react';
import { formatFloatPrecision } from '@/utils/string';

interface TotalingCardsItem {
    content: string | number;
    tooltip?: string;
    title: string;
    color: string;
    icon: JSX.Element;
}

interface TotalingCardsProps {
    demands: Demands | null;
    loading: boolean;
}

export const TotalingCards: FC<TotalingCardsProps> = ({ demands, loading }): JSX.Element => {
    const CardContent: FC<{ content?: string | number }> = ({ content }): JSX.Element =>
        loading ? (
            <CardSkeleton />
        ) : (
            <Text size="4xl" strong>
                {content}
            </Text>
        );

    const items: TotalingCardsItem[] = useMemo(
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
        <Col span={24}>
            <Row gutter={[12, 24]} justify="start" align="middle">
                {items.map(({ content, tooltip, title, color, icon }) => (
                    <Col key={title} xs={24} md={12} lg={6}>
                        <CardWithIcon
                            title={title}
                            icon={{
                                color: color,
                                element: <Tooltip title={tooltip ?? ''}>{icon}</Tooltip>,
                            }}
                        >
                            <Row justify="center" align="middle">
                                <Col>
                                    <CardContent content={content} />
                                </Col>
                            </Row>
                        </CardWithIcon>
                    </Col>
                ))}
            </Row>
        </Col>
    );
};
