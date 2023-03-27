import { FC } from 'react';
import { Col, Empty, Row } from '@adi/react-components';
import { Frown } from 'lucide-react';

export const DemandsEmpty: FC = (): JSX.Element => {
    // TODO: Alinhar no centro usando flexGrow

    return (
        <Row justify="center" align="middle">
            <Col span={24}>
                <Empty
                    image={<Frown style={{ width: '6rem', height: '6rem' }} />}
                    description="Nenhuma demanda encontrada!"
                />
            </Col>
        </Row>
    );
};
