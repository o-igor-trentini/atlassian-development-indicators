import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { Checkbox, CheckboxChangeEvent } from '../../../Checkbox';
import { SelectAllContainer } from './styles';

export interface SelectAllProps {
    onChange?: (value: boolean) => void;
    onSelect: () => void;
    onDeselect: () => void;
}

export const SelectAllComponent = (
    props: SelectAllProps,
    isAllItemsSelected: Readonly<boolean>,
): ((menu: ReactElement<unknown, string | JSXElementConstructor<unknown>> | undefined) => JSX.Element) => {
    const { onChange, onSelect, onDeselect } = props;
    const [isAllSelected, setIsAllSelected] = useState<boolean>(isAllItemsSelected);

    const handle = (checked: boolean): void => {
        setIsAllSelected(checked);

        if (checked) {
            onSelect();
            return;
        }

        onDeselect();
    };

    useEffect(() => setIsAllSelected(isAllItemsSelected), [isAllItemsSelected]);

    const element = (menu: ReactElement<unknown, string | JSXElementConstructor<unknown>> | undefined): JSX.Element => {
        const handleClick = () => setIsAllSelected((state) => !state);

        const handleChange = (e: CheckboxChangeEvent): void => {
            const { checked } = e.target;

            handle(checked);

            if (onChange) onChange(checked);
        };

        return (
            <>
                <SelectAllContainer>
                    <Checkbox id="select-all" checked={isAllSelected} onClick={handleClick} onChange={handleChange}>
                        Selecionar tudo
                    </Checkbox>
                </SelectAllContainer>

                {menu}
            </>
        );
    };

    return element;
};
