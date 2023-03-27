import { CSSProperties, FC, ReactNode } from 'react';
import { Empty as AntdEmpty } from 'antd';

export interface EmptyProps {
    children?: ReactNode | ReactNode[];
    image?: ReactNode;
    description?: string;
    imageStyle?: CSSProperties;
    style?: CSSProperties;
    className?: string;
}

export const Empty: FC<EmptyProps> = ({ children, description, image, imageStyle, style, className }): JSX.Element => {
    return (
        <AntdEmpty description={description} image={image} imageStyle={imageStyle} style={style} className={className}>
            {children}
        </AntdEmpty>
    );
};
