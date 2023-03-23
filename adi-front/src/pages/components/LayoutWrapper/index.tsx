import { FC } from 'react';
import { LayoutContent, LayoutContentProps } from '@/pages/components/LayoutWrapper/components/LayoutContent';
import { LayoutHeader, LayoutHeaderProps } from '@/pages/components/LayoutWrapper/components/LayoutHeader';
import { Container } from '@/pages/components/LayoutWrapper/styles';

interface LayoutWrapperProps extends LayoutHeaderProps, LayoutContentProps {}

export const LayoutWrapper: FC<LayoutWrapperProps> = ({ children, onClick }): JSX.Element => {
    return (
        <Container>
            <LayoutHeader onClick={onClick} />

            <LayoutContent>{children}</LayoutContent>
        </Container>
    );
};
