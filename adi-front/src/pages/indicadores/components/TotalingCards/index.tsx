import { FC } from 'react';
import { Col, Row, Text, Tooltip } from '@adi/react-components';
import { CardWithIcon } from '@/components/ui/CardWithIcon';
import { CardSkeleton } from './components/CardSkeleton';

export interface TotalingCardsItem {
    content: string | number;
    tooltip?: string;
    title: string;
    color: string;
    icon: JSX.Element;
}

interface TotalingCardsProps {
    items: TotalingCardsItem[];
    loading: boolean;
}

export const TotalingCards: FC<TotalingCardsProps> = ({ items, loading }): JSX.Element => {
    const CardContent: FC<{ content?: string | number }> = ({ content }): JSX.Element =>
        loading ? (
            <CardSkeleton />
        ) : (
            <Text size="4xl" strong>
                {content}
            </Text>
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
