import type { CSSProperties, FC, ReactNode } from 'react';
import { Col as AntdCol } from 'antd';
import type { ColProps as AntdColProps } from 'antd';

export interface ColProps {
    children: ReactNode | ReactNode[];
    id?: string;
    flex?: AntdColProps['flex'];
    span?: AntdColProps['span'];
    offset?: AntdColProps['offset'];
    order?: AntdColProps['order'];
    pull?: AntdColProps['pull'];
    push?: AntdColProps['push'];
    xs?: AntdColProps['xs'];
    sm?: AntdColProps['sm'];
    md?: AntdColProps['md'];
    lg?: AntdColProps['lg'];
    xl?: AntdColProps['xl'];
    xxl?: AntdColProps['xxl'];
    hidden?: boolean;
    style?: CSSProperties;
    className?: string;
}

export const Col: FC<ColProps> = ({
    children,
    id,
    flex,
    span,
    offset,
    order,
    pull,
    push,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    hidden = false,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdCol
            id={id}
            hidden={hidden}
            flex={flex}
            span={span}
            offset={offset}
            order={order}
            pull={pull}
            push={push}
            xs={xs}
            sm={sm}
            md={md}
            lg={lg}
            xl={xl}
            xxl={xxl}
            style={style}
            className={className}
        >
            {children}
        </AntdCol>
    );
};
