import type { CSSProperties } from 'react';
import { FC, useEffect, useRef } from 'react';
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts';
import { getInstanceByDom, init } from 'echarts';

export type ChartTheme = 'light' | 'dark';
export type ChartRenderType = 'svg' | 'canvas';
export type ChartSettings = SetOptionOpts;
export type ChartOption = EChartsOption;

export interface ChartProps {
    theme?: ChartTheme;
    option: ChartOption;
    rendererType?: ChartRenderType;
    settings?: ChartSettings;
    loading?: boolean;
    style?: CSSProperties;
}

export const Chart: FC<ChartProps> = ({
    theme = 'light',
    option,
    rendererType = 'canvas',
    settings,
    loading,
    style,
}): JSX.Element => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chart
        let chart: ECharts | undefined;
        if (chartRef.current !== null)
            chart = init(chartRef.current, theme, {
                renderer: rendererType,
            });

        // Add chart resize listener
        // ResizeObserver is leading to a bit janky UX
        const resizeChart = () => chart?.resize();

        window.addEventListener('resize', resizeChart);

        // Return cleanup function
        return () => {
            chart?.dispose();
            window.removeEventListener('resize', resizeChart);
        };
    }, [theme]);

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);

            if (!chart) return;

            chart.setOption(option, settings);
        }
    }, [option, settings, theme]);

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);

            if (!chart) return;

            loading === true ? chart.showLoading() : chart.hideLoading();
        }
    }, [loading, theme]);

    return <div ref={chartRef} style={{ height: '100%', width: '100%', ...style }} />;
};
