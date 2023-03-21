import type { CSSProperties, FC, ReactNode } from 'react';
import { Tooltip as AntdTooltip } from 'antd';
import type { TooltipProps as AntdTooltipProps } from 'antd';

export type TooltipPlacement = AntdTooltipProps['placement'];

export interface TooltipProps {
    children: ReactNode | ReactNode[];
    title: string;
    style?: CSSProperties;
    className?: string;
}

export const Tooltip: FC<TooltipProps> = ({ children, title, style, className }): JSX.Element => {
    return (
        <AntdTooltip title={title} style={style} className={className}>
            {children}
        </AntdTooltip>
    );
};
