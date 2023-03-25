import { FC, useEffect, useMemo } from 'react';
import { Button, Col, DatePicker, Form, FormItem, Row, Select, SelectOptions, useForm } from '@adi/react-components';
import dayjs, { Dayjs } from 'dayjs';

export interface FormSearch {
    projects: string[];
    from: Dayjs;
    until: Dayjs;
}

const today = dayjs();
const from = today.clone().subtract(3, 'months');

const initialValues: FormSearch = {
    projects: [],
    from,
    until: today,
};

interface SearchFormProps {
    loading: boolean;
    onSubmit: (values: FormSearch) => void;
}

export const SearchForm: FC<SearchFormProps> = ({ loading, onSubmit }): JSX.Element => {
    const [form] = useForm<FormSearch>();

    const projectOptions: SelectOptions = useMemo(
        () => [
            {
                label: 'PeC',
                value: 'PEC',
            },
            {
                label: 'Risk',
                value: 'RISK1',
            },
            {
                label: 'Randon',
                value: 'RAN',
            },
        ],
        [],
    );

    const handleSubmit = (values: FormSearch): void => onSubmit(values);

    useEffect(() => {
        // Marcar todos os projetos como padrão
        form.setFieldsValue({ projects: projectOptions.map(({ value }) => value) });
    }, [form, projectOptions]);

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
                        <Button id="search" type="submit" variant="primary" block loading={loading}>
                            Buscar
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
};
