import { NextPage } from 'next';
import { Col, Row, Space } from '@adi/react-components';
import Image from 'next/image';
import AnalysisPng from '@/assets/welcome/analysis.png';
import { Container, ImageContainer, TextsContainer, WelcomeText, WelcomeTitle } from '@/pages/components/Home/styles';
import Link from 'next/link';

const Home: NextPage = (): JSX.Element => {
    return (
        <Container justify="center" align="top">
            <Space direction="vertical">
                <Col span={24}>
                    <ImageContainer>
                        <Image
                            src={AnalysisPng}
                            alt="Ilustração de pessoas analisando informações em uma prancheta"
                            width={350}
                            height={350}
                            quality={100}
                            priority
                        />
                    </ImageContainer>
                </Col>

                <Col span={24}>
                    <Row gutter={[0, 12]} justify="center" align="middle">
                        <TextsContainer span={24}>
                            <WelcomeTitle level={1}>
                                Seja bem-vindo(a) aos
                                <br />
                                Indicadores de Desenvolvimento :)
                            </WelcomeTitle>
                        </TextsContainer>

                        <TextsContainer xs={18} sm={20}>
                            <WelcomeText size="lg">
                                Através de mim, você pode olhar os
                                <Link href="/indicadores" prefetch>
                                    {' indicadores '}
                                </Link>
                                para fazer análises verificando as estatísticas dos projetos!
                            </WelcomeText>
                        </TextsContainer>
                    </Row>
                </Col>
            </Space>
        </Container>
    );
};

export default Home;
