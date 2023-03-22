import { FC } from 'react';
import { Chart, ChartOption } from '@adi/react-charts';
import { AppTheme } from '@adi/react-components';
import { Demands } from '@/@types/demands';
import { defaultTheme } from '@/styles/themes';

const { useToken } = AppTheme;

interface DemandsChartProps {
    data: Demands | null;
    loading: boolean;
}

export const DemandsChart: FC<DemandsChartProps> = ({ data, loading }): JSX.Element => {
    const { token } = useToken();

    const defaultOption: ChartOption = {
        legend: {
            data: ['Criadas', 'Resolvidas', 'Pendentes'],
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: { backgroundColor: token.colorPrimary },
            },
            backgroundColor: token.colorBgBase,
            borderRadius: token.borderRadius,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data?.yearMonthRange,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Criadas',
                data: data?.created.data.values,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: defaultTheme.ADIcolorCreated,
                    opacity: 0.6,
                },
                lineStyle: {
                    color: defaultTheme.ADIcolorCreated,
                    opacity: 0.8,
                },
                itemStyle: {
                    color: defaultTheme.ADIcolorCreated,
                },
                emphasis: {
                    focus: 'series',
                },
                label: {
                    show: true,
                    position: 'top',
                    padding: 6,
                    backgroundColor: token.colorBgBase,
                    borderColor: token.colorPrimaryBorder,
                    borderWidth: 1,
                    borderRadius: token.borderRadius,
                },
            },
            {
                name: 'Resolvidas',
                data: data?.resolved.data.values,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: defaultTheme.ADIcolorResolved,
                    opacity: 0.6,
                },
                lineStyle: {
                    color: defaultTheme.ADIcolorResolved,
                    opacity: 0.8,
                },
                itemStyle: {
                    color: defaultTheme.ADIcolorResolved,
                },
                emphasis: {
                    focus: 'series',
                },
                label: {
                    show: true,
                    position: 'top',
                    padding: 6,
                    backgroundColor: token.colorBgBase,
                    borderColor: token.colorPrimaryBorder,
                    borderWidth: 1,
                    borderRadius: token.borderRadius,
                },
            },
            {
                name: 'Pendentes',
                data: data?.pending.data.values,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: defaultTheme.ADIcolorPending,
                    opacity: 0.6,
                },
                lineStyle: {
                    color: defaultTheme.ADIcolorPending,
                    opacity: 0.8,
                },
                itemStyle: {
                    color: defaultTheme.ADIcolorPending,
                },
                emphasis: {
                    focus: 'series',
                },
                label: {
                    show: true,
                    position: 'top',
                    padding: 6,
                    backgroundColor: token.colorBgBase,
                    borderColor: token.colorPrimaryBorder,
                    borderWidth: 1,
                    borderRadius: token.borderRadius,
                },
            },
        ],
    };

    return <Chart loading={loading} option={defaultOption} style={{ height: '100%' }} />;
};
