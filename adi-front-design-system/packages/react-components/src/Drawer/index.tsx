import type { CSSProperties, FC, ReactNode } from 'react';
import { Drawer as AntdDrawer } from 'antd';
import type { DrawerProps as AntdDrawerProps } from 'antd';

export interface DrawerProps {
    children: ReactNode;
    title?: string;
    size?: AntdDrawerProps['size'];
    open: boolean;
    closable?: boolean;
    destroyOnClose?: boolean;
    forceRender?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    placement?: AntdDrawerProps['placement'];
    closeIcon?: ReactNode;
    footer?: ReactNode;
    afterOpenChange?: AntdDrawerProps['afterOpenChange'];
    onClose?: AntdDrawerProps['onClose'];
    headerStyle?: AntdDrawerProps['headerStyle'];
    contentWrapperStyle?: AntdDrawerProps['contentWrapperStyle'];
    footerStyle?: AntdDrawerProps['footerStyle'];
    bodyStyle?: AntdDrawerProps['bodyStyle'];
    style?: CSSProperties;
    className?: string;
}

export const Drawer: FC<DrawerProps> = ({
    children,
    title,
    size = 'default',
    open,
    closable = true,
    destroyOnClose = true,
    forceRender = false,
    mask = true,
    maskClosable = true,
    placement = 'right',
    closeIcon,
    footer,
    afterOpenChange,
    onClose,
    headerStyle,
    contentWrapperStyle,
    footerStyle,
    bodyStyle,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdDrawer
            title={title}
            size={size}
            open={open}
            closable={closable}
            destroyOnClose={destroyOnClose}
            forceRender={forceRender}
            mask={mask}
            maskClosable={maskClosable}
            placement={placement}
            closeIcon={closeIcon}
            footer={footer}
            afterOpenChange={afterOpenChange}
            onClose={onClose}
            headerStyle={headerStyle}
            contentWrapperStyle={contentWrapperStyle}
            footerStyle={footerStyle}
            bodyStyle={bodyStyle}
            style={style}
            className={className}
        >
            {children}
        </AntdDrawer>
    );
};
