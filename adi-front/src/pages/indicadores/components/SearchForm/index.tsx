import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Button, Col, DatePicker, Form, FormItem, Row, Select, SelectOptions, useForm } from '@it-adi/react-components';
import dayjs, { Dayjs } from 'dayjs';
import { Search } from 'lucide-react';

export interface FormSearch {
    projects: string[];
    from: Dayjs;
    until: Dayjs;
}

export interface SearchFormRef {
    search: () => void;
}

interface SearchFormProps {
    loading: boolean;
    onSubmit: (values: FormSearch) => void;
}

const Component: ForwardRefRenderFunction<SearchFormRef, SearchFormProps> = (
    { loading, onSubmit },
    ref,
): JSX.Element => {
    const [form] = useForm<FormSearch>();

    // TODO: Mover para dentro do componente
    const [allProjectsIsSelected, setAllProjectsIsSelected] = useState<boolean>(true);

    // TODO: Validar range dos datepickers

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
    // TODO: Mover para dentro do componente
    const handleClickSelectAllProjects = (): void => setAllProjectsIsSelected((state) => !state);

    // TODO: Mover para dentro do componente
    const handleSelectAllProjects = (): void =>
        form.setFieldValue(
            'projects' as keyof FormSearch,
            projectOptions.map(({ value }) => value as string),
        );

    const handleDeselectAllProjects = (): void => form.setFieldValue('projects' as keyof FormSearch, []);

    useImperativeHandle(ref, () => ({ search: () => handleSubmit(form.getFieldsValue()) }), [form]);

    useEffect(() => form.setFieldsValue(initialValues), [form, initialValues]);

    return (
        <Form id="search-demands" form={form} onSubmit={handleSubmit}>
            <Row gutter={12} justify="center" align="middle">
                <Col xs={24} md={8}>
                    <FormItem name="projects" label="Projetos" rules={[{ required: true }]}>
                        <Select
                            id="projects"
                            mode="multiple"
                            options={projectOptions}
                            selectAll={{
                                checked: allProjectsIsSelected,
                                onClick: handleClickSelectAllProjects,
                                onSelect: handleSelectAllProjects,
                                onDeselect: handleDeselectAllProjects,
                            }}
                            placeholder="Selecione pelo menos um projeto..."
                        />
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
                        <DatePicker id="from" block format="DD/MM/YYYY" placeholder="Selecione a data de início..." />
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
                        <DatePicker id="from" block format="DD/MM/YYYY" placeholder="Selecione a data de fim..." />
                    </FormItem>
                </Col>

                <Col flex={1}>
                    <FormItem>
                        <Button id="search" type="submit" variant="primary" block loading={loading} icon={<Search />}>
                            Buscar
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
};

export const SearchForm = forwardRef(Component);
