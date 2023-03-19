import { CSSProperties, FC, ReactNode } from 'react';
import { Row as AntdRow } from 'antd';
import type { RowProps as AntdRowProps } from 'antd';

export interface RowProps {
    children: ReactNode | ReactNode[];
    id?: string;
    gutter?: AntdRowProps['gutter'];
    justify?: AntdRowProps['justify'];
    align?: AntdRowProps['align'];
    hidden?: boolean;
    style?: CSSProperties;
    className?: string;
}

export const Row: FC<RowProps> = ({
    children,
    id,
    gutter,
    justify,
    align,
    hidden = false,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdRow
            id={id}
            gutter={gutter}
            justify={justify}
            align={align}
            hidden={hidden}
            style={style}
            className={className}
        >
            {children}
        </AntdRow>
    );
};
