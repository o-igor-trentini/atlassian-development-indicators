import { FC } from 'react';
import { Chart, ChartOption } from '@adi/react-charts';
import { AppTheme } from '@adi/react-components';
import { Demands } from '@/@types/demands';
import { chooseColorByContrast } from '@/utils/style';
import { baseTheme } from '@/styles/themes';

type seriesDefaultConfig = {
    type: 'line';
    smooth: true;

    areaStyle: {
        opacity: 0.6;
    };
    lineStyle: {
        opacity: 0.8;
    };

    emphasis: {
        focus: 'series';
    };

    label: {
        show: true;
        position: 'top';
        padding: 6;
        color: string;
        backgroundColor: string;
        borderColor: string;
        borderWidth: 1;
        borderRadius: number;
    };
};

const { useToken } = AppTheme;

interface DemandsChartProps {
    data: Demands | null;
    loading: boolean;
}

export const DemandsChart: FC<DemandsChartProps> = ({ data, loading }): JSX.Element => {
    const { token } = useToken();

    const seriesLegendColor = chooseColorByContrast(
        token.colorBgBase,
        baseTheme.ADIcolorBlack,
        baseTheme.ADIcolorWhite,
    );

    const seriesDefaultConfig: seriesDefaultConfig = {
        type: 'line',
        smooth: true,

        areaStyle: {
            opacity: 0.6,
        },
        lineStyle: {
            opacity: 0.8,
        },

        emphasis: {
            focus: 'series',
        },

        label: {
            show: true,
            position: 'top',
            padding: 6,
            color: seriesLegendColor,
            backgroundColor: token.colorBgBase,
            borderColor: token.colorPrimaryBorder,
            borderWidth: 1,
            borderRadius: token.borderRadius,
        },
    };

    const defaultOption: ChartOption = {
        legend: {
            data: ['Criadas', 'Resolvidas', 'Pendentes'],
            backgroundColor: token.colorBgElevated,
            padding: token.padding,
            textStyle: {
                color: token.colorText,
            },
            borderRadius: token.borderRadius,
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
                ...seriesDefaultConfig,
                name: 'Criadas',
                data: data?.created.data.values,
                areaStyle: { color: baseTheme.ADIcolorCreated },
                lineStyle: { color: baseTheme.ADIcolorCreated },
                itemStyle: { color: baseTheme.ADIcolorCreated },
            },
            {
                ...seriesDefaultConfig,
                name: 'Resolvidas',
                data: data?.resolved.data.values,
                areaStyle: { color: baseTheme.ADIcolorResolved },
                lineStyle: { color: baseTheme.ADIcolorResolved },
                itemStyle: { color: baseTheme.ADIcolorResolved },
            },
            {
                ...seriesDefaultConfig,
                name: 'Pendentes',
                data: data?.pending.data.values,
                areaStyle: { color: baseTheme.ADIcolorPending },
                lineStyle: { color: baseTheme.ADIcolorPending },
                itemStyle: { color: baseTheme.ADIcolorPending },
            },
        ],
    };

    return <Chart loading={loading} option={defaultOption} style={{ height: '100%' }} />;
};
