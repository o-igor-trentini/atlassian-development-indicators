import { CSSProperties, FC } from 'react';
import { Menu as AntdMenu } from 'antd';
import { MenuProps as AntdMenuProps } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';

export type MenuItemsType = ItemType;

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
