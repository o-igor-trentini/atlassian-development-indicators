import { CSSProperties, FC, ReactNode } from 'react';
import { Avatar as AntdAvatar } from 'antd';
import type { AvatarProps as AntdAvatarProps } from 'antd';

export interface AvatarProps {
    children?: ReactNode;
    src?: AntdAvatarProps['src'];
    srcSet?: AntdAvatarProps['srcSet'];
    icon?: AntdAvatarProps['icon'];
    alt?: AntdAvatarProps['alt'];
    size?: AntdAvatarProps['size'];
    onClick?: AntdAvatarProps['onClick'];
    style?: CSSProperties;
    className?: string;
}

export const Avatar: FC<AvatarProps> = ({
    children,
    src,
    srcSet,
    icon,
    alt,
    size = 'default',
    onClick,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdAvatar
            src={src}
            shape="circle"
            srcSet={srcSet}
            icon={icon}
            alt={alt}
            size={size}
            onClick={onClick}
            style={style}
            className={className}
        >
            {children}
        </AntdAvatar>
    );
};
