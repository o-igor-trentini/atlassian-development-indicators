import { forwardRef, ForwardRefRenderFunction, useCallback, useEffect, useImperativeHandle, useMemo } from 'react';
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

    const handleSubmit = useCallback((values: FormSearch): void => onSubmit(values), [onSubmit]);

    const disableUntilDate = (date: dayjs.Dayjs): boolean => date && date >= dayjs();

    const validateFromDate = (fromDate?: Dayjs): boolean => {
        const values = form.getFieldsValue();
        const from = fromDate ?? values.from;

        return from && from > values.until;
    };

    const disableFromDate = (date: Dayjs): boolean => validateFromDate(date);

    const handleChangeUntilDate = (date: Dayjs | null): void => {
        if (!date || !validateFromDate()) return;

        form.setFieldValue('from' as keyof FormSearch, date);
    };

    const handleSelectAll = (): void => form.setFieldsValue({ projects: initialValues.projects });

    const handleDeselectAll = (): void => form.setFieldsValue({ projects: [] });

    useImperativeHandle(ref, () => ({ search: () => handleSubmit(form.getFieldsValue()) }), [form, handleSubmit]);

    return (
        <Form id="search-demands" form={form} initialValues={initialValues} onSubmit={handleSubmit}>
            <Row gutter={12} justify="center" align="middle">
                <Col xs={24} md={8}>
                    <FormItem name="projects" label="Projetos" rules={[{ required: true }]} valuePropName="value">
                        <Select
                            id="projects"
                            mode="multiple"
                            options={projectOptions}
                            selectAll={{
                                onSelect: handleSelectAll,
                                onDeselect: handleDeselectAll,
                            }}
                            placeholder="Selecione pelo menos um projeto..."
                        />
                    </FormItem>
                </Col>

                <Col xs={24} md={6}>
                    <FormItem
                        name="from"
                        label="De"
                        tooltip="A busca será feita pelo valor maior ou igual ao deste campo"
                        rules={[{ required: true }]}
                    >
                        <DatePicker
                            id="from"
                            block
                            format="DD/MM/YYYY"
                            placeholder="Selecione a data de início..."
                            disabledDate={disableFromDate}
                        />
                    </FormItem>
                </Col>

                <Col xs={24} md={6}>
                    <FormItem
                        name="until"
                        label="Até"
                        tooltip="A busca será feita pelo valor menor ou igual ao deste campo"
                        rules={[{ required: true }]}
                    >
                        <DatePicker
                            id="from"
                            block
                            format="DD/MM/YYYY"
                            placeholder="Selecione a data de fim..."
                            disabledDate={disableUntilDate}
                            onChange={handleChangeUntilDate}
                        />
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
