import type { Meta, StoryObj } from '@storybook/react';
import type { ReactEChartsProps, ReactEChartsTheme } from '@adi/react-charts';
import { ReactECharts } from '@adi/react-charts';
import { useState } from 'react';
import { Button } from '@adi/react-components';
import { EChartsOption } from 'echarts';

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
    component: ReactECharts,
    args: {
        option: defaultOption,
    },
    decorators: [
        (Story) => (
            <div
                id="chart-decorator-container"
                style={{
                    height: '94vh',
                    width: '94vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {Story()}
            </div>
        ),
    ],
} as Meta<ReactEChartsProps>;

export const Default: StoryObj<ReactEChartsProps> = {};

export const Theme: StoryObj<ReactEChartsProps> = {
    args: {
        theme: 'dark',
    },
    decorators: [
        (Story) => {
            const [theme, setTheme] = useState<ReactEChartsTheme>('dark');

            const handleChangeTheme = (): void => (theme === 'light' ? setTheme('dark') : setTheme('light'));

            return (
                <div
                    style={{
                        height: 'calc(94vh - 12px)',
                        width: '94vw',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    <Button id="change-chart-theme" variant="primary" block onClick={handleChangeTheme}>
                        Change theme
                    </Button>

                    {Story({ args: { theme, option: defaultOption } as ReactEChartsProps })}
                </div>
            );
        },
    ],
};

export const Loading: StoryObj<ReactEChartsProps> = {
    args: {
        loading: true,
        option: {
            series: [],
        },
    },
};

export const LoadingWithContent: StoryObj<ReactEChartsProps> = {
    args: {
        loading: true,
    },
};
