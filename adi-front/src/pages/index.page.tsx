import { FC } from 'react';
import { Button } from '@adi/react-components';

const Home: FC = (): JSX.Element => {
    const handleClick = () => console.log('Hello world!');

    return (
        <Button id="test" variant="primary" onClick={handleClick}>
            Click me
        </Button>
    );
};

export default Home;
