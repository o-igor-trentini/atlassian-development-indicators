import { FC } from 'react';
import { Button, Col, DatePicker, Form, Row } from '@adi/react-components';
import { FormItem, useForm } from '@adi/react-components';
import dayjs, { Dayjs } from 'dayjs';

export interface FormSearch {
    projects: string[];
    from: Dayjs;
    until: Dayjs;
}

const today = dayjs();
const twoWeeksAgo = today.clone().subtract(15, 'days');

const initialValues: FormSearch = {
    projects: ['PEC'],
    from: twoWeeksAgo,
    until: today,
};

interface SearchFormProps {
    onSubmit: (values: FormSearch) => void;
}

export const SearchForm: FC<SearchFormProps> = ({ onSubmit }): JSX.Element => {
    const [form] = useForm<FormSearch>();

    const handleSubmit = (values: FormSearch): void => onSubmit(values);

    return (
        <Form id="search-demands" form={form} initialValues={initialValues} onSubmit={handleSubmit}>
            <Row gutter={12} justify="center" align="middle">
                {/*<Col xs={24} md={11}>

                TODO: Adicionar select com multiple

                    <FormItem
                        name="projects"
                        label="De"
                        tooltip="A busca será feita pelo valor maior ou igual ao deste campo"
                        rules={[{ required: true }]}
                    >
                        <DatePicker id="from" block format="DD/MM/YYYY" />
                    </FormItem>
                </Col>*/}

                <Col xs={24} md={11}>
                    <FormItem
                        name="from"
                        valuePropName="date"
                        label="De"
                        tooltip="A busca será feita pelo valor maior ou igual ao deste campo"
                        rules={[{ required: true }]}
                    >
                        <DatePicker id="from" block format="DD/MM/YYYY" />
                    </FormItem>
                </Col>

                <Col xs={24} md={11}>
                    <FormItem
                        name="until"
                        valuePropName="date"
                        label="Até"
                        tooltip="A busca será feita pelo valor menor ou igual ao deste campo"
                        rules={[{ required: true }]}
                    >
                        <DatePicker id="from" block format="DD/MM/YYYY" />
                    </FormItem>
                </Col>

                <Col flex={1}>
                    <FormItem>
                        <Button id="search" variant="primary" block type="submit">
                            Buscar
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
};
