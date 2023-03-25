import { FC, useState } from 'react';
import { Menu } from 'lucide-react';
import { Container, MenuButton } from './styles';
import { Button, Col, Drawer, Row } from '@adi/react-components';
import Link from 'next/link';

export interface LayoutHeaderProps {
    onSwitchTheme: () => void;
}

export const LayoutHeader: FC<LayoutHeaderProps> = ({ onSwitchTheme }): JSX.Element => {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const handleClickOpenMenu = (): void => setShowMenu(true);

    const handleCloseMenu = (): void => setShowMenu(false);

    return (
        <Container>
            <MenuButton id="menu" variant="ghost" icon={<Menu />} onClick={handleClickOpenMenu} />

            <Drawer open={showMenu} placement="left" mask onClose={handleCloseMenu}>
                <Row gutter={[0, 12]}>
                    <Col span={24}>
                        <Link href="/" prefetch={false}>
                            <Button id="home" block>
                                Home
                            </Button>
                        </Link>
                    </Col>

                    <Col span={24}>
                        <Link href="/indicadores" prefetch={false}>
                            <Button id="indicators" block>
                                Indicadores
                            </Button>
                        </Link>
                    </Col>

                    <Col span={24}>
                        <Button id="change-theme" block onClick={onSwitchTheme}>
                            Trocar tema :D
                        </Button>
                    </Col>
                </Row>
            </Drawer>
        </Container>
    );
};
