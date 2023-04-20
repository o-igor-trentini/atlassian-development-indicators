import type { CardProps } from '@it-adi/react-components';
import { Card, Col, Row } from '@it-adi/react-components';
import { Meta, StoryObj } from '@storybook/react';
import { ConfigProviderStory } from '../components/ConfigProviderStory';

export default {
    title: 'Components/Card',
    component: Card,
    args: {
        children: 'Content',
    },
    decorators: [
        (Story) => {
            return (
                <ConfigProviderStory>
                    <Row justify="center" align="middle" style={{ height: '94vh', width: '100%' }}>
                        <Col span={24}>{Story()}</Col>
                    </Row>
                </ConfigProviderStory>
            );
        },
    ],
} as Meta<CardProps>;

export const Default: StoryObj<CardProps> = {};

export const Title: StoryObj<CardProps> = {
    args: {
        title: 'Title',
    },
};

export const Icon: StoryObj<CardProps> = {
    args: {
        title: 'Card with icon',
        icon: {
            element: ':D',
            color: 'orange',
        },
    },
};
