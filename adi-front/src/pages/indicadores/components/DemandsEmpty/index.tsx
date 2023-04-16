import { FC } from 'react';
import { Empty } from '@it-adi/react-components';
import { Container, EmptyIcon, LoadingIcon } from '@/pages/indicadores/components/DemandsEmpty/styles';

interface DemandsEmptyProps {
    loading: boolean;
}

export const DemandsEmpty: FC<DemandsEmptyProps> = ({ loading }): JSX.Element => {
    return (
        <Container span={24}>
            {loading ? <LoadingIcon /> : <Empty image={<EmptyIcon />} description="Nenhuma demanda encontrada!" />}
        </Container>
    );
};
