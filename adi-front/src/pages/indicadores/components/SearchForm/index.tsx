import { FC, useEffect, useMemo } from 'react';
import { Button, Col, DatePicker, Form, FormItem, Row, Select, SelectOptions, useForm } from '@adi/react-components';
import dayjs, { Dayjs } from 'dayjs';

export interface FormSearch {
    projects: string[];
    from: Dayjs;
    until: Dayjs;
}

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
            {
                label: 'Checklist 4.0',
                value: 'CHL',
            },
            {
                label: 'DEVOPS',
                value: 'OPS',
            },
            {
                label: 'JOR 4.0',
                value: 'JOR4',
            },
            {
                label: 'LOG 4.0',
                value: 'LOG4',
            },
            {
                label: 'Siga Verde',
                value: 'SV',
            },
        ],
        [],
    );

    const initialValues: FormSearch = useMemo(() => {
        const today = dayjs();
        const from = today.clone().subtract(3, 'months');

        return {
            projects: projectOptions.map(({ value }) => value as string),
            from: from,
            until: today,
        };
    }, [projectOptions]);

    const handleSubmit = (values: FormSearch): void => onSubmit(values);

    useEffect(() => form.setFieldsValue(initialValues), [form, initialValues]);

    return (
        <Form id="search-demands" form={form} onSubmit={handleSubmit}>
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
                        <DatePicker id="from" block format="DD/MM/YYYY" defaultValue={initialValues.from} />
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
                        <DatePicker id="from" block format="DD/MM/YYYY" defaultValue={initialValues.until} />
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
