import { Card, Col, styled } from '@it-adi/react-components';

export type ItemContainerSize = 'full' | 'md';

export const ItemContainer = styled(Col)<{ size?: ItemContainerSize }>`
    height: ${({ theme, size }) => {
        /*eslint-disable*/
        switch (size) {
            case 'full':
                return `calc(100vh - ${theme.ADIHeaderHeight} - ${theme.padding * 3}px)`;

            case 'md':
                return `calc(50vh - ${theme.ADIHeaderHeight})`;

            default:
                return 'auto';
        }
        /*eslint-enable*/
    }};
`;

export const ItemCard = styled(Card)`
    height: 100% !important;
`;
