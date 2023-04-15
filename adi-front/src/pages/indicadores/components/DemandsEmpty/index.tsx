import { FC } from 'react';
import { Col, Empty } from '@it-adi/react-components';
import { Icon } from '@/pages/indicadores/components/DemandsEmpty/styles';

export const DemandsEmpty: FC = (): JSX.Element => {
    return (
        <Col span={24}>
            <Empty image={<Icon />} description="Nenhuma demanda encontrada!" />
        </Col>
    );
};
