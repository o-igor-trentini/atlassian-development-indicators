import { CSSProperties, FC, ReactInstance, MouseEvent, KeyboardEvent } from 'react';
import { Menu as AntdMenu } from 'antd';
import { MenuProps as AntdMenuProps } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';

export type MenuItemsType = ItemType;

export interface MenuInfo {
    key: string;
    keyPath: string[];
    /** @deprecated This will not support in future. You should avoid to use this */
    item: ReactInstance;
    domEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
}

export interface MenuProps {
    id: string;
    mode: AntdMenuProps['mode'];
    items: MenuItemsType[];
    defaultSelectedKeys?: AntdMenuProps['defaultSelectedKeys'];
    defaultOpenKeys?: AntdMenuProps['defaultOpenKeys'];
    onClick?: AntdMenuProps['onClick'];
    style?: CSSProperties;
    className?: string;
}

export const Menu: FC<MenuProps> = ({
    id,
    mode,
    items,
    defaultSelectedKeys,
    defaultOpenKeys,
    onClick,
    style,
    className,
}): JSX.Element => {
    return (
        <AntdMenu
            id={'menu-' + id}
            mode={mode}
            items={items}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            onClick={onClick}
            style={style}
            className={className}
        />
    );
};
