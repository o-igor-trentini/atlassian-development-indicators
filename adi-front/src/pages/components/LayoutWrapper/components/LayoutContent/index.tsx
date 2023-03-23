import { FC, ReactNode } from 'react';
import { Container } from './styles';

export interface LayoutContentProps {
    children: ReactNode;
}

export const LayoutContent: FC<LayoutContentProps> = ({ children }): JSX.Element => {
    return <Container>{children}</Container>;
};
