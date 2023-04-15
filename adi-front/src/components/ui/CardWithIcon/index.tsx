import { FC, ReactNode } from 'react';
import { Container, IconContainer } from '@/components/ui/CardWithIcon/styles';
import { CardProps } from '@it-adi/react-components';

export interface IconProps {
    color: string;
    element: JSX.Element;
    onClick?: () => void;
}

interface CardWithIconProps extends CardProps {
    children?: ReactNode | ReactNode[];
    icon: IconProps;
}

export const CardWithIcon: FC<CardWithIconProps> = ({ children, icon, ...props }): JSX.Element => {
    const { color, element, onClick } = icon;

    return (
        <Container {...props}>
            <IconContainer color={color} copyable={!!onClick}>
                {element}
            </IconContainer>

            {children}
        </Container>
    );
};
