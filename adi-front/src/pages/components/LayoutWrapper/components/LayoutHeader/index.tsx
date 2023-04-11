import { FC, useState } from 'react';
import { ArrowLeftRight, BarChart2, Home, Menu as MenuIcon } from 'lucide-react';
import {
    Container,
    ContentContainer,
    DrawerContentContainer,
    DrawerContentFooter,
    MenuButton,
    SwitchThemeButton,
} from './styles';
import { Col, Drawer, Menu, MenuItemsType } from '@adi/react-components';
import { useRouter } from 'next/router';

export interface LayoutHeaderProps {
    onSwitchTheme: () => void;
}

export const LayoutHeader: FC<LayoutHeaderProps> = ({ onSwitchTheme }): JSX.Element => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const route = useRouter();

    const menuItems: MenuItemsType[] = [
        {
            key: 'home',
            label: 'Início',
            icon: <Home />,
            onClick: () => route.push('/'),
        },
        {
            key: 'indicators',
            label: 'Indicadores',
            icon: <BarChart2 />,
            onClick: () => route.push('/indicadores'),
        },
    ];

    const handleClickOpenMenu = (): void => setShowMenu(true);

    const handleCloseMenu = (): void => setShowMenu(false);

    return (
        <>
            <Container>
                <ContentContainer justify="start" align="middle">
                    <Col>
                        <MenuButton id="menu" variant="ghost" onClick={handleClickOpenMenu}>
                            <MenuIcon />
                        </MenuButton>
                    </Col>
                </ContentContainer>
            </Container>

            <Drawer open={showMenu} placement="left" mask onClose={handleCloseMenu}>
                <DrawerContentContainer gutter={[0, 12]} justify="center" align="top">
                    <Col span={24}>
                        <Menu id="navigation" mode="inline" items={menuItems} />
                    </Col>

                    <DrawerContentFooter span={24}>
                        <SwitchThemeButton id="change-theme" block icon={<ArrowLeftRight />} onClick={onSwitchTheme}>
                            Trocar tema
                        </SwitchThemeButton>
                    </DrawerContentFooter>
                </DrawerContentContainer>
            </Drawer>
        </>
    );
};
