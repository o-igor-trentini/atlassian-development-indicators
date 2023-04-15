import { Col, Row, styled, Title, Text } from '@it-adi/react-components';

export const Container = styled(Row)`
    height: 100%;
`;

export const ImageContainer = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 576px) {
        > img {
            width: 260px;
            height: 260px;
        }
    }
`;

export const TextsContainer = styled(Col)`
    text-align: center;
`;

export const WelcomeTitle = styled(Title)`
    // TODO: usar token de fontSize
    font-size: 3rem !important; // 6xl

    @media (max-width: 576px) {
        font-size: 2rem !important; // 2xl
    }
`;

export const WelcomeText = styled(Text)`
    // TODO: usar token de fontSize
    font-size: 1.125rem !important; // lg

    @media (max-width: 576px) {
        font-size: 1rem !important; // md
    }
`;
