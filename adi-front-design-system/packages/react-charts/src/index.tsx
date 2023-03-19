import { useRef, useEffect, FC } from 'react';
import { init, getInstanceByDom } from 'echarts';
import type { CSSProperties } from 'react';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';

export type ReactEChartsTheme = 'light' | 'dark';

export interface ReactEChartsProps {
    theme?: ReactEChartsTheme;
    option: EChartsOption;
    settings?: SetOptionOpts;
    loading?: boolean;
    style?: CSSProperties;
}

export const ReactECharts: FC<ReactEChartsProps> = ({
    theme = 'light',
    option,
    settings,
    loading,
    style,
}): JSX.Element => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chart
        let chart: ECharts | undefined;
        if (chartRef.current !== null) chart = init(chartRef.current, theme);

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
