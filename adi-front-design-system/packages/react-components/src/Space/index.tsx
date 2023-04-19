import { CSSProperties, FC } from 'react';
import { Space as AntdSpace } from 'antd';
import type { SpaceProps as AntdSpaceProps } from 'antd';

export interface SpaceProps {
    children: AntdSpaceProps['children'];
    align?: AntdSpaceProps['align'];
    direction?: AntdSpaceProps['direction'];
    size?: AntdSpaceProps['size'];
    split?: AntdSpaceProps['split'];
    wrap?: boolean;
    style?: CSSProperties;
    className?: string;
}

export const Space: FC<SpaceProps> = ({
    children,
    align,
    direction,
    size,
    split,
    wrap = false,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdSpace
            align={align}
            direction={direction}
            size={size}
            split={split}
            wrap={wrap}
            style={style}
            className={className}
        >
            {children}
        </AntdSpace>
    );
};
