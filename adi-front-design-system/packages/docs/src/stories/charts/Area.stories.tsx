import type { Meta, StoryObj } from '@storybook/react';
import type { ChartProps, ChartTheme } from '@adi/react-charts';
import { Chart } from '@adi/react-charts';
import type { EChartsOption } from 'echarts';
import { useState } from 'react';
import { Button, Row, Col } from '@adi/react-components';

const defaultOption: EChartsOption = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {},
        },
        {
            data: [400, 324, 850, 881, 999, 123, 1000],
            type: 'line',
            areaStyle: {},
        },
    ],
};

export default {
    title: 'Charts/Area/Basic',
    component: Chart,
    args: {
        option: defaultOption,
    },
    decorators: [
        (Story) => (
            <Row
                id="chart-decorator-container"
                justify="center"
                align="middle"
                style={{
                    height: '94vh',
                    width: '94vw',
                }}
            >
                {Story()}
            </Row>
        ),
    ],
} as Meta<ChartProps>;

export const Default: StoryObj<ChartProps> = {};

export const Theme: StoryObj<ChartProps> = {
    args: {
        theme: 'dark',
    },
    decorators: [
        (Story) => {
            const [theme, setTheme] = useState<ChartTheme>('dark');

            const handleChangeTheme = (): void => (theme === 'light' ? setTheme('dark') : setTheme('light'));

            return (
                <Row
                    gutter={[0, 12]}
                    justify="center"
                    align="top"
                    style={{
                        height: 'calc(94vh - 12px)',
                        width: '94vw',
                    }}
                >
                    <Col span={24}>
                        <Button id="change-chart-theme" variant="primary" block onClick={handleChangeTheme}>
                            Change theme
                        </Button>
                    </Col>

                    <Col span={24} style={{ height: '100%' }}>
                        {Story({ args: { theme, option: defaultOption } as ChartProps })}
                    </Col>
                </Row>
            );
        },
    ],
};

export const RendererType: StoryObj<ChartProps> = {
    args: {
        rendererType: 'svg',
    },
};

export const Loading: StoryObj<ChartProps> = {
    args: {
        loading: true,
        option: {
            series: [],
        },
    },
};

export const LoadingWithContent: StoryObj<ChartProps> = {
    args: {
        loading: true,
    },
};
