import { FC } from 'react';
import { Menu } from 'lucide-react';
import { Container, MenuButton } from './styles';

export interface LayoutHeaderProps {
    onClick: () => void;
}

export const LayoutHeader: FC<LayoutHeaderProps> = ({ onClick }): JSX.Element => {
    return (
        <Container>
            <MenuButton id="menu" variant="ghost" icon={<Menu />} onClick={onClick} />

            {/*Implementar Drawer*/}
        </Container>
    );
};
