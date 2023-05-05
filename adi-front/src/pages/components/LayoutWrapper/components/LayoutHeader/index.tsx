import { FC, useState } from 'react';
import { ArrowLeftRight, BarChart2, Home, Menu as MenuIcon, Settings } from 'lucide-react';
import {
    Container,
    ContentContainer,
    DrawerContentContainer,
    DrawerContentFooter,
    MenuButton,
    SwitchThemeButton,
} from './styles';
import { Col, Drawer, Menu, MenuItemsType } from '@it-adi/react-components';
import Link from 'next/link';

export const indicatorsSessions = {
    general: {
        label: 'Geral',
        items: {
            createdResolvedTemporal: {
                label: 'Criadas x Resolvidas (temporal)',
                value: 'geral-criadas-resolvidas-temporal',
            },
            createdResolvedTimeless: {
                label: 'Criadas x Resolvidas (atemporal)',
                value: 'geral-criadas-resolvidas-atemporal',
            },
            totalTasksResolvedByType: {
                label: 'Total de tarefas resolvidas por tipo',
                value: 'geral-total-tarefas-resolvidas-tipo',
            },
        },
    },
    project: {
        label: 'Projeto',
        items: {
            totalTasksResolved: {
                label: 'Total de tarefas resolvidas',
                value: 'projeto-total-tarefas-resolvidas',
            },
        },
    },
    developer: {
        label: 'Desenvolvedor',
        items: {
            totalTasksResolved: {
                label: 'Total de tarefas resolvidas',
                value: 'desenvolvedor-total-tarefas-resolvidas',
            },
        },
    },
};

export interface LayoutHeaderProps {
    onSwitchTheme: () => void;
}

export const LayoutHeader: FC<LayoutHeaderProps> = ({ onSwitchTheme }): JSX.Element => {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const getIndicatorsChildren = (): MenuItemsType[] => {
        const items: MenuItemsType[] = [];
        const sessions = Object.values(indicatorsSessions);

        for (const session of sessions) {
            const subItems: MenuItemsType[] = [];
            const sessionItems = Object.values(session.items);

            for (const item of sessionItems) {
                subItems.push({
                    key: item.value,
                    label: (
                        <Link href={'indicadores#' + item.value} prefetch={false}>
                            {item.label}
                        </Link>
                    ),
                });
            }

            items.push({
                key: session.label,
                label: session.label,
                children: subItems,
            });
        }

        return items;
    };

    const menuItems: MenuItemsType[] = [
        {
            key: 'home',
            label: <Link href="/">Início</Link>,
            icon: <Home />,
        },
        {
            key: 'indicators',
            label: <Link href="/indicadores">Indicadores</Link>,
            icon: <BarChart2 />,
            children: getIndicatorsChildren(),
        },
        {
            key: 'configurations',
            label: <Link href="/configuracoes">Configurações</Link>,
            icon: <Settings />,
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
