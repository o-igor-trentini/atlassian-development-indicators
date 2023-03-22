import type { CSSProperties, FC, ReactNode } from 'react';
import { Tooltip as AntdTooltip } from 'antd';
import type { TooltipProps as AntdTooltipProps } from 'antd';

export type TooltipPlacement = AntdTooltipProps['placement'];

export interface TooltipProps {
    children: ReactNode;
    title: string;
    placement?: TooltipPlacement;
    style?: CSSProperties;
    className?: string;
}

export const Tooltip: FC<TooltipProps> = ({ children, title, placement = 'top', style, className }): JSX.Element => {
    return (
        <AntdTooltip title={title} placement={placement} style={style} className={className}>
            {children}
        </AntdTooltip>
    );
};
