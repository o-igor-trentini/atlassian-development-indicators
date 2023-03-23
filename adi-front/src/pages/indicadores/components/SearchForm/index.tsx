import { FC, useEffect } from 'react';
import { Button, Col, DatePicker, Form, Row, Select, SelectOptions } from '@adi/react-components';
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
    projects: [],
    from: twoWeeksAgo,
    until: today,
};

interface SearchFormProps {
    onSubmit: (values: FormSearch) => void;
}

export const SearchForm: FC<SearchFormProps> = ({ onSubmit }): JSX.Element => {
    const [form] = useForm<FormSearch>();

    // TODO: Alterar projectOptions para useMemo

    const projectOptions: SelectOptions = [
        {
            label: 'PeC',
            value: 'PEC',
        },
        {
            label: 'Risk',
            value: 'RISK1',
        },
        {
            label: 'Random',
            value: 'RAN',
        },
    ];

    const handleSubmit = (values: FormSearch): void => onSubmit(values);

    useEffect(
        () =>
            // Marcar todos os projetos como padrão
            form.setFieldsValue({ projects: projectOptions.map(({ value }) => value) }),
        [form, projectOptions],
    );

    return (
        <Form id="search-demands" form={form} initialValues={initialValues} onSubmit={handleSubmit}>
            <Row gutter={12} justify="center" align="middle">
                <Col xs={24} md={8}>
                    <FormItem name="projects" label="Projetos" rules={[{ required: true }]}>
                        <Select id="projects" mode="multiple" options={projectOptions} />
                    </FormItem>
                </Col>

                <Col xs={24} md={6}>
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

                <Col xs={24} md={6}>
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
